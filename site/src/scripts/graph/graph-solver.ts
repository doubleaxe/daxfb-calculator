/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {BlueprintItemModel} from '../model/store';
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
        const hasLockedItems = arrayItems.some((item) => item.isLocked);
        this.prepareModel(arrayItems, connections, hasLockedItems);
        this.model.solve();
        this.applySolution(arrayItems, hasLockedItems);
    }

    private prepareModel(arrayItems: BlueprintItemModel[], connections: Connections, hasLockedItems: boolean) {
        const {
            model,
            variables,
        } = this;
        for(const item of arrayItems) {
            const variable = model.addVariable(1, item.key);
            variables.set(item.key, variable);
            if(!hasLockedItems || item.isLocked) {
                model.smallerThan(item.count).addTerm(1, variable);
            }
        }

        //variables are added, now we add terms (io flow distribution)
        //we must balance entire input output of multiple connected items
        //this way we'll support all link types (Many to Many)
        for(const connection of connections) {
            const constraint = model.equal(0);
            for(const connectedItem of connection.connections) {
                const itemVariable = variables.get(connectedItem.ownerItem?.key || '');
                if(itemVariable) {
                    constraint.addTerm((connectedItem.isInput ? -1 : 1) * connectedItem.cpsMax, itemVariable);
                }
            }
        }
    }

    private applySolution(arrayItems: BlueprintItemModel[], hasLockedItems: boolean) {
        for(const item of arrayItems) {
            const itemVariable = this.variables.get(item.key);
            if(!itemVariable)
                continue;
            item.setSolvedCount(itemVariable.value);
            item.resetFlow();
        }
    }
}
