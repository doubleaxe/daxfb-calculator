import type { InterfaceOf } from '@doubleaxe/daxfb-shared/types/UtilityTypes';
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

import {
    EdgeStatus,
    type FactoryModelBase,
    type FlowChartModelBase,
    NodeStatus,
    type RecipeIOModelBase,
} from '#core/game/model/index.js';

export const ConnectionMode = {
    None: 'None',
    Click: 'Click',
    Drag: 'Drag',
} as const;

export type ConnectionMode = (typeof ConnectionMode)[keyof typeof ConnectionMode];

export class FlowConnectionStateImpl {
    private readonly flowChartModel: FlowChartModelBase;
    origin: RecipeIOModelBase | undefined = undefined;
    possibleDests: {
        factory: FactoryModelBase;
        io?: RecipeIOModelBase;
    }[] = [];
    connectedDests: RecipeIOModelBase[] = [];
    connectionMode: ConnectionMode = ConnectionMode.None;

    constructor(flowChartModel: FlowChartModelBase) {
        this.flowChartModel = flowChartModel;
        makeAutoObservable(this);
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
    }
}

export type FlowConnectionState = InterfaceOf<FlowConnectionStateImpl>;

export const FlowConnectionStateContext = createContext(null as FlowConnectionState | null);
export function useFlowConnectionState() {
    const flowConnectionState = useContext(FlowConnectionStateContext);
    if (!flowConnectionState) {
        throw new Error('FlowConnectionStateContext was not found');
    }
    return flowConnectionState;
}
