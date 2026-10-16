import type { Node as FlowNode, NodeProps } from '@vue-flow/core';

import type { FactoryModelBase } from '#core/game/model/index.js';

export const FactoryNodeTypeName = 'factoryNode' as const;
export type FactoryNodeData = {
    itemId: string;
};
export type FactoryNodeType = FlowNode<FactoryNodeData, Record<string, never>, typeof FactoryNodeTypeName>;

export type FactoryNodeProps = {
    data: FactoryModelBase;
};

export type FactoryNodeInstanceProps = NodeProps<FactoryNodeData>;

export const NodeDragHandleClass = 'node-drag-handle';
