import { FactoryActionBase } from './FactoryActionBase.js';

export class FlipFactoryAction extends FactoryActionBase {
    private __isFlippedOld: boolean | undefined;

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        const isFlipped = factory.isFlipped;
        this.__isFlippedOld = isFlipped;
        factory.setFlipped(!isFlipped);
    }
    override undo() {
        const factory = this.__factory;
        const isFlipped = this.__isFlippedOld;
        if (!factory || isFlipped === undefined) return;
        factory.setFlipped(isFlipped);
    }
}
