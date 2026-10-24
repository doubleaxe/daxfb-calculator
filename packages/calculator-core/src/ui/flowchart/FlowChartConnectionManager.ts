import { type Connection, type OnConnectStartParams, useVueFlow } from '@vue-flow/core';
import { onScopeDispose } from 'vue';

import { EdgeStatus, type FlowChartModelBase, NodeStatus, type RecipeIOModelBase } from '#core/game/model/index.js';
import { ConnectionMode, useFlowConnectionState } from '#core/stores/FlowConnectionState.js';

const DragThreshold = 8;
type ConnectStartParams = {
    event?: MouseEvent | TouchEvent;
} & OnConnectStartParams;

export default function useFlowChartConnectionManager(flowChartModel: FlowChartModelBase) {
    const flowConnectionState = useFlowConnectionState();
    const { endConnection } = useVueFlow();

    let pendingDrag: { io: RecipeIOModelBase; x: number; y: number } | undefined;

    function detachPendingDrag() {
        if (!pendingDrag) return;
        window.removeEventListener('pointermove', onPendingDragMove);
        pendingDrag = undefined;
    }

    function onPendingDragMove(event: PointerEvent) {
        if (!pendingDrag) return;
        const distance = Math.hypot(event.clientX - pendingDrag.x, event.clientY - pendingDrag.y);
        if (distance < DragThreshold) return;

        const io = pendingDrag.io;
        detachPendingDrag();

        const wasClickConnection = flowConnectionState.connectionMode === ConnectionMode.Click;
        flowConnectionState.clearActiveConnection();
        if (wasClickConnection) {
            // when a pending click connection turns into a drag, vue-flow keeps
            // waiting for a click destination unless its click state is cleared
            endConnection(undefined, true);
        }
        flowConnectionState.startConnection(io, ConnectionMode.Drag);
    }

    onScopeDispose(detachPendingDrag);

    function onClickConnectStart(params: ConnectStartParams) {
        // we manually manage click connections
        // vue-flow has its own click connections, but it is too unpredictable
        // the click connect state remains active even when we also drag item
        // we will have unique edge state, and only one will be connected at once
        flowConnectionState.clearActiveConnection();
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (io) {
            flowConnectionState.startConnection(io, ConnectionMode.Click);
        }
    }

    function onClickConnectEnd() {
        flowConnectionState.clearActiveConnection();
    }

    function onConnectStart(params: ConnectStartParams) {
        const io = flowChartModel.findIo(params.nodeId ?? '', params.handleId ?? '');
        if (!io) return;

        // a connection drag starts on pointer down, but so does a click
        // connection. Wait for actual pointer movement before switching to
        // drag mode, otherwise the click origin is cleared before the click
        // event arrives.
        detachPendingDrag();
        const event = params.event;
        const point = event && 'touches' in event ? event.touches[0] : event;
        pendingDrag = { io, x: point?.clientX ?? 0, y: point?.clientY ?? 0 };
        window.addEventListener('pointermove', onPendingDragMove);
    }

    function onConnectEnd() {
        detachPendingDrag();
        // on a click connection the click event is emitted after this pointer
        // up, so keep the origin until click connect end.
        if (flowConnectionState.connectionMode === ConnectionMode.Click) return;
        flowConnectionState.clearActiveConnection();
    }

    function onConnect(connection: Connection) {
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
    }

    function isValidConnection(connection: Connection) {
        const origin = flowConnectionState.origin;
        if (!origin) {
            if (connection.source && connection.target && connection.sourceHandle && connection.targetHandle) {
                // vueflow rechecks connection after we already created it
                const io1 = flowChartModel.findIo(connection.source, connection.sourceHandle);
                const io2 = flowChartModel.findIo(connection.target, connection.targetHandle);
                if (io1 && io2 && io1.isAlreadyLinked(io2)) return true;
            }
            return false;
        }

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
    }

    return {
        onClickConnectStart,
        onClickConnectEnd,
        onConnectStart,
        onConnectEnd,
        onConnect,
        isValidConnection,
    };
}
