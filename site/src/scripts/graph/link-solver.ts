/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {LinkModel, RecipeIOModel} from '../model/store';
import type {Connections} from './resolve-connections';
import {Model, type Variable} from './javascript-lp-solver';

function distributeSimpleFlow(flow: RecipeIOModel[]) {
    for(const io of flow) {
        //should be only one link
        const _links = io.links;
        for(const link of _links) {
            link.setFlow(io.cpsSolvedTotal);
        }
    }
}

function distributeComplexFlow(flow: RecipeIOModel[], links: LinkModel[], precision?: number) {
    //use linear algebra again to find distribuion of complex flow
    //each link is variable, each io is condition
    const model = new Model(precision || .001).maximize();
    const variables = new Map<string, Variable>();
    for(const link of links) {
        const variable = model.addVariable(1, link.key);
        variables.set(link.key, variable);
    }
    for(const io of flow) {
        const constraint = model.equal(io.cpsSolvedTotal || 0);
        const _links = io.links;
        for(const link of _links) {
            const variable = variables.get(link.key);
            if(!variable)
                continue;
            constraint.addTerm(1, variable);
        }
    }
    model.solve();
    for(const link of links) {
        const variable = variables.get(link.key);
        if(!variable)
            continue;
        link.setFlow(variable.value);
    }
}

//solves flow on each individual link
export function distributeLinksFlow(connections: Connections, precision?: number) {
    for(const connection of connections) {
        //simplest cases - one to one, one to many, many to one
        //we just distribute flow between one and many
        if(connection.inputs.length == 1) {
            distributeSimpleFlow(connection.outputs);
        } else if(connection.outputs.length == 1) {
            distributeSimpleFlow(connection.inputs);
        } else {
            //many to many
            distributeComplexFlow(connection.connections, connection.links, precision);
        }
    }
}
