import GLPK, { type LP } from 'glpk.js';

import type { FactoryModelBase, IOLinkModelBase } from '../model/index.js';

type Glpk = Awaited<ReturnType<typeof GLPK>>;

export class GlpkGraphSolver {
    private glpkInstance: Glpk | undefined;

    private static readonly SLACK_PENALTY = 10000;
    private static readonly CYCLE_BREAK_EPSILON = 0.0001;
    private static readonly SINK_FLOW_EPSILON = 0.01;

    private async getGlpk() {
        // Initialize WebAssembly engine
        this.glpkInstance ??= await GLPK();
        return this.glpkInstance;
    }

    public async solve(items: FactoryModelBase[], links: IOLinkModelBase[]) {
        const glpk = await this.getGlpk();
        const lp = this.generateLp(glpk, items, links);

        const result = await glpk.solve(lp, {
            // Suppress stdout
            msglev: glpk.GLP_MSG_OFF,
            // Use presolver to compress sparse matrix
            presol: true,
        });

        const status = result.result?.status;
        const isOptimal = status === glpk.GLP_OPT || status === glpk.GLP_FEAS;
        this.applySolution(isOptimal, result.result?.vars ?? {}, items, links);
    }

    private generateLp(glpk: Glpk, items: FactoryModelBase[], links: IOLinkModelBase[]): LP {
        const objectiveVars: LP['objective']['vars'] = [];
        const subjectTo: LP['subjectTo'] = [];
        const bounds: NonNullable<LP['bounds']> = [];

        // 1. OBJECTIVE
        const hasAnyTarget = items.some((i) => !i.locked && i.weight !== undefined);

        for (const item of items) {
            if (item.locked) continue;
            const weight = hasAnyTarget ? (item.weight ?? 0) : 1;
            if (weight !== 0) {
                objectiveVars.push({ name: `m_${item.itemId}`, coef: weight });
            }
        }

        // Add tiny penalty to link flows to stop zero-cost cycle loops
        for (const link of links) {
            objectiveVars.push({
                name: `l_${link.linkId}`,
                coef: -GlpkGraphSolver.CYCLE_BREAK_EPSILON,
            });
        }

        // Add heavy penalty to sinks (surplus) and sources (deficits)
        // only penalize internal bottlenecks
        for (const item of items) {
            for (const outIo of item.selectedRecipe?.output ?? []) {
                if (outIo.linksCount > 0) {
                    objectiveVars.push({
                        name: `sink_${outIo.itemId}`,
                        coef: -GlpkGraphSolver.SLACK_PENALTY,
                    });
                }
            }
            for (const inIo of item.selectedRecipe?.input ?? []) {
                if (inIo.linksCount > 0) {
                    objectiveVars.push({
                        name: `src_${inIo.itemId}`,
                        coef: -GlpkGraphSolver.SLACK_PENALTY,
                    });
                }
            }
        }

        // 2. CONSTRAINTS
        for (const item of items) {
            const mKey = item.itemId;

            for (const outIo of item.selectedRecipe?.output ?? []) {
                const outKey = outIo.itemId;
                const vars: LP['subjectTo'][number]['vars'] = [];

                for (const link of outIo.links) {
                    vars.push({ name: `l_${link.linkId}`, coef: -1 });
                }

                vars.push({ name: `sink_${outKey}`, coef: -1 });
                vars.push({ name: `m_${mKey}`, coef: outIo.cpsMax });
                subjectTo.push({
                    name: `c_out_${outKey}`,
                    vars,
                    bnds: { type: glpk.GLP_FX, ub: 0, lb: 0 },
                });
            }

            for (const inIo of item.selectedRecipe?.input ?? []) {
                const inKey = inIo.itemId;
                const vars: LP['subjectTo'][number]['vars'] = [];

                for (const link of inIo.links) {
                    vars.push({ name: `l_${link.linkId}`, coef: 1 });
                }

                vars.push({ name: `src_${inKey}`, coef: 1 });
                vars.push({ name: `m_${mKey}`, coef: -inIo.cpsMax });
                subjectTo.push({
                    name: `c_in_${inKey}`,
                    vars,
                    bnds: { type: glpk.GLP_FX, ub: 0, lb: 0 },
                });
            }
        }

        // 3. BOUNDS
        for (const item of items) {
            const name = `m_${item.itemId}`;
            const targetCount = item.count ?? 1;

            if (item.locked) {
                bounds.push({ name, type: glpk.GLP_FX, lb: targetCount, ub: targetCount });
            } else {
                bounds.push({ name, type: glpk.GLP_DB, lb: 0, ub: targetCount });
            }
        }

        for (const link of links) {
            bounds.push({ name: `l_${link.linkId}`, type: glpk.GLP_LO, lb: 0, ub: 0 });
        }

        for (const item of items) {
            for (const outIo of item.selectedRecipe?.output ?? []) {
                bounds.push({ name: `sink_${outIo.itemId}`, type: glpk.GLP_LO, lb: 0, ub: 0 });
            }
            for (const inIo of item.selectedRecipe?.input ?? []) {
                bounds.push({ name: `src_${inIo.itemId}`, type: glpk.GLP_LO, lb: 0, ub: 0 });
            }
        }

        return {
            name: 'FactoryFlow',
            objective: {
                direction: glpk.GLP_MAX,
                name: 'obj',
                vars: objectiveVars,
            },
            subjectTo,
            bounds,
        };
    }

    private applySolution(
        isOptimal: boolean,
        vars: Record<string, number>,
        items: FactoryModelBase[],
        links: IOLinkModelBase[]
    ) {
        // Apply factory rates
        for (const item of items) {
            const val = vars[`m_${item.itemId}`] ?? 0;
            item.setSolvedCount(isOptimal ? Math.max(0, val) : 0);
            item.resetSolutionStatus();
        }

        // Apply link flows directly
        for (const link of links) {
            const flow = vars[`l_${link.linkId}`] ?? 0;
            link.setFlow(isOptimal ? Math.max(0, flow) : 0);
        }

        if (!isOptimal) {
            for (const item of items) item.chainContainsError = true;
            return;
        }

        // Evaluate slack activation for unbalanced ports
        for (const item of items) {
            let hasUnbalancedSlack = false;

            for (const outIo of item.selectedRecipe?.output ?? []) {
                const sinkFlow = vars[`sink_${outIo.itemId}`] ?? 0;
                if (outIo.linksCount > 0 && sinkFlow > GlpkGraphSolver.SINK_FLOW_EPSILON) {
                    outIo.setCausesSolvingError(true);
                    hasUnbalancedSlack = true;
                }
            }

            for (const inIo of item.selectedRecipe?.input ?? []) {
                const srcFlow = vars[`src_${inIo.itemId}`] ?? 0;
                if (inIo.linksCount > 0 && srcFlow > GlpkGraphSolver.SINK_FLOW_EPSILON) {
                    inIo.setCausesSolvingError(true);
                    hasUnbalancedSlack = true;
                }
            }

            if (hasUnbalancedSlack) {
                item.chainContainsError = true;
            }
        }
    }
}
