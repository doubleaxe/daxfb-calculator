import { FactoryActionBase } from './FactoryActionBase.js';

export class SetFactoryLockedAction extends FactoryActionBase {
    private readonly __locked: boolean;
    private __lockedOld: boolean | undefined;

    constructor(itemId: string, locked: boolean) {
        super(itemId);
        this.__locked = locked;
    }

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__lockedOld = factory.locked;
        factory.setLocked(this.__locked);
    }
    override undo() {
        const factory = this.__factory;
        const lockedOld = this.__lockedOld;
        if (!factory || lockedOld === undefined) return;
        factory.setLocked(lockedOld);
    }
}
