import { type FlowChartModelBase, useFlowChartEvents } from '#core/game/model/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';
import { useStatusBarStore } from '#core/stores/StatusBarStore.js';

export default function useFlowChartHoverManager(flowChartModel: FlowChartModelBase) {
    const gameData = useGameDataBase();
    const statusBarStore = useStatusBarStore();

    function factoryFromEvent(target: EventTarget | null) {
        const itemFromEvent = (target as HTMLElement | null)?.closest('[data-item][data-hoverable]');
        if (!itemFromEvent) return undefined;
        return gameData.getGameItem(itemFromEvent.getAttribute('data-item') ?? '');
    }

    function onPointerLeave() {
        statusBarStore.setHoveredItem(undefined);
    }

    function onPointerOver(event: PointerEvent) {
        statusBarStore.setHoveredItem(factoryFromEvent(event.target)?.label);
    }

    useFlowChartEvents(() => [flowChartModel.events.on('panePointerLeave', onPointerLeave)]);
    useFlowChartEvents(() => [flowChartModel.events.on('panePointerOver', onPointerOver)]);
}
