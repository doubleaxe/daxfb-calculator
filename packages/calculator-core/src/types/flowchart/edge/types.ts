import type { Edge as FlowEdge } from '@xyflow/react';

import type { IOLinkModelBase } from '#core/game/model/index.js';

export const FactoryEdgeTypeName = 'factoryEdge';
export type FactoryEdgeType = FlowEdge<IOLinkModelBase, typeof FactoryEdgeTypeName>;

export type FactoryEdgeProps = {
    data: IOLinkModelBase;
};
