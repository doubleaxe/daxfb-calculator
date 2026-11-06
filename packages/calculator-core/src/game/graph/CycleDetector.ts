/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Clean Separation: WCC (Island Partitioning) + Standard Tarjan (Cycle Detection)
*/
import type { FactoryModelBase, IOLinkModelBase } from '../model/index.js';

/**
 * Standard, textbook Tarjan's algorithm on directed edges.
 * Marks item.partOfCycle = true for any node in an SCC of size > 1
 * or any node with a self-loop.
 */
export function detectCycles(items: FactoryModelBase[], links: IOLinkModelBase[]): FactoryModelBase[][] {
    const itemMap = new Map<string, FactoryModelBase>();
    const outAdj = new Map<string, Set<string>>();

    for (const item of items) {
        itemMap.set(item.itemId, item);
        outAdj.set(item.itemId, new Set());
        item.partOfCycle = false;
    }

    for (const link of links) {
        const from = link.output?.factory?.itemId;
        const to = link.input?.factory?.itemId;
        if (from && to && itemMap.has(from) && itemMap.has(to)) {
            outAdj.get(from)!.add(to);
        }
    }

    let index = 0;
    const indices = new Map<string, number>();
    const lowlinks = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const detectedCycles: FactoryModelBase[][] = [];

    function strongConnect(u: string) {
        indices.set(u, index);
        lowlinks.set(u, index);
        index++;
        stack.push(u);
        onStack.add(u);

        for (const v of outAdj.get(u)!) {
            if (!indices.has(v)) {
                strongConnect(v);
                lowlinks.set(u, Math.min(lowlinks.get(u)!, lowlinks.get(v)!));
            } else if (onStack.has(v)) {
                lowlinks.set(u, Math.min(lowlinks.get(u)!, indices.get(v)!));
            }
        }

        // Root of SCC found
        if (lowlinks.get(u) === indices.get(u)) {
            const scc: FactoryModelBase[] = [];
            let w: string;
            do {
                w = stack.pop()!;
                onStack.delete(w);
                scc.push(itemMap.get(w)!);
            } while (w !== u);

            // A cycle is an SCC with >1 nodes, or a 1-node self-loop
            const isCycle = scc.length > 1 || outAdj.get(u)!.has(u);
            if (isCycle) {
                for (const node of scc) {
                    node.partOfCycle = true;
                }
                detectedCycles.push(scc);
            }
        }
    }

    for (const itemKey of itemMap.keys()) {
        if (!indices.has(itemKey)) {
            strongConnect(itemKey);
        }
    }

    return detectedCycles;
}
