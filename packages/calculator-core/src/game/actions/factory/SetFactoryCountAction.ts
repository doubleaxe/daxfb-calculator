import { FactoryActionBase } from './FactoryActionBase.js';

export class SetFactoryCountAction extends FactoryActionBase {
    private readonly __count: number;
    private __countOld: number | undefined;

    constructor(itemId: string, count: number) {
        super(itemId);
        this.__count = count;
    }

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__countOld = factory.count;
        factory.setCount(this.__count);
    }
    override undo() {
        const factory = this.__factory;
        const countOld = this.__countOld;
        if (!factory || countOld === undefined) return;
        factory.setCount(countOld);
    }
}
