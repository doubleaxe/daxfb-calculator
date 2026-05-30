import type { Node as FlowNode } from '@xyflow/react';

import type { FactoryModelBase } from '#core/game/model/index.js';

export const FactoryNodeTypeName = 'factoryNode';
export type FactoryNodeData = {
    // cannot keep FactoryModelBase here, because it is mobx controlled
    // sometimes react copies props outside of mobx context, and mobx complain
    itemId: string;
};
export type FactoryNodeType = FlowNode<FactoryNodeData, typeof FactoryNodeTypeName>;

export type FactoryNodeProps = {
    data: FactoryModelBase;
};

export const NodeDragHandleClass = 'node-drag-handle';
