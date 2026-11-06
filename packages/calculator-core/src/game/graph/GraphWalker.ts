import type { FactoryModelBase, IOLinkModelBase } from '../model/index.js';

export type DiscoveredIsland = {
    items: FactoryModelBase[];
    links: IOLinkModelBase[];
};

/**
 * Crawls and reconstructs complete connected islands.
 *
 * - If `seedItems` has 1 item: returns 1 complete island containing that item and its full network.
 * - If `seedItems` has multiple items: returns all unique islands containing any of those items.
 * - If `seedItems` has all factory items: partitions the whole factory into separate islands.
 */
export function findIslands(seedItems: Iterable<FactoryModelBase>): DiscoveredIsland[] {
    const globalVisitedItems = new Set<string>();
    const islands: DiscoveredIsland[] = [];

    for (const seed of seedItems) {
        if (globalVisitedItems.has(seed.itemId)) {
            continue;
        }

        const island = crawlSingleIsland(seed, globalVisitedItems);
        islands.push(island);
    }

    return islands;
}

/**
 * Undirected BFS starting from one item, traversing both inputs and outputs.
 */
function crawlSingleIsland(startItem: FactoryModelBase, globalVisitedItems: Set<string>): DiscoveredIsland {
    const islandItems: FactoryModelBase[] = [];
    const islandLinks = new Map<string, IOLinkModelBase>();

    const queue: FactoryModelBase[] = [startItem];
    globalVisitedItems.add(startItem.itemId);

    while (queue.length > 0) {
        const currentItem = queue.shift()!;
        islandItems.push(currentItem);

        const recipe = currentItem.selectedRecipe;
        if (!recipe) continue;

        for (const port of recipe.ports) {
            for (const link of port.links) {
                // Collect link once per island
                if (!islandLinks.has(link.linkId)) {
                    islandLinks.set(link.linkId, link);
                }

                // Find the item on the other side of this link
                const otherSidePort = link.getOtherSide(port);
                const neighborItem = otherSidePort?.factory;

                if (neighborItem && !globalVisitedItems.has(neighborItem.itemId)) {
                    globalVisitedItems.add(neighborItem.itemId);
                    queue.push(neighborItem);
                }
            }
        }
    }

    return {
        items: islandItems,
        links: Array.from(islandLinks.values()),
    };
}
