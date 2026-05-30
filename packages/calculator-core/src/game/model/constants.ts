export const NodeStatus = {
    None: 'None',
    DragSource: 'DragSource',
    DragTarget: 'DragTarget',
    PossibleDragTarget: 'PossibleDragTarget',
    ImpossibleDragTarget: 'ImpossibleDragTarget',
} as const;

export type NodeStatus = (typeof NodeStatus)[keyof typeof NodeStatus];

export const EdgeStatus = {
    None: 'None',
    ClickSource: 'ClickSource',
    ClickTarget: 'ClickTarget',
    DragSource: 'DragSource',
    DragTarget: 'DragTarget',
    ImpossibleDragTarget: 'ImpossibleDragTarget',
} as const;

export type EdgeStatus = (typeof EdgeStatus)[keyof typeof EdgeStatus];
