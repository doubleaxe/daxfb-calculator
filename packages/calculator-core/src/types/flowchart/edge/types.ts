import type { Edge as FlowEdge } from '@xyflow/react';

import type { IOLinkModelBase } from '#core/game/model/index.js';

export const FactoryEdgeTypeName = 'factoryEdge';
export type FactoryEdgeData = {
    // cannot keep IOLinkModelBase here, because it is mobx controlled
    // sometimes react copies props outside of mobx context, and mobx complain
    linkId: string;
};
export type FactoryEdgeType = FlowEdge<FactoryEdgeData, typeof FactoryEdgeTypeName>;

export type FactoryEdgeProps = {
    data: IOLinkModelBase;
};
