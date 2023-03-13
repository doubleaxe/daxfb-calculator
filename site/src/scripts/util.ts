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
