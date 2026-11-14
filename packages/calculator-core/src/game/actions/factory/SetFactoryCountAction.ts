import type { FactoryModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class SetFactoryCountAction extends ActionBase {
    private readonly __item: FactoryModelBase;
    private readonly __count: number;

    constructor(item: FactoryModelBase, count: number) {
        super();
        this.__item = item;
        this.__count = count;
    }

    override init(): void {
        this.__action = this.__item.setCount(this.__count);
    }
}
