/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {ElkExtendedEdge, ElkNode, ElkPort} from 'elkjs';
import {checkAborted} from '../util';
import type {AutoLayoutGraph} from './graph-auto-layout';
import {resolveConnections} from './resolve-connections';

export const autoLayoutGraphElk: AutoLayoutGraph = async(blueprint, layoutOptions, signal) => {
    const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
    checkAborted(signal);

    const elk = new ELK();
    const items = [...blueprint.items];
    const nodes: ElkNode[] = [];
    for(const item of items) {
        const rect = item.rect;
        const ports: ElkPort[] = [];
        for(const io of (item.selectedRecipe?.items || [])) {
            if(io.isHidden) {
                continue;
            }
            const iorect = io.rect;
            //port coordinates are relative to parent
            const relativeRect = iorect.offsetBy(rect, -1);
            ports.push({
                id: io.key,
                x: relativeRect.x,
                y: relativeRect.y,
                width: relativeRect.width,
                height: relativeRect.height,
                layoutOptions: {
                    'org.eclipse.elk.portConstraints': 'FIXED_POS',
                },
            });
        }
        nodes.push({
            id: item.key,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            ports,
            layoutOptions: {
                'org.eclipse.elk.direction': item.isFlipped ? 'LEFT' : 'RIGHT',
            },
        });
    }

    const edges: ElkExtendedEdge[] = [];
    const connections = resolveConnections(items);
    for(const connection of connections) {
        for(const link of connection.links) {
            if(link.input?.ownerItem && link.output?.ownerItem) {
                edges.push({
                    id: link.key,
                    sources: [link.output.key],
                    targets: [link.input.key],
                });
            }
        }
    }

    /*
    const knownLayoutOptions = await elk.knownLayoutOptions();
    console.log(knownLayoutOptions);
    const knownLayoutAlgorithms = await elk.knownLayoutAlgorithms();
    console.log(knownLayoutAlgorithms);
    */

    const rootElement = {
        id: 'root',
        children: nodes,
        edges,
    };
    //aspectRatio
    //nodeFlexibility
    //adaptPortPositions
    const elkLayoutOptions = {
        ...layoutOptions?.customOptions,
        ...(layoutOptions?.nodeSpacing ? {
            'org.eclipse.elk.spacing.nodeNode': String(layoutOptions.nodeSpacing),
        } : {}),
        ...(layoutOptions?.connectedNodeSpacing ? {
            'org.eclipse.elk.spacing.componentComponent': String(layoutOptions.connectedNodeSpacing),
        } : {}),
        ...(layoutOptions?.edgeSpacing ? {
            'org.eclipse.elk.spacing.edgeEdge': String(layoutOptions.edgeSpacing),
        } : {}),
        ...(layoutOptions?.edgeWidth ? {
            'org.eclipse.elk.edge.thickness': String(layoutOptions.edgeWidth),
        } : {}),
        ...(layoutOptions?.preserveLayoutOrder ? {
            'org.eclipse.elk.layered.considerModelOrder.strategy': 'PREFER_NODES',
            'org.eclipse.elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
        } : {}),
    };

    const root = await elk.layout(rootElement, {layoutOptions: elkLayoutOptions});
    checkAborted(signal);

    for(const node of (root.children || [])) {
        const item = blueprint.itemByKey(node.id);
        if(item) {
            item.setRect(item.rect.assign({x: node.x, y: node.y}));
        }
    }
    blueprint.layoutChanged();
};
