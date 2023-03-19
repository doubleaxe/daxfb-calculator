/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {BlueprintItemModel, LinkModel, RecipeIOModel} from '../model/store';

export type ConnectedItems = {
    connections: RecipeIOModel[];
    inputs: RecipeIOModel[];
    outputs: RecipeIOModel[];
    links: LinkModel[];
};
export type Connections = ConnectedItems[];

function grabAllConnectedLinks(
    item: RecipeIOModel,
    links: Map<string, LinkModel>,
    connectedItems: Map<string, RecipeIOModel>,
    output: boolean,
) {
    for(const link of item.links) {
        if(links.has(link.key))
            continue;
        links.set(link.key, link);
        link.input && connectedItems.set(link.input.key, link.input);
        link.output && connectedItems.set(link.output.key, link.output);
        //add all links from other side
        const otherItem = output ? link.input : link.output;
        if(!otherItem)
            continue;
        grabAllConnectedLinks(otherItem, links, connectedItems, !output);
    }
}

//takes array of connected factories chain and resolves connections of each factory io
export function resolveConnections(arrayItems: BlueprintItemModel[]): Connections {
    const resultConnections: Connections = [];
    const processedLinks = new Set<string>();
    for(const item of arrayItems) {
        const recipe = item.selectedRecipe;
        if(!recipe)
            continue;
        const output = recipe.output;
        for(const outItem of output) {
            const links = new Map<string, LinkModel>();
            const connectedItems = new Map<string, RecipeIOModel>();
            grabAllConnectedLinks(outItem, links, connectedItems, true);
            //skip if there is no links
            if(!links.size) {
                continue;
            }
            const linksArray = [...links.values()];
            if(links.size > 1) {
                //if we already processed any link - then we found it through some other item, we must skip
                //this is only may be case of multilink (multiple output to single input)
                const linksPorcessed = linksArray.some((l) => {
                    const has = processedLinks.has(l.key);
                    processedLinks.add(l.key);
                    return has;
                });
                if(linksPorcessed)
                    continue;
            }
            const connections = [...connectedItems.values()];
            const {inputs, outputs} = connections.reduce(
                (acc: {inputs: RecipeIOModel[]; outputs: RecipeIOModel[]}, connectedItem) => {
                    if(connectedItem.isInput) {
                        acc.inputs.push(connectedItem);
                    } else {
                        acc.outputs.push(connectedItem);
                    }
                    return acc;
                },
                {inputs: [], outputs: []},
            );
            resultConnections.push({
                connections,
                inputs,
                outputs,
                links: linksArray,
            });
        }
    }
    return resultConnections;
}
