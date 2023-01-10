import type {BlueprintItemModel, RecipeIOModel} from '../model/store';
import {newModel, type Variable} from './solver-wrapper';

//this uses linear programming simplex solver to solve max output for multiple flows
//external library is used for algorithm itself, we just build multiple expressions to solve
//we should take additional care to cycles, because of this we input array of SCC built previously

//model variables are item count, which can vary from 0 to max
//we should find max value for item count, which will mean max input/output

export class GraphSolver {
    private readonly model = newModel(.001).maximize();
    private readonly variables = new Map<string, Variable>();

    solve(arrayItems: BlueprintItemModel[]) {
        this.prepareModel(arrayItems);
        this.model.solve();
        this.applySolution(arrayItems);
    }
    private prepareModel(arrayItems: BlueprintItemModel[]) {
        const {
            model,
            variables,
        } = this;
        const processedLinks = new Set<string>();
        for(const item of arrayItems) {
            const variable = model.addVariable(1, item.key);
            variables.set(item.key, variable);
            model.smallerThan(item.count).addTerm(1, variable);
        }

        //variables are added, now we add terms (io flow distribution)
        for(const item of arrayItems) {
            //we must balance entire input output of multiple connected items
            //this way we'll support all link types (Many to Many)
            const recipe = item.selectedRecipe;
            if(!recipe)
                continue;
            const output = recipe.output;
            for(const outItem of output) {
                const links = new Set<string>();
                const connectedItems = new Map<string, RecipeIOModel>();
                GraphSolver.grabAllConnectedLinks(outItem, links, connectedItems, true);
                //no need for term if there is no links
                if(!links.size)
                    continue;
                if(links.size > 1) {
                    //if we already processed any link - then we found it through some other item, we must skip
                    //this is only may be case of multilink (multiple output to single input)
                    const linksPorcessed = [...links].some((l) => {
                        const has = processedLinks.has(l);
                        processedLinks.add(l);
                        return has;
                    });
                    if(linksPorcessed)
                        continue;
                }

                const constraint = model.equal(0);
                for(const connectedItem of connectedItems.values()) {
                    const itemVariable = variables.get(connectedItem.ownerItem?.key || '');
                    if(itemVariable) {
                        constraint.addTerm((connectedItem.isInput ? -1 : 1) * connectedItem.cpsMax, itemVariable);
                    }
                }
            }
        }
    }
    private static grabAllConnectedLinks(
        item: RecipeIOModel,
        links: Set<string>,
        connectedItems: Map<string, RecipeIOModel>,
        output: boolean,
    ) {
        for(const link of item.links) {
            if(links.has(link.key))
                continue;
            links.add(link.key);
            link.input && connectedItems.set(link.input.key, link.input);
            link.output && connectedItems.set(link.output.key, link.output);
            //add all links from other side
            const otherItem = output ? link.input : link.output;
            if(!otherItem)
                continue;
            this.grabAllConnectedLinks(otherItem, links, connectedItems, !output);
        }
    }
    private applySolution(arrayItems: BlueprintItemModel[]) {
        for(const item of arrayItems) {
            const itemVariable = this.variables.get(item.key);
            if(!itemVariable)
                continue;
            item.setSolvedCount(itemVariable.value);
        }
    }
}
