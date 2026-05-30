import type { OnConnect, OnConnectEnd, OnConnectStart } from '@xyflow/react';
import { action } from 'mobx';
import { useRef } from 'react';

import {
    EdgeStatus,
    type FactoryModelBase,
    type FlowChartModelBase,
    NodeStatus,
    type RecipeIOModelBase,
} from '#core/game/model/index.js';

type ActiveConn = {
    source: RecipeIOModelBase | undefined;
    targets: {
        factory: FactoryModelBase;
        io?: RecipeIOModelBase;
    }[];
};

function clearActiveConnection(_activeConn: ActiveConn) {
    if (_activeConn.source) {
        _activeConn.source.status = EdgeStatus.None;
        _activeConn.source = undefined;
    }
    if (_activeConn.targets.length) {
        _activeConn.targets.forEach((target) => {
            target.factory.status = NodeStatus.None;
            if (target.io) target.io.status = EdgeStatus.None;
        });
        _activeConn.targets = [];
    }
}

export default function useFlowChartConnectionManager(flowChartModel: FlowChartModelBase) {
    const activeConn = useRef({ targets: [], source: undefined } as ActiveConn);

    const onClickConnectStart: OnConnectStart = action((event, params) => {
        // we manually manage click connections
        // reactflow has its own click connections, but it is too unperdictable
        // the click connect state remains active even when we also drag item
        // we will have unique edge state, and only one will be connected at once
        // also reactflow add special class 'clickconnecting' to edge while connection active
        // we will better handle it with props and dynamic classes
        clearActiveConnection(activeConn.current);
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            io.status = EdgeStatus.ClickSource;
            activeConn.current.source = io;
            const connectableItems = flowChartModel.findConnectable(io);
            activeConn.current.targets = connectableItems;
            connectableItems.forEach((target) => {
                target.factory.status = target.io ? NodeStatus.ClickTarget : NodeStatus.PossibleClickTarget;
                if (target.io) target.io.status = EdgeStatus.ClickTarget;
            });
        }
    });

    const onClickConnectEnd: OnConnectEnd = action(() => {
        clearActiveConnection(activeConn.current);
    });

    const onConnectStart: OnConnectStart = action((_event, params) => {
        clearActiveConnection(activeConn.current);
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            io.status = EdgeStatus.DragSource;
            activeConn.current.source = io;
        }
    });

    const onConnectEnd: OnConnectEnd = action(() => {
        clearActiveConnection(activeConn.current);
    });

    const onConnect: OnConnect = action((connection) => {
        const _activeConn = activeConn.current;
        if (
            connection.sourceHandle !== _activeConn.source?.itemId ||
            connection.source !== _activeConn.source?.factory.itemId
        ) {
            return;
        }

        flowChartModel.createLink({
            sourceId: connection.source,
            sourceIOId: connection.sourceHandle ?? '',
            targetId: connection.target,
            targetIOId: connection.targetHandle ?? '',
        });
        clearActiveConnection(activeConn.current);
    });

    return {
        onClickConnectStart,
        onClickConnectEnd,
        onConnectStart,
        onConnectEnd,
        onConnect,
    };
}
