import { newId } from './internal.js';
import type { RecipeIOModelBaseImpl } from './RecipeIOModel.js';
import type { SerializedLink } from './SerializedModel.js';
import type { RecipeIOModelBase } from './types.js';

export type CreateIOLinkModel<
    IO extends RecipeIOModelBaseImpl = RecipeIOModelBaseImpl,
    LINK extends IOLinkModelBaseImpl = IOLinkModelBaseImpl,
> = (input: IO, output: IO) => LINK;

export abstract class IOLinkModelBaseImpl {
    readonly linkId;
    protected readonly __input: RecipeIOModelBaseImpl;
    protected readonly __output: RecipeIOModelBaseImpl;
    protected __flow: number | undefined = undefined;

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
    get flow() {
        return this.__flow;
    }

    setFlow(flow: number | undefined) {
        this.__flow = flow;
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

    __save(input?: number, output?: number): SerializedLink {
        //if we can link by multiple paths for same item - then link is ambiguous
        //we should store name as well in this case
        let isAmbiguous = false;
        const allInputs = this.__input?.__recipe?.input;
        const allOutputs = this.__output?.__recipe?.output;
        const allInputsNames = new Set([...(allInputs || [])].map((i) => i.key ?? ''));
        const similarIo = [...(allOutputs || [])].reduce((sum, i) => {
            if (allInputsNames.has(i.key ?? '')) sum++;
            return sum;
        }, 0);
        isAmbiguous = similarIo > 1;
        return {
            l: [input ?? 0, output ?? 0],
            n: isAmbiguous ? this.input?.key : undefined,
        };
    }
}
