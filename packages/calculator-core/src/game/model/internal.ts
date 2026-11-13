import type { FactoryModelBase } from './types.js';

let currentId = 0;

export function newId(id?: string) {
    return id ?? `k${currentId++}`;
}

export function resetIdStore() {
    currentId = 0;
}

export function normalizeItemPositions(items: FactoryModelBase[] | IterableIterator<FactoryModelBase>) {
    type MinMax = Record<'maxX' | 'maxY' | 'minX' | 'minY', number | undefined>;
    const _items = Array.isArray(items) ? items : [...items];
    const { minX, minY, maxX, maxY } = _items.reduce(
        (minmax: MinMax, { position }) => ({
            minX: minmax.minX !== undefined ? Math.min(position.x, minmax.minX) : position.x,
            minY: minmax.minY !== undefined ? Math.min(position.y, minmax.minY) : position.y,
            maxX: minmax.maxX !== undefined ? Math.max(position.x, minmax.maxX) : position.x,
            maxY: minmax.maxY !== undefined ? Math.max(position.y, minmax.maxY) : position.y,
        }),
        {} as MinMax
    );
    const minItemXY = { x: minX ?? 0, y: minY ?? 0 };
    const maxItemXY = { x: maxX ?? 0, y: maxY ?? 0 };

    return {
        minItemXY,
        maxItemXY,
    };
}
