import type { Node as FlowNode } from '@xyflow/react';

import type { FactoryModelBase } from '#core/game/model';

export const FactoryNodeTypeName = 'factoryNode';
export type FactoryNodeType = FlowNode<FactoryModelBase, typeof FactoryNodeTypeName>;

export type FactoryNodeProps = {
    data: FactoryModelBase;
};
