import { newId } from './internal.js';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { RecipeIOModelBase } from './types.js';

export type CreateIOLinkModel<
    IO extends RecipeIOModelBaseImpl = RecipeIOModelBaseImpl,
    LINK extends IOLinkModelBaseImpl = IOLinkModelBaseImpl,
> = (input: IO, output: IO) => LINK;

export abstract class IOLinkModelBaseImpl {
    readonly linkId;
    protected readonly __input: RecipeIOModelBaseImpl;
    protected readonly __output: RecipeIOModelBaseImpl;

    constructor(input: RecipeIOModelBaseImpl, output: RecipeIOModelBaseImpl) {
        this.__input = input;
        this.__output = output;
        this.linkId = newId();
    }

    get input(): RecipeIOModelBase {
        return this.__input;
    }
    get output(): RecipeIOModelBase {
        return this.__output;
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
}
