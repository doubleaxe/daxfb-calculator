/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {Point} from '@/scripts/geometry';
import {useEventListener} from '@vueuse/core';
import {getScrollBox} from './commons';

export function useDragAndScroll() {
    let data: {
        mouse: Point;
        scroll: Point;
        scrollboxElement: HTMLElement;
    } | undefined = undefined;

    function onStart(event: PointerEvent) {
        //TODO user clicked on something else
        const {scrollboxElement} = getScrollBox(event.currentTarget as HTMLElement);
        if(!scrollboxElement)
            return;
        data = {
            mouse: Point.assign({x: event.clientX, y: event.clientY}),
            scroll: Point.assign({x: scrollboxElement.scrollLeft, y: scrollboxElement.scrollTop}),
            scrollboxElement,
        };
    }
    function onMove(event: PointerEvent) {
        if(!data)
            return;
        const {mouse, scroll, scrollboxElement} = data;
        const delta = Point.assign({x: event.clientX, y: event.clientY}).offsetBy(mouse, -1);
        const deltaScroll = scroll.offsetBy(delta, -1);
        if(deltaScroll.x >= 0)
            scrollboxElement.scrollLeft = deltaScroll.x;
        if(deltaScroll.y >= 0)
            scrollboxElement.scrollTop = deltaScroll.y;
    }
    function onStop(event: PointerEvent) {
        data = undefined;
    }

    useEventListener(window, 'pointermove', onMove, {passive: true});
    useEventListener(window, 'pointerup', onStop, {passive: true});

    return {
        onStart,
    };
}
