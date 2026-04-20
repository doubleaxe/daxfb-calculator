import type { IReactionDisposer } from 'mobx';
import type { DependencyList } from 'react';
import { useEffect, useRef } from 'react';

const initRefSymbol = Symbol('initRef');

export function useInitRef<T>(init: () => T) {
    const ref = useRef<T | typeof initRefSymbol>(initRefSymbol);
    if (ref.current === initRefSymbol) {
        ref.current = init();
    }
    return ref.current;
}

export function useReaction(reactionInstance: () => IReactionDisposer, deps?: DependencyList) {
    useEffect(() => {
        const disposer = reactionInstance();
        return () => {
            disposer();
        };
    }, deps);
}
