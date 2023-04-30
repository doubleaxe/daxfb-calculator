/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {BlueprintItemModel, BlueprintModel} from '../model/store';
import {GraphSolver} from './graph-solver';
import {TarjanGraphWalker} from './graph-walker';
import {distributeLinksFlow} from './link-solver';
import {resolveConnections} from './resolve-connections';

function markCycle(arrayCycle: BlueprintItemModel[], partOfCycle: boolean) {
    for(const item of arrayCycle) {
        item.partOfCycle = partOfCycle;
    }
    return partOfCycle;
}

export function resetOrSolveGraph(blueprint: BlueprintModel, items: IterableIterator<BlueprintItemModel>, solve: boolean, precision?: number) {
    let blueprintHasCycles = false;
    const arraySeparateGraphs = new TarjanGraphWalker().walkGraph(items);

    for(const arrayScc of arraySeparateGraphs) {
        let hasCycles = false;
        for(const scc of arrayScc) {
            hasCycles ||= markCycle(scc, (scc.length > 1));
        }
        if(hasCycles) {
            blueprintHasCycles = true;
        }
        //DAG = directed acyclic graph (maybe cycles)
        const arrayDag: BlueprintItemModel[] = arrayScc.flat();
        const connections = resolveConnections(arrayDag);
        if(solve) {
            new GraphSolver(precision).solve(arrayDag, connections);
            distributeLinksFlow(connections, precision);
        } else {
            for(const item of arrayDag) {
                item.setSolvedCount(undefined);
                item.resetFlow();
            }
        }
    }
    blueprint.hasCycles = blueprintHasCycles;
}

export {LayoutType, layoutFactory, knownLayoutAlgorithms, type CommonLayoutOptions} from './graph-auto-layout';
