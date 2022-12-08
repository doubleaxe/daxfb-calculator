import type {RecipeIO} from '../data-parsed';
import {ItemModelImpl} from './item';
import type {BlueprintItemModel, LinkModel} from './types';


export class RecipeIOModelImpl extends ItemModelImpl {
    private readonly _owner;
    private readonly _io;
    private _link?: LinkModel;

    constructor(owner: BlueprintItemModel, io: RecipeIO, key?: string) {
        super(io.item, key);
        this._owner = owner;
        this._io = io;
    }

    public get link() { return this._link; }
    public set link(value: LinkModel | undefined) { this._link = value; }
}
