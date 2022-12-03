import {itemCollection} from './data-parsed';
import {defineStore} from 'pinia';
import {reactive, ref} from 'vue';

export type MutationFunction<Param> = (item: ItemModel, _old: Param, _new: Param) => void;
interface MutationObserver {
    mutateX: MutationFunction<number>;
    mutateY: MutationFunction<number>;
}

export class ItemModel {
    private readonly _name: string;
    private readonly _observer: MutationObserver;
    private _x = 0;
    private _y = 0;

    constructor(name: string, observer: MutationObserver) {
        this._name = name;
        this._observer = observer;
    }
    get name() { return this._name; }
    get item() { return itemCollection.getItem(this.name); }

    get x() { return this._x; }
    set x(x) { this._observer.mutateX(this, this._x, x); this._x = x; }
    get y() { return this._y; }
    set y(y) { this._observer.mutateY(this, this._y, y); this._y = y; }
}

class BlueprintModel {
    private readonly observer: MutationObserver;
    public items: ItemModel[] = [];
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
        const item = new ItemModel(name, this.observer);
        this.items.push(item);
        return item;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}

export const useBlueprintModel = defineStore('blueprint', () => {
    const blueprint = reactive(new BlueprintModel());
    return {blueprint};
});
