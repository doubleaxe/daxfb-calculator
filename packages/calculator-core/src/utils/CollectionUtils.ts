export function freezeMap<K, V>(map: Map<K, V>): ReadonlyMap<K, V> {
    if (map instanceof Map) {
        map.set = (key: K) => {
            throw new Error(`Can't set property ${String(key)}, map is frozen`);
        };

        map.delete = (key: K) => {
            throw new Error(`Can't delete property ${String(key)}, map is frozen`);
        };

        map.clear = () => {
            throw new Error("Can't clear map, map is frozen");
        };
    }

    return Object.freeze(map);
}

export function freezeSet<T>(set: Set<T>): ReadonlySet<T> {
    if (set instanceof Set) {
        set.add = (value: T) => {
            throw new Error(`Can't add value ${String(value)}, set is frozen`);
        };

        set.delete = (value: T) => {
            throw new Error(`Can't delete value ${String(value)}, set is frozen`);
        };

        set.clear = () => {
            throw new Error("Can't clear set, set is frozen");
        };
    }

    return Object.freeze(set);
}
