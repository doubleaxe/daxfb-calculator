import type { IOLinkSnapshotBase } from '#core/game/model/ModelSnapshot.js';

import { ActionBase } from '../Action.js';

export class DeleteLinkAction extends ActionBase {
    private readonly __linkId: string;
    private __snapshot: IOLinkSnapshotBase | undefined;

    constructor(linkId: string) {
        super();
        this.__linkId = linkId;
    }

    override redo() {
        const flowChart = this.__flowChartModel;
        const link = flowChart?.linkById(this.__linkId);
        if (!link) return;
        this.__snapshot ??= link.saveToSnapshot();
        link.deleteLink();
    }
    override undo() {
        this.__snapshot?.loadFromSnapshot();
    }
}
