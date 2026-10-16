import { PhArrowFatLinesDown, PhArrowFatLinesUp, PhX } from '@phosphor-icons/vue';
import type { Component } from 'vue';

import { EdgeStatus, NodeStatus } from '#core/game/model/index.js';
import { StatusIconColorCva } from '#core/styles/StatusIcons.js';

export const NodeStatusConfig: Partial<Record<NodeStatus, { color: string; icon: Component }>> = {
    [NodeStatus.PossibleDest]: {
        icon: PhArrowFatLinesDown,
        color: StatusIconColorCva({ color: NodeStatus.PossibleDest }),
    },
};

export const EdgeStatusConfig: Partial<Record<EdgeStatus, { color: string; icon: Component }>> = {
    [EdgeStatus.ConnectionOrigin]: {
        icon: PhArrowFatLinesUp,
        color: StatusIconColorCva({ color: EdgeStatus.ConnectionOrigin }),
    },
    [EdgeStatus.ConnectionDest]: {
        icon: PhArrowFatLinesDown,
        color: StatusIconColorCva({ color: EdgeStatus.ConnectionDest }),
    },
    [EdgeStatus.ConnectedDest]: {
        icon: PhX,
        color: StatusIconColorCva({ color: EdgeStatus.ConnectedDest }),
    },
};
