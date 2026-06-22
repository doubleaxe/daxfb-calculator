import type { IsValidConnection, OnConnect, OnConnectEnd, OnConnectStart } from '@xyflow/react';
import { action } from 'mobx';

import { EdgeStatus, type FlowChartModelBase, NodeStatus } from '#core/game/model/index.js';
import { ConnectionMode, useFlowConnectionState } from '#core/stores/FlowConnectionState.js';

export default function useFlowChartConnectionManager(flowChartModel: FlowChartModelBase) {
    const flowConnectionState = useFlowConnectionState();

    const onClickConnectStart: OnConnectStart = action((event, params) => {
        // we manually manage click connections
        // reactflow has its own click connections, but it is too unperdictable
        // the click connect state remains active even when we also drag item
        // we will have unique edge state, and only one will be connected at once
        // also reactflow add special class 'clickconnecting' to edge while connection active
        // we will better handle it with props and dynamic classes
        flowConnectionState.clearActiveConnection();
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            flowConnectionState.startConnection(io, ConnectionMode.Click);
        }
    });

    const onClickConnectEnd: OnConnectEnd = action(() => {
        flowConnectionState.clearActiveConnection();
    });

    const onConnectStart: OnConnectStart = action((_event, params) => {
        flowConnectionState.clearActiveConnection();
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            flowConnectionState.startConnection(io, ConnectionMode.Drag);
        }
    });

    const onConnectEnd: OnConnectEnd = action(() => {
        flowConnectionState.clearActiveConnection();
    });

    const onConnect: OnConnect = action((connection) => {
        const origin = flowConnectionState.origin;
        if (!origin) return;

        const originItemId = origin.isInput ? connection.target : connection.source;
        const originHandleId = origin.isInput ? connection.targetHandle : connection.sourceHandle;
        const destItemId = origin.isInput ? connection.source : connection.target;
        const destHandleId = origin.isInput ? connection.sourceHandle : connection.targetHandle;
        if (!originItemId || !originHandleId || !destItemId || !destHandleId) return;

        if (destItemId === destHandleId) {
            // factory hadle
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
    });

    const isValidConnection: IsValidConnection = action((connection) => {
        const origin = flowConnectionState.origin;
        if (!origin) return false;

        const destItemId = origin.isInput ? connection.source : connection.target;
        const destHandleId = origin.isInput ? connection.sourceHandle : connection.targetHandle;
        if (!destItemId || !destHandleId) return false;

        if (destItemId === destHandleId) {
            // factory hadle
            const destFactory = flowChartModel.itemByKey(destItemId);
            if (!destFactory) return false;
            return [NodeStatus.PossibleDest].some((status) => status === destFactory.status);
        }

        const destIo = flowChartModel.findIo(destItemId, destHandleId);
        if (!destIo) return false;
        return [EdgeStatus.ConnectedDest, EdgeStatus.ConnectionDest].some((status) => status === destIo.status);
    });

    return {
        onClickConnectStart,
        onClickConnectEnd,
        onConnectStart,
        onConnectEnd,
        onConnect,
        isValidConnection,
    };
}
