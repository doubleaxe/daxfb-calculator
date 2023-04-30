/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GraphLabel} from 'dagre';
import {checkAborted} from '../util';
import type {AutoLayoutGraph} from './graph-auto-layout';
import {resolveConnections} from './resolve-connections';

export const autoLayoutGraphDagre: AutoLayoutGraph = async(blueprint, layoutOptions, signal) => {
    const dagre = (await import('dagre')).default;
    checkAborted(signal);

    const dagreLayoutOptions: GraphLabel = {
        rankdir: 'LR',
        ...(layoutOptions?.nodeSpacing ? {
            nodesep: layoutOptions.nodeSpacing,
        } : {}),
        ...(layoutOptions?.connectedNodeSpacing ? {
            ranksep: layoutOptions.connectedNodeSpacing,
        } : {}),
        ...((layoutOptions?.edgeSpacing || layoutOptions?.edgeWidth) ? {
            edgesep: (layoutOptions?.edgeSpacing || 0) + (layoutOptions?.edgeWidth || 0),
        } : {}),
    };

    const g = new dagre.graphlib.Graph();
    g.setGraph(dagreLayoutOptions);
    g.setDefaultEdgeLabel(function() { return {}; });

    const items = [...blueprint.items];
    for(const item of items) {
        const rect = item.rect;
        g.setNode(item.key, {
            width: rect.width,
            height: rect.height,
        });
    }

    const connections = resolveConnections(items);
    for(const connection of connections) {
        for(const link of connection.links) {
            if(link.input?.ownerItem && link.output?.ownerItem) {
                g.setEdge(link.output.ownerItem.key, link.input.ownerItem.key);
            }
        }
    }

    dagre.layout(g);

    for(const nodeId of g.nodes()) {
        const node = g.node(nodeId);
        const item = blueprint.itemByKey(nodeId);
        if(node && item) {
            item.setRect(item.rect.assign({x: node.x, y: node.y}));
        }
    }
    blueprint.layoutChanged();
};
