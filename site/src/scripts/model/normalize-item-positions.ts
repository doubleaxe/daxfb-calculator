/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {Point} from '../geometry';
import type {BlueprintItemModel} from './store';

export function calculateItemPositions(items: IterableIterator<BlueprintItemModel> | BlueprintItemModel[]) {
    type MinMax = Record<'minX' | 'minY' | 'maxX' | 'maxY', number | undefined>;
    const _items = Array.isArray(items) ? items : [...items];
    const {minX, minY, maxX, maxY} = _items.reduce((minmax: MinMax, {rect}) => ({
        minX: (minmax.minX !== undefined) ? Math.min(rect.x, minmax.minX) : rect.x,
        minY: (minmax.minY !== undefined) ? Math.min(rect.y, minmax.minY) : rect.y,
        maxX: (minmax.maxX !== undefined) ? Math.max(rect.x1, minmax.maxX) : rect.x1,
        maxY: (minmax.maxY !== undefined) ? Math.max(rect.y1, minmax.maxY) : rect.y1,
    }), {} as MinMax);
    const minItemXY = Point.assign({x: minX, y: minY});
    const maxItemXY = Point.assign({x: maxX, y: maxY});

    return {
        minItemXY,
        maxItemXY,
    };
}

export function normalizeItemPositions(items: IterableIterator<BlueprintItemModel>) {
    const _items = [...items];
    const {minItemXY} = calculateItemPositions(_items);

    //normalize minimum offset of item to 40 px
    const minOffset = 40;
    const deltaPoint = Point.assign({
        x: minItemXY.x - minOffset,
        y: minItemXY.y - minOffset,
    });
    for(const item of _items) {
        item.setRect(item.rect.offsetBy(deltaPoint, -1));
    }
}
