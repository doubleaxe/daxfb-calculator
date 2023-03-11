/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {Point, Rect, type PublicRect} from '../geometry';
import type {
    BlueprintItemModel,
    BlueprintModel,
} from './store';

export class BlueprintSurface {
    private _boundingRect: PublicRect = Rect.assign();
    private _freezeBoundingRect = false;
    private readonly _owner;

    constructor(owner: BlueprintModel) {
        this._owner = owner;
    }

    get boundingRect() { return this._boundingRect; }

    freezeBoundingRect(_freezeBoundingRect: boolean) {
        if(this._freezeBoundingRect == _freezeBoundingRect)
            return;
        this._freezeBoundingRect = _freezeBoundingRect;
        if(!_freezeBoundingRect)
            this.updateSurface();
    }

    updateSurface(item?: BlueprintItemModel) {
        if(this._freezeBoundingRect)
            return;
        const items: IterableIterator<BlueprintItemModel> = this._owner.items;
        type MinMax = Record<'minX' | 'minY' | 'maxX' | 'maxY', number | undefined>;
        const {minX, minY, maxX, maxY} = [...items].reduce((minmax: MinMax, {rect}) => ({
            minX: (minmax.minX !== undefined) ? Math.min(rect.x, minmax.minX) : rect.x,
            minY: (minmax.minY !== undefined) ? Math.min(rect.y, minmax.minY) : rect.y,
            maxX: (minmax.maxX !== undefined) ? Math.max(rect.x1, minmax.maxX) : rect.x1,
            maxY: (minmax.maxY !== undefined) ? Math.max(rect.y1, minmax.maxY) : rect.y1,
        }), {} as MinMax);
        const _minItemXY = Point.assign({x: minX, y: minY});
        const _maxItemXY = Point.assign({x: maxX, y: maxY});

        const x1 = Math.min(_minItemXY.x - 500, 0);
        const y1 = Math.min(_minItemXY.y - 500, 0);

        //0:0 is min top-left point, so everything works fine at first drop
        this._boundingRect = this._boundingRect.assign({
            x: x1,
            y: y1,
            width: ((_maxItemXY.x - x1) + 500),
            height: ((_maxItemXY.y - y1) + 500),
        });
    }
}
