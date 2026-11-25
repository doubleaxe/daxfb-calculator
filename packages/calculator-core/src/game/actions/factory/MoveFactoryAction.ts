import type { XYPosition } from '#core/game/model/internal/internal.js';

import { FactoryActionBase } from './FactoryActionBase.js';

export class MoveFactoryAction extends FactoryActionBase {
    private readonly __position: XYPosition;
    private __positionOld: undefined | XYPosition;

    constructor(itemId: string, position: XYPosition) {
        super(itemId);
        this.__position = position;
    }

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__positionOld ??= { ...factory.position };
        factory.setPosition({ ...this.__position });
    }
    override undo() {
        const factory = this.__factory;
        const positionOld = this.__positionOld;
        if (!factory || positionOld === undefined) return;
        factory.setPosition({ ...positionOld });
    }
}
