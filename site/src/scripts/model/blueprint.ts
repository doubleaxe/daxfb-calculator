import {reactive, watch} from 'vue';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {BlueprintItemModel, LinkModel, RecipeIOModel} from './types';

export class BlueprintModelImpl {
    public readonly items: BlueprintItemModel[] = [];
    public readonly links: LinkModel[] = [];
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

    private _updateXY([newX, newY]: number[], oldXY: number[]) {
        if(newX > this._xmax)
            this._xmax = newX;
        if(newY > this._ymax)
            this._ymax = newY;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}
