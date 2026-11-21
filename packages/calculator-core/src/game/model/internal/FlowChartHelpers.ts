import type { FlowChartModelBaseImpl } from '../FlowChartModel.js';
import {
    ModelSnapshotFromSerializedCompactFormBase,
    ModelSnapshotToSerializedCompactFormBase,
} from './ModelSnapshotConverter.js';
import { ModelSnapshotFactoryBase } from './ModelSnapshotFactory.js';

export function createFlowChartHelpers(flowChart: FlowChartModelBaseImpl) {
    const snapshotFactory = new ModelSnapshotFactoryBase(flowChart);
    const snapshotToSerializedCompactForm = new ModelSnapshotToSerializedCompactFormBase(flowChart.gameData);
    const snapshotFromSerializedCompactForm = new ModelSnapshotFromSerializedCompactFormBase(
        flowChart.gameData,
        snapshotFactory
    );

    return Object.freeze({
        snapshotFactory: Object.freeze(snapshotFactory),
        snapshotToSerializedCompactForm: Object.freeze(snapshotToSerializedCompactForm),
        snapshotFromSerializedCompactForm: Object.freeze(snapshotFromSerializedCompactForm),
    });
}

export type FlowChartHelpersBase = ReturnType<typeof createFlowChartHelpers>;
