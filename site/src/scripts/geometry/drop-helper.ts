import {unrefElement} from '@vueuse/core';
import type {Ref} from 'vue';
import {Rect, type PointType} from '.';

//two methods
//first one is based on scrollable parent (element may have scrollable parent) - blueprint has
//second one is based on elementsFromPoint - should be universal, maybe slower
//first one doesn't support zoom
export function isPointInsideElement1(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    point: PointType,
): boolean {
    const targetElement = unrefElement(target);
    if(!targetElement)
        return false;
    if((point.x < 0) || (point.y < 0))
        return false;
    let scrollboxElement: HTMLElement | null = targetElement;
    for(;;) {
        scrollboxElement = scrollboxElement.parentElement;
        if(!scrollboxElement)
            break;
        const isScrolling = (scrollboxElement.scrollHeight > scrollboxElement.clientHeight)
            || (scrollboxElement.scrollWidth > scrollboxElement.clientWidth);
        if(isScrolling)
            break;
    }

    const visibleRect = Rect.assign((scrollboxElement || targetElement).getBoundingClientRect());
    return visibleRect.isPointInRect(point);
}

export function isPointInsideElement2(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    point: PointType,
): boolean {
    const targetElement = unrefElement(target);
    if(!targetElement)
        return false;
    if((point.x < 0) || (point.y < 0))
        return false;
    const elements = document.elementsFromPoint(point.x, point.y);
    return elements.some((e) => (e === targetElement));
}
