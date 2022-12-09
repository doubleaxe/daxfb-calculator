import {reactive, watch} from 'vue';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {BlueprintItemModel, LinkModel, RecipeIOModel} from './store';

export class BlueprintModelImpl {
    public readonly items: BlueprintItemModel[] = [];
    public readonly links: LinkModel[] = [];
    public readonly tempLinks: LinkModel[] = [];
    private _xmax = 0;
    private _ymax = 0;

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = reactive(new BlueprintItemModelImpl(name));
        this.items.push(item);
        watch([() => item.x, () => item.y], this._updateXY.bind(this));
        return item;
    }
    addLink(input: RecipeIOModel, output: RecipeIOModel) {
        const link = reactive(new LinkModelImpl(input, output));
        this.links.push(link);
        return link;
    }
    createTempLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this.tempLinks.push(link);
        return link;
    }
    clearTempLinks() {
        this.tempLinks.splice(0, this.tempLinks.length);
    }
    private static newLink(io: RecipeIOModel[]) {
        if(io.length > 2)
            throw new Error(`Expected 2 elements, got ${io.length}`);
        const _io: {input?: RecipeIOModel; output?: RecipeIOModel} = {
            input: undefined,
            output: undefined,
        };
        for(const i of io) {
            const target: keyof(typeof _io) = i.isInput ? 'input' : 'output';
            if(_io[target])
                throw new Error('Expecting 1 input and 1 output, got duplicates');
            _io[target] = i;
        }
        return reactive(new LinkModelImpl(_io.input, _io.output));
    }

    private _updateXY([newX, newY]: number[], oldXY: number[]) {
        if(newX > this._xmax)
            this._xmax = newX;
        if(newY > this._ymax)
            this._ymax = newY;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}
