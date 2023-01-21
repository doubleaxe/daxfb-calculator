import {unrefElement} from '@vueuse/core';
import type {Ref} from 'vue';
import {Rect, type PointType} from '.';

export function getScrollBox(target: Ref<HTMLElement | null> | HTMLElement | null) {
    const targetElement = unrefElement(target);
    if(!targetElement)
        return {};

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
    return {
        targetElement,
        scrollboxElement
    };
}

//two methods
//first one is based on scrollable parent (element may have scrollable parent) - blueprint has
//second one is based on elementsFromPoint - should be universal, maybe slower
export function isPointInsideElement1(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    point: PointType,
): boolean {
    if((point.x < 0) || (point.y < 0))
        return false;

    const {targetElement, scrollboxElement} = getScrollBox(target);
    if(!targetElement)
        return false;

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
