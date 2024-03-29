/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {tryOnScopeDispose, type Arrayable, type EventHook, type EventHookOn} from '@vueuse/core';

export type JustEventHook<ItemType> = Omit<EventHook<ItemType>, 'trigger'>;

export function justEventHook<ItemType>(hook: EventHook<ItemType>): JustEventHook<ItemType> {
    return {
        on: hook.on.bind(hook),
        off: hook.off.bind(hook),
    };
}

export function useEventHook<ItemType>(hooks: Arrayable<JustEventHook<ItemType>>, listener: (param: ItemType) => void) {
    if(!Array.isArray(hooks))
        hooks = [hooks];

    const cleanups: ReturnType<EventHookOn>[] = hooks.map((hook) => hook.on(listener));
    const cleanup = () => {
        cleanups.forEach(fn => fn.off());
        cleanups.length = 0;
    };

    tryOnScopeDispose(cleanup);

    return stop;
}
