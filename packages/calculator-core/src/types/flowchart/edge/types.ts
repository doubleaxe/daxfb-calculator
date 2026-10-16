import type { Edge as FlowEdge, EdgeProps } from '@vue-flow/core';

import type { IOLinkModelBase } from '#core/game/model/index.js';

export const FactoryEdgeTypeName = 'factoryEdge' as const;
export type FactoryEdgeData = {
    linkId: string;
};
export type FactoryEdgeType = FlowEdge<FactoryEdgeData, Record<string, never>, typeof FactoryEdgeTypeName>;

export type FactoryEdgeProps = {
    data: IOLinkModelBase;
};

export type FactoryEdgeInstanceProps = EdgeProps<FactoryEdgeData>;
