import type { FactoryModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class SetFactoryLockedAction extends ActionBase {
    private readonly __item: FactoryModelBase;
    private readonly __locked: boolean;

    constructor(item: FactoryModelBase, locked: boolean) {
        super();
        this.__item = item;
        this.__locked = locked;
    }

    override init(): void {
        this.__action = this.__item.setLocked(this.__locked);
    }
}
