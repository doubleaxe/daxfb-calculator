import type { Node as FlowNode } from '@vue-flow/core';

import type { FactoryModelBase } from '#core/game/model/index.js';

export const FactoryNodeTypeName = 'factoryNode';
export type FactoryNodeData = {
    itemId: string;
};
export type FactoryNodeType = FlowNode<FactoryNodeData, Record<string, never>, typeof FactoryNodeTypeName>;

export type FactoryNodeProps = {
    data: FactoryModelBase;
};

export const NodeDragHandleClass = 'node-drag-handle';
