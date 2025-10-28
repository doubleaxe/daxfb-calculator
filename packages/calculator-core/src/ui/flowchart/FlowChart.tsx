import { useDndMonitor } from '@dnd-kit/core';
import type { Node as FlowNode } from '@xyflow/react';
import { Background, Controls, ReactFlow, useNodesState, useReactFlow } from '@xyflow/react';
import { action, reaction } from 'mobx';

import type { FactoryModelBase } from '#core/game/model';
import { useFlowChartModelBase } from '#core/game/model';
import { useReaction } from '#core/utils/hooks';

import FactoryNode from './node/FactoryNode';
import type { FactoryNodeType } from './node/types';
import { FactoryNodeTypeName } from './node/types';
import { FlowChartDroppable } from './types';

const nodeTypes = {
    [FactoryNodeTypeName]: FactoryNode,
};

function syncNodes(nds: FactoryNodeType[], items: FactoryModelBase[]) {
    const oldNodes = new Map(nds.map((n) => [n.id, n]));
    const newNodes = items.map((factory) => {
        let node = oldNodes.get(factory.itemId);
        node ??= {
            id: factory.itemId,
            type: FactoryNodeTypeName,
            position: factory.position,
            data: factory,
            dragHandle: '[data-drag-handle]',
        };
        return node;
    });
    return newNodes;
}

export default function FlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<FactoryNodeType>([]);
    const { screenToFlowPosition } = useReactFlow();
    const flowChartModel = useFlowChartModelBase();

    useReaction(
        () =>
            reaction(
                () => flowChartModel.items,
                (items) => {
                    // sync schema and react flow
                    setNodes(syncNodes(nodes, [...items]));
                },
                { delay: 1 }
            ),
        [flowChartModel, setNodes, nodes]
    );

    const onNodeDragStop = action((event: React.MouseEvent, node: FlowNode) => {
        if (node.type === FactoryNodeTypeName) {
            const data: FactoryModelBase = (node as FactoryNodeType).data;
            data.setPosition(node.position);
        }
    });

    useDndMonitor({
        onDragEnd(event) {
            if (event.over?.id !== FlowChartDroppable) {
                return;
            }
            const factoryKey = event.active.id;
            const factory = flowChartModel.addItem(String(factoryKey));
            const rect = event.active.rect.current.translated;
            const position = screenToFlowPosition({
                x: rect?.left ?? 0,
                y: rect?.top ?? 0,
            });
            factory.setPosition(position);
        },
    });

    return (
        <ReactFlow nodeTypes={nodeTypes} nodes={nodes} onNodeDragStop={onNodeDragStop} onNodesChange={onNodesChange}>
            <Background />
            <Controls />
        </ReactFlow>
    );
}
