import { useRef } from 'react';

const initRefSymbol = Symbol('initRef');

export function useInitRef<T>(init: () => T) {
    const ref = useRef<T | typeof initRefSymbol>(initRefSymbol);
    if (ref.current === initRefSymbol) {
        ref.current = init();
    }
    return ref.current;
}
