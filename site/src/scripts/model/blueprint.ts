import {ref} from 'vue';
import {BlueprintItemModel} from './blueprint-item';
import type {ItemMutationObserver} from './types';

export class BlueprintModel {
    private readonly observer: ItemMutationObserver;
    public items: BlueprintItemModel[] = [];
    private _xmax = ref(0);
    private _ymax = ref(0);

    constructor() {
        this.observer = {
            mutateX: (item, _old, _new) => {
                if(_new > this._xmax.value)
                    this._xmax.value = _new;
            },
            mutateY: (item, _old, _new) => {
                if(_new > this._ymax.value)
                    this._ymax.value = _new;
            },
        };
    }

    addItem(name: string) {
        const item = new BlueprintItemModel(name, this.observer);
        this.items.push(item);
        return item;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}
