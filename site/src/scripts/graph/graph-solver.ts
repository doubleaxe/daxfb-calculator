/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {BlueprintItemModel, RecipeIOModel} from '../model/store';
import {Objective} from '../types';
import {Model, type Variable} from './javascript-lp-solver';
import type {Connections} from './resolve-connections';

//this uses linear programming simplex solver to solve max output for multiple flows
//external library is used for algorithm itself, we just build multiple expressions to solve
//we should take additional care to cycles, because of this we input array of SCC built previously

//model variables are item count, which can vary from 0 to max
//we should find max value for item count, which will mean max input/output

export class GraphSolver {
    private readonly model: Model;
    private readonly variables = new Map<string, Variable>();

    constructor(precision?: number) {
        this.model = new Model(precision || .001).maximize();
    }

    solve(arrayItems: BlueprintItemModel[], connections: Connections) {
        this.prepareModel(arrayItems, connections);
        this.model.solve();
        this.applySolution(arrayItems);
    }

    private prepareModel(arrayItems: BlueprintItemModel[], connections: Connections) {
        const hasLockedItems = arrayItems.some((item) => item.isLocked);
        const hasObjective = arrayItems.some((item) => item.objective !== undefined);
        const {
            model,
            variables,
        } = this;
        for(const item of arrayItems) {
            const cost = (hasObjective && (item.objective === undefined)) ? 0 : 1;
            let priority = 0;
            switch(item.objective) {
                case Objective.Secondary:
                    priority = 1;
                    break;
                case Objective.LowPriority:
                    priority = 2;
                    break;
            }
            const variable = model.addVariable(cost, item.key, false, false, priority);
            variables.set(item.key, variable);
            if(!hasLockedItems || item.isLocked || (item.objective !== undefined)) {
                //if item has objective - we must also set its limit
                model.smallerThan(item.count).addTerm(1, variable);
            }
        }

        const addTerm = function(constraint: Model.Constraint, io?: RecipeIOModel) {
            const itemVariable = variables.get(io?.ownerItem?.key || '');
            if(io && itemVariable) {
                constraint.addTerm((io.isInput ? -1 : 1) * io.cpsMax, itemVariable);
            }
        };

        //variables are added, now we add terms (io flow distribution)
        //we must balance entire input output of multiple connected items
        //this way we'll support all link types (Many to Many)
        for(const connection of connections) {
            const constraint = model.equal(0);
            for(const connectedItem of connection.connections) {
                addTerm(constraint, connectedItem);
            }
            //see https://github.com/doubleaxe/daxfb-calculator/issues/2
            //for many to many connections we should add constraint for each standalone item, otherwise we will get wrong results
            //incorrect
            /*
DAXFBESC$eNptkLsOwjAMRf_Fs4faSXGVnR-AASSUoTAAUoGqPDpU-XfcNol
A6nZzcnLjZIAruMMAd3Bgt4DQ6rKyFbKIR-gU1zcIOBsmCsYyki2jIG_FD1Z
OWPjk0jPKIqJ4Vk_9QleBhkzqemVh1UaDSKzOk66rO-UNOMpNmygWyMypqE9
DKUXywU-H9KnNxMw06JxJ98ai4x4W4C5DG583ZoNlzvST-e-gxgu4Ac66Xo_
f-9G5qxC-iGdd0g
            */
            //correct
            /*
DAXFBESC$eNptkLsOwjAMRf_Fs4faTkmVnR-AASSUoTAAUoGqPDpU-XfcNok
6dLs5OblxMsAd3GmAJzgwe0BodVmZCtlaj9Aprh8QcDYkCmIYyZRRsF_FL1Z
OWPjk0jvK1lrFs3rpV7oKFJLU9cnCpo0GkTU6T7qu7pQ34Cg37aJYIDOnoj4
NpRTJBz8d0qc2E5Np0DmT7o1F5yOswEOGJj5vzIJlzrTIjLI4qPEGboCrrrf
j9_507iqEP4ivXdQ
            */
            if((connection.inputs.length > 1) && (connection.outputs.length > 1)) {
                for(const connectedItem of connection.connections) {
                    if(connectedItem.linksCount > 1) {
                        //they is unrelevant for this bug, if other many to many bugs found - we will think
                        continue;
                    }
                    const constraint1 = connectedItem.isInput ? model.greaterThan(0) : model.smallerThan(0);
                    addTerm(constraint1, connectedItem);
                    //only one link actually
                    for(const link of connectedItem.links) {
                        const otherSide = link.getOtherSide(connectedItem);
                        addTerm(constraint1, otherSide);
                    }
                }
            }
        }
    }

    private applySolution(arrayItems: BlueprintItemModel[]) {
        for(const item of arrayItems) {
            const itemVariable = this.variables.get(item.key);
            if(!itemVariable)
                continue;
            item.setSolvedCount(itemVariable.value);
            item.resetFlow();
        }
    }
}
