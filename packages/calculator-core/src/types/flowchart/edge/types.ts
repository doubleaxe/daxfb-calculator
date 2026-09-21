import type { Edge as FlowEdge } from '@vue-flow/core';

import type { IOLinkModelBase } from '#core/game/model/index.js';

export const FactoryEdgeTypeName = 'factoryEdge';
export type FactoryEdgeData = {
    linkId: string;
};
export type FactoryEdgeType = FlowEdge<FactoryEdgeData, Record<string, never>, typeof FactoryEdgeTypeName>;

export type FactoryEdgeProps = {
    data: IOLinkModelBase;
};
