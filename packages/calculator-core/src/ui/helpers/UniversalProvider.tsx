import type { Context } from 'react';

import type { BaseProps } from '#core/types/props.js';
import { useInitRef } from '#core/utils/hooks.js';

export type UniversalProviderProps<T> = {
    context: Context<T>;
    init: () => T;
} & BaseProps;

export default function UniversalProvider<T>({ context, init, children }: UniversalProviderProps<T>) {
    const value = useInitRef(init);
    return <context.Provider value={value}>{children}</context.Provider>;
}
