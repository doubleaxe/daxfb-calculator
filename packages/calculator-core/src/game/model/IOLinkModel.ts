import { newId } from './internal';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel';
import type { RecipeIOModelBase } from './types';

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

    __getOtherSide(item: RecipeIOModelBaseImpl) {
        if (item.key === this.__input?.key) return this.__output;
        if (item.key === this.__output?.key) return this.__input;
        return undefined;
    }
}
