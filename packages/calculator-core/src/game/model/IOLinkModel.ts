import { newId } from './internal/internal.js';
import type { IOLinkSnapshotBase } from './ModelSnapshot.js';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { RecipeIOModelBase } from './types.js';

export type CreateIOLinkModel<
    IO extends RecipeIOModelBaseImpl = RecipeIOModelBaseImpl,
    SNAP extends IOLinkSnapshotBase = IOLinkSnapshotBase,
    LINK extends IOLinkModelBaseImpl = IOLinkModelBaseImpl,
> = (input: IO, output: IO, snapshot: SNAP | undefined) => LINK;

export abstract class IOLinkModelBaseImpl {
    readonly linkId;
    protected readonly __input: RecipeIOModelBaseImpl;
    protected readonly __output: RecipeIOModelBaseImpl;
    protected __flow: number | undefined = undefined;

    constructor(input: RecipeIOModelBaseImpl, output: RecipeIOModelBaseImpl, snapshot: IOLinkSnapshotBase | undefined) {
        this.__input = input;
        this.__output = output;
        this.linkId = newId(snapshot?.snapshot.linkId);
    }

    get input(): RecipeIOModelBase {
        return this.__input;
    }
    get output(): RecipeIOModelBase {
        return this.__output;
    }
    get flow() {
        return this.__flow;
    }

    setFlow(flow: number | undefined) {
        this.__flow = flow;
    }

    getOtherSide(item: RecipeIOModelBase): RecipeIOModelBase | undefined {
        return this.__getOtherSide(item);
    }

    __getOtherSide(item: RecipeIOModelBase) {
        if (item.itemId === this.__input?.itemId) return this.__output;
        if (item.itemId === this.__output?.itemId) return this.__input;
        return undefined;
    }

    deleteLink() {
        const inputFactory = this.__input.__deleteLink(this.linkId);
        const outputFactory = this.__output.__deleteLink(this.linkId);
        inputFactory.__flowChart.__deleteLink(this, [inputFactory, outputFactory]);
    }

    __saveToSnapshot() {
        const snapshot = this.__input.__flowChart.__snapshotFactory.newIOLinkSnapshot({
            linkId: this.linkId,
            sourceIOId: this.__output.itemId,
            sourceId: this.__output.factory.itemId,
            targetIOId: this.__input.itemId,
            targetId: this.__input.factory.itemId,
        });
        return snapshot;
    }
    __loadFromSnapshot(_snapshot: IOLinkSnapshotBase) {}
}
