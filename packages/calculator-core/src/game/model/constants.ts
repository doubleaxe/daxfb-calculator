export const NodeStatus = {
    None: 'None',
    Source: 'Source',
    Target: 'Target',
    PossibleTarget: 'PossibleTarget',
    ConnectedTarget: 'ConnectedTarget',
} as const;

export type NodeStatus = (typeof NodeStatus)[keyof typeof NodeStatus];

export const EdgeStatus = {
    None: 'None',
    Source: 'Source',
    Target: 'Target',
    ConnectedTarget: 'ConnectedTarget',
} as const;

export type EdgeStatus = (typeof EdgeStatus)[keyof typeof EdgeStatus];

export const NodeEdgeStatus = {
    ...NodeStatus,
    ...EdgeStatus,
};

export type NodeEdgeStatus = (typeof NodeEdgeStatus)[keyof typeof NodeEdgeStatus];
