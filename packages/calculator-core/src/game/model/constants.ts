export const NodeStatus = {
    None: 'None',
    ConnectionOrigin: 'ConnectionOrigin',
    ConnectionDest: 'ConnectionDest',
    PossibleDest: 'PossibleDest',
    ConnectedDest: 'ConnectedDest',
} as const;

export type NodeStatus = (typeof NodeStatus)[keyof typeof NodeStatus];

export const EdgeStatus = {
    None: 'None',
    ConnectionOrigin: 'ConnectionOrigin',
    ConnectionDest: 'ConnectionDest',
    ConnectedDest: 'ConnectedDest',
} as const;

export type EdgeStatus = (typeof EdgeStatus)[keyof typeof EdgeStatus];

export const NodeEdgeStatus = {
    ...NodeStatus,
    ...EdgeStatus,
};

export type NodeEdgeStatus = (typeof NodeEdgeStatus)[keyof typeof NodeEdgeStatus];
