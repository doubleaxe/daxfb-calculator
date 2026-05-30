export const NodeStatus = {
    None: 'None',
    DragSource: 'DragSource',
    ClickTarget: 'ClickTarget',
    DragTarget: 'DragTarget',
    PossibleClickTarget: 'PossibleDragTarget',
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
