import type { FactoryModelBase } from '@daxfb/core/game/model/types.js';

import { ActionBase } from '../Action.js';

export class SetFactoryWeightAction extends ActionBase {
    private readonly __item: FactoryModelBase;
    private readonly __weight: number | undefined;

    constructor(item: FactoryModelBase, weight: number | undefined) {
        super();
        this.__item = item;
        this.__weight = weight;
    }

    override init(): void {
        this.__action = this.__item.setWeight(this.__weight);
    }
}
