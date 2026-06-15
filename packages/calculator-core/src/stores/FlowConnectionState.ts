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
    source: RecipeIOModelBase | undefined = undefined;
    possibleTargets: {
        factory: FactoryModelBase;
        io?: RecipeIOModelBase;
    }[] = [];
    connectedTargets: RecipeIOModelBase[] = [];
    connectionMode: ConnectionMode = ConnectionMode.None;

    constructor(flowChartModel: FlowChartModelBase) {
        this.flowChartModel = flowChartModel;
        makeAutoObservable(this);
    }

    clearActiveConnection() {
        if (this.source) {
            this.source.status = EdgeStatus.None;
            this.source.factory.status = NodeStatus.None;
            this.source = undefined;
        }
        if (this.possibleTargets.length) {
            this.possibleTargets.forEach((target) => {
                target.factory.status = NodeStatus.None;
                if (target.io) target.io.status = EdgeStatus.None;
            });
            this.possibleTargets = [];
        }
        if (this.connectedTargets.length) {
            this.connectedTargets.forEach((target) => {
                target.factory.status = NodeStatus.None;
                target.status = EdgeStatus.None;
            });
            this.connectedTargets = [];
        }
        this.connectionMode = ConnectionMode.None;
    }

    startConnection(source: RecipeIOModelBase, connectionMode: ConnectionMode) {
        const flowChartModel = this.flowChartModel;
        this.source = source;
        source.status = EdgeStatus.Source;

        const possibleTargets = flowChartModel.findConnectable(source);
        this.possibleTargets = possibleTargets;
        possibleTargets.forEach((target) => {
            target.factory.status = target.io ? NodeStatus.Target : NodeStatus.PossibleTarget;
            if (target.io) target.io.status = EdgeStatus.Target;
        });

        this.connectedTargets = [];
        for (const link of source.links) {
            const connectedTarget = link.getOtherSide(source);
            if (connectedTarget) {
                this.connectedTargets.push(connectedTarget);
                connectedTarget.factory.status = NodeStatus.ConnectedTarget;
                connectedTarget.status = EdgeStatus.ConnectedTarget;
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
