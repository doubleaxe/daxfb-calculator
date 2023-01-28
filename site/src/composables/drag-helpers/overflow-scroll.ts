import {Rect} from '@/scripts/geometry';
import type {MaybeComputedElementRef, MaybeElement} from '@vueuse/core';
import {useEventHook} from '..';
import {getScrollBox} from './commons';
import {useGlobalDragAndDropListener} from './drag-and-drop';

export function useOverflowScroll(parent: MaybeComputedElementRef<MaybeElement> | undefined) {
    const globalDragAndDropEvents = useGlobalDragAndDropListener();
    let interval: number | undefined = undefined;
    let itemRect: Rect | undefined = undefined;

    function processScroll() {
        const scrollboxElement = getScrollBox(parent)?.scrollboxElement;
        if(!scrollboxElement || !itemRect)
            return;

        const visibleRect = Rect.assign(scrollboxElement.getBoundingClientRect());
        const deltaX1 = itemRect.x - visibleRect.x;
        const deltaX2 = visibleRect.x1 - itemRect.x1;
        let scrollX = scrollboxElement.scrollLeft;
        if((deltaX1 < 0) && (deltaX2 >= 0)) {
            scrollX += deltaX1;
        } else if((deltaX1 >= 0) && (deltaX2 < 0)) {
            scrollX -= deltaX2;
        }
        if(scrollX >= 0)
            scrollboxElement.scrollLeft = scrollX;

        const deltaY1 = itemRect.y - visibleRect.y;
        const deltaY2 = visibleRect.y1 - itemRect.y1;
        let scrollY = scrollboxElement.scrollTop;
        if((deltaY1 < 0) && (deltaY2 >= 0)) {
            scrollY += deltaY1;
        } else if((deltaY1 >= 0) && (deltaY2 < 0)) {
            scrollY -= deltaY2;
        }
        if(scrollY >= 0)
            scrollboxElement.scrollTop = scrollY;
    }
    useEventHook(globalDragAndDropEvents.notifyStart, (param) => {
        itemRect = param.screenRect;
        interval = setInterval(() => processScroll(), 200);
    });
    useEventHook(globalDragAndDropEvents.notifyMove, (param) => {
        itemRect = param.screenRect;
    });
    useEventHook([globalDragAndDropEvents.notifyCancel, globalDragAndDropEvents.notifyDrop], () => {
        if(interval !== undefined) {
            clearInterval(interval);
            interval = undefined;
            itemRect = undefined;
        }
    });
}
