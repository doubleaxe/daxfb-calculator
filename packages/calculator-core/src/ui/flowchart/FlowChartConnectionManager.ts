import type { Connection } from '@vue-flow/core';

import { EdgeStatus, type FlowChartModelBase, NodeStatus } from '#core/game/model/index.js';
import { ConnectionMode, useFlowConnectionState } from '#core/stores/FlowConnectionState.js';

type ConnectStartParams = {
    handleId?: null | string;
    nodeId?: string;
};

export default function useFlowChartConnectionManager(flowChartModel: FlowChartModelBase) {
    const flowConnectionState = useFlowConnectionState();

    const onClickConnectStart = (params: ConnectStartParams) => {
        // we manually manage click connections
        // vue-flow has its own click connections, but it is too unpredictable
        // the click connect state remains active even when we also drag item
        // we will have unique edge state, and only one will be connected at once
        flowConnectionState.clearActiveConnection();
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            flowConnectionState.startConnection(io, ConnectionMode.Click);
        }
    };

    const onClickConnectEnd = () => {
        flowConnectionState.clearActiveConnection();
    };

    const onConnectStart = (params: ConnectStartParams) => {
        flowConnectionState.clearActiveConnection();
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            flowConnectionState.startConnection(io, ConnectionMode.Drag);
        }
    };

    const onConnectEnd = () => {
        flowConnectionState.clearActiveConnection();
    };

    const onConnect = (connection: Connection) => {
        const origin = flowConnectionState.origin;
        if (!origin) return;

        const originItemId = origin.isInput ? connection.target : connection.source;
        const originHandleId = origin.isInput ? connection.targetHandle : connection.sourceHandle;
        const destItemId = origin.isInput ? connection.source : connection.target;
        const destHandleId = origin.isInput ? connection.sourceHandle : connection.targetHandle;
        if (!originItemId || !originHandleId || !destItemId || !destHandleId) return;

        if (destItemId === destHandleId) {
            // factory handle
            flowChartModel.createLinkAuto(originItemId, originHandleId, destItemId);
            return;
        }

        flowChartModel.createLink(
            {
                sourceId: originItemId,
                sourceIOId: originHandleId,
                targetId: destItemId,
                targetIOId: destHandleId,
            },
            true
        );
        flowConnectionState.clearActiveConnection();
    };

    const isValidConnection = (connection: Connection) => {
        const origin = flowConnectionState.origin;
        if (!origin) return false;

        const destItemId = origin.isInput ? connection.source : connection.target;
        const destHandleId = origin.isInput ? connection.sourceHandle : connection.targetHandle;
        if (!destItemId || !destHandleId) return false;

        if (destItemId === destHandleId) {
            // factory handle
            const destFactory = flowChartModel.itemByKey(destItemId);
            if (!destFactory) return false;
            return [NodeStatus.PossibleDest].some((status) => status === destFactory.status);
        }

        const destIo = flowChartModel.findIo(destItemId, destHandleId);
        if (!destIo) return false;
        return [EdgeStatus.ConnectedDest, EdgeStatus.ConnectionDest].some((status) => status === destIo.status);
    };

    return {
        onClickConnectStart,
        onClickConnectEnd,
        onConnectStart,
        onConnectEnd,
        onConnect,
        isValidConnection,
    };
}
