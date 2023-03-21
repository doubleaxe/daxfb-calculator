/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

export function freezeMap<K, V>(map: Map<K, V>): ReadonlyMap<K, V> {
    if(map instanceof Map) {
        map.set = (key: K) => {
            throw new Error(`Can't set property ${key}, map is frozen`);
        };

        map.delete = (key: K) => {
            throw new Error(`Can't delete property ${key}, map is frozen`);
        };

        map.clear = () => {
            throw new Error("Can't clear map, map is frozen");
        };
    }

    return Object.freeze(map);
}

export function buildTransformStyle(transform: Record<string, string>): string {
    return Object.entries(transform).map(([key, value]) => `${key}(${value})`).join(' ');
}

/**
 * Return 0 <= i <= array.length such that !pred(array[i - 1]) && pred(array[i]).
 */
export function binarySearch<T>(array: T[], pred: (item: T) => boolean): number {
    let lo = -1;
    let hi = array.length;
    while((1 + lo) < hi) {
        const mi = lo + ((hi - lo) >> 1);
        if(pred(array[mi])) {
            hi = mi;
        } else {
            lo = mi;
        }
    }
    return hi;
}
