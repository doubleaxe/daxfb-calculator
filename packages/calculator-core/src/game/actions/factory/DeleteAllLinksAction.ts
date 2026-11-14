import type { FactoryModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class DeleteAllLinksAction extends ActionBase {
    private readonly __item: FactoryModelBase;

    constructor(item: FactoryModelBase) {
        super();
        this.__item = item;
    }

    override init(): void {
        this.__action = this.__item.deleteAllLinks();
    }
}
