import type {RecipeIO} from '../data-parsed';
import {ItemModel} from './item';

export class RecipeIOModel extends ItemModel {
    private readonly _io;

    constructor(io: RecipeIO) {
        super(io.item);
        this._io = io;
    }

}
