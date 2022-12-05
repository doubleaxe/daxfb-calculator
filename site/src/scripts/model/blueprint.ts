import {ref, watch} from 'vue';
import {BlueprintItemModel} from './blueprint-item';
import {LinkModel} from './link';
import type {RecipeIOModel} from './recipe-io';

export class BlueprintModel {
    public readonly items: BlueprintItemModel[] = [];
    public readonly links: LinkModel[] = [];
    private _xmax = ref(0);
    private _ymax = ref(0);

    addItem(name: string) {
        const item = new BlueprintItemModel(name);
        this.items.push(item);
        watch([item.x, item.y], this._updateXY.bind(this));
        return item;
    }
    addLink(input: RecipeIOModel, output: RecipeIOModel) {
        const link = new LinkModel(input, output);
        this.links.push(link);
        return link;
    }

    private _updateXY(oldXY: number[], [newX, newY]: number[]) {
        if(newX > this._xmax.value)
            this._xmax.value = newX;
        if(newY > this._ymax.value)
            this._ymax.value = newY;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}
