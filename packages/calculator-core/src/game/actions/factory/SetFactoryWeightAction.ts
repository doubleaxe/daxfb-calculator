import { FactoryActionBase } from './FactoryActionBase.js';

export class SetFactoryWeightAction extends FactoryActionBase {
    private readonly __weight: number;
    private __weightOld: number | undefined;

    constructor(itemId: string, weight: number) {
        super(itemId);
        this.__weight = weight;
    }

    override redo() {
        const factory = this.__factory;
        if (!factory) return;
        this.__weightOld = factory.weight;
        factory.setWeight(this.__weight);
    }
    override undo() {
        const factory = this.__factory;
        const weightOld = this.__weightOld;
        if (!factory || weightOld === undefined) return;
        factory.setWeight(weightOld);
    }
}
