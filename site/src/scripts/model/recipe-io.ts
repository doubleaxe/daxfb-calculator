import type {RecipeIO} from '../data-parsed';
import {ItemModel} from './item';
import type {LinkModel} from './link';


export class RecipeIOModel extends ItemModel {
    private readonly _owner;
    private readonly _io;
    private _link?: LinkModel;

    constructor(owner: ItemModel, io: RecipeIO, key?: string) {
        super(io.item, key);
        this._owner = owner;
        this._io = io;
    }

    public get link() { return this._link; }
    public set link(value: LinkModel | undefined) { this._link = value; }
}
