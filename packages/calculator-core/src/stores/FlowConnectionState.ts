import type { InterfaceOf } from '@daxfb/shared/types/UtilityTypes.js';
import { createInjectionState } from '@vueuse/core';
import { reactive } from 'vue';

import {
    EdgeStatus,
    type FactoryModelBase,
    type FlowChartModelBase,
    NodeStatus,
    type RecipeIOModelBase,
} from '#core/game/model/index.js';

import type { StatusBarStore } from './StatusBarStore.js';

export const ConnectionMode = {
    None: 'None',
    Click: 'Click',
    Drag: 'Drag',
} as const;

export type ConnectionMode = (typeof ConnectionMode)[keyof typeof ConnectionMode];

export class FlowConnectionStateImpl {
    private readonly flowChartModel: FlowChartModelBase;
    private readonly statusBarStore: StatusBarStore;
    origin: RecipeIOModelBase | undefined = undefined;
    possibleDests: {
        factory: FactoryModelBase;
        io?: RecipeIOModelBase;
    }[] = [];
    connectedDests: RecipeIOModelBase[] = [];
    connectionMode: ConnectionMode = ConnectionMode.None;

    constructor(flowChartModel: FlowChartModelBase, statusBarStore: StatusBarStore) {
        this.flowChartModel = flowChartModel;
        this.statusBarStore = statusBarStore;
    }

    clearActiveConnection() {
        if (this.origin) {
            this.origin.status = EdgeStatus.None;
            this.origin.factory.status = NodeStatus.None;
            this.origin = undefined;
        }
        if (this.possibleDests.length) {
            this.possibleDests.forEach((dest) => {
                dest.factory.status = NodeStatus.None;
                if (dest.io) dest.io.status = EdgeStatus.None;
            });
            this.possibleDests = [];
        }
        if (this.connectedDests.length) {
            this.connectedDests.forEach((dest) => {
                dest.factory.status = NodeStatus.None;
                dest.status = EdgeStatus.None;
            });
            this.connectedDests = [];
        }
        this.connectionMode = ConnectionMode.None;
        this.statusBarStore.setSelectedItem(undefined);
    }

    startConnection(origin: RecipeIOModelBase, connectionMode: ConnectionMode) {
        const flowChartModel = this.flowChartModel;
        this.origin = origin;
        origin.status = EdgeStatus.ConnectionOrigin;

        const possibleDests = flowChartModel.findConnectable(origin);
        this.possibleDests = possibleDests;
        possibleDests.forEach((dest) => {
            dest.factory.status = dest.io ? NodeStatus.ConnectionDest : NodeStatus.PossibleDest;
            if (dest.io) dest.io.status = EdgeStatus.ConnectionDest;
        });

        this.connectedDests = [];
        for (const link of origin.links) {
            const connectedDest = link.getOtherSide(origin);
            if (connectedDest) {
                this.connectedDests.push(connectedDest);
                connectedDest.factory.status = NodeStatus.ConnectedDest;
                connectedDest.status = EdgeStatus.ConnectedDest;
            }
        }

        this.connectionMode = connectionMode;
        this.statusBarStore.setSelectedItem(origin.label);
    }
}

export type FlowConnectionState = InterfaceOf<FlowConnectionStateImpl>;

const [useProvideFlowConnectionState, _useFlowConnectionState] = createInjectionState(
    (flowConnectionState: FlowConnectionState): FlowConnectionState => reactive(flowConnectionState)
);

export { useProvideFlowConnectionState };
export function useFlowConnectionState() {
    const flowConnectionState = _useFlowConnectionState();
    if (!flowConnectionState) {
        throw new Error('FlowConnectionState is not provided');
    }
    return flowConnectionState;
}
