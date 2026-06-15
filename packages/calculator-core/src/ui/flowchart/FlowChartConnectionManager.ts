import {
    type IsValidConnection,
    type OnConnect,
    type OnConnectEnd,
    type OnConnectStart,
    useConnection,
} from '@xyflow/react';
import { action } from 'mobx';

import { type FlowChartModelBase, NodeStatus } from '#core/game/model/index.js';
import { ConnectionMode, useFlowConnectionState } from '#core/stores/FlowConnectionState.js';

export default function useFlowChartConnectionManager(flowChartModel: FlowChartModelBase) {
    const connectionState = useConnection((conn) => {
        return {
            inProgress: conn.inProgress,
            pointer: conn.pointer,
        };
    });
    const flowConnectionState = useFlowConnectionState();

    console.log('connectionState', connectionState.pointer);

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
        const activeSource = flowConnectionState.source?.itemId;
        const activeSourceFactory = flowConnectionState.source?.factory.itemId;
        if (
            !(
                (connection.sourceHandle === activeSource && connection.source === activeSourceFactory) ||
                (connection.targetHandle === activeSource && connection.target === activeSourceFactory)
            )
        ) {
            return;
        }

        flowChartModel.createLink({
            sourceId: connection.source,
            sourceIOId: connection.sourceHandle ?? '',
            targetId: connection.target,
            targetIOId: connection.targetHandle ?? '',
        });
        flowConnectionState.clearActiveConnection();
    });

    const isValidConnection: IsValidConnection = action((connection) => {
        const source = flowChartModel.findIo(connection.source ?? '', connection.sourceHandle ?? '');
        const target = flowChartModel.findIo(connection.target ?? '', connection.targetHandle ?? '');
        return source?.status === NodeStatus.Source && target?.status === NodeStatus.Target;
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
