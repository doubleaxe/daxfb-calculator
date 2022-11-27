import {itemCollection} from './factory';
import {defineStore} from 'pinia';
import {reactive} from 'vue';

class ItemModel {
    private readonly _name: string;
    public x = 0;
    public y = 0;

    constructor(name: string) {
        this._name = name;
    }
    get name() { return this._name; }
    get item() { return itemCollection.getItem(this.name); }
}

class BlueprintModel {
    public items: ItemModel[] = [];
    addItem(name: string) {
        const item = new ItemModel(name);
        this.items.push(item);
        return item;
    }
}

export const useBlueprintModel = defineStore('blueprint', () => {
    const blueprint = reactive(new BlueprintModel());
    return {blueprint};
});
