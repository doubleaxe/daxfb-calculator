import type { FactoryModelBase } from '../model/index.js';
import { GlpkGraphSolver } from './GraphSolver.js';
import { findIslands } from './GraphWalker.js';

async function _solveGraph(solver: GlpkGraphSolver, items: Iterable<FactoryModelBase>) {
    const arraySeparateIslands = findIslands(items);

    for (const island of arraySeparateIslands) {
        await solver.solve(island.items, island.links);
    }
}

export function solveGraph(items: Iterable<FactoryModelBase>) {
    return _solveGraph(new GlpkGraphSolver(), items);
}

export function useSolveGraphSingleton() {
    const solver = new GlpkGraphSolver();
    let solving = Promise.resolve();

    return (items: Iterable<FactoryModelBase>) => {
        solving = solving.then(() => _solveGraph(solver, items));
        return solving;
    };
}
