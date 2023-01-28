/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
import type {BlueprintItemModel, BlueprintModel} from '../model/store';
import {GraphSolver} from './graph-solver';
import {TarjanGraphWalker} from './graph-walker';

function markCycle(arrayCycle: BlueprintItemModel[], partOfCycle: boolean) {
    for(const item of arrayCycle) {
        item.partOfCycle = partOfCycle;
    }
    return partOfCycle;
}

export function solveGraph(blueprint: BlueprintModel, items: IterableIterator<BlueprintItemModel>, precision?: number) {
    let blueprintHasCycles = false;
    const arraySeparateGraphs = new TarjanGraphWalker().walkGraph(items);

    for(const arrayScc of arraySeparateGraphs) {
        let hasCycles = false;
        for(const scc of arrayScc) {
            hasCycles ||= markCycle(scc, (scc.length > 1));
        }
        if(hasCycles) {
            blueprintHasCycles = true;
            arrayScc.flat().forEach((item) => item.setSolvedCount(undefined));
        }
        //DAG = directed acyclic graph (maybe cycles)
        const arrayDag: BlueprintItemModel[] = arrayScc.flat();
        new GraphSolver(precision).solve(arrayDag);
    }
    blueprint.hasCycles = blueprintHasCycles;
}
