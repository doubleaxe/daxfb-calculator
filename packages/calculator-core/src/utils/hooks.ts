import type { IReactionDisposer } from 'mobx';
import type { Context, DependencyList } from 'react';
import { createElement, useEffect, useRef } from 'react';

import type { BaseProps } from '#core/types/props';

const initRefSymbol = Symbol('initRef');

export function useInitRef<T>(init: () => T) {
    const ref = useRef<T | typeof initRefSymbol>(initRefSymbol);
    if (ref.current === initRefSymbol) {
        ref.current = init();
    }
    return ref.current;
}

export function createUniversalProvider<T>(context: Context<T>, init: () => T) {
    return function UniversalProvider({ children }: BaseProps) {
        const value = useInitRef(init);

        return createElement(context, { value }, children);
    };
}

export function useReaction(reactionInstance: () => IReactionDisposer, deps?: DependencyList) {
    useEffect(() => {
        const disposer = reactionInstance();
        return () => {
            disposer();
        };
    }, deps);
}
