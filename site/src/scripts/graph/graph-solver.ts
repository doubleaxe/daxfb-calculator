import type {BlueprintItemModel} from '../model/store';
import {newModel, type Variable} from './solver-wrapper';

//this uses linear programming simplex solver to solve max output for multiple flows
//external library is used for algorithm itself, we just build multiple expressions to solve
//we should take additional care to cycles, because of this we input array of SCC built previously

//model variables are item count, which can vary from 0 to max
//we should find max value for item count, which will mean max input/output

export class GraphSolver {
    private readonly model = newModel(.01).maximize();
    private readonly variables = new Map<string, Variable>();

    solve(arrayScc: BlueprintItemModel[][]) {
        const {
            model,
            variables
        } = this;
        for(const scc of arrayScc) {
            if(scc.length > 1)
                throw new Error('Cycles are not yet supported');
            const item = scc[0];
            const variable = model.addVariable(1, item.key);
            variables.set(item.key, variable);
            model.smallerThan(item.count).addTerm(1, variable);
        }

        //variables are added, now we add terms (io flow distribution)
        for(const scc of arrayScc) {
            if(scc.length > 1)
                throw new Error('Cycles are not yet supported');
            const item = scc[0];
            const itemVariable = variables.get(item.key);
            //we add complex terms for output, they will be automatic for input
            //this way we'll support all link types (Many to Many)
            const recipe = item.selectedRecipe;
            if(!recipe || !itemVariable)
                continue;
            const output = recipe.output;
            for(const outItem of output) {
                //no need for term if there is no links
                const links = [...outItem.links];
                if(!links.length)
                    continue;
                const constraint = model.equal(0).addTerm(outItem.cpsMax, itemVariable);
                for(const link of links) {
                    const inputItem = link.input;
                    const inputVariable = variables.get(inputItem?.ownerItem?.key || '');
                    if(!inputItem || !inputVariable)
                        continue;
                    constraint.addTerm(-inputItem.cpsMax, inputVariable);
                }
            }
        }
        model.solve();
    }
}
