import type {BlueprintItemModel} from '../model/store';
import {GraphSolver} from './graph-solver';
import {TarjanGraphWalker} from './graph-walker';

export function solveGraph(items: IterableIterator<BlueprintItemModel>, isFullGraph: boolean) {
    const arrayScc = new TarjanGraphWalker().walkGraph(items, isFullGraph);
    new GraphSolver().solve(arrayScc);
}
