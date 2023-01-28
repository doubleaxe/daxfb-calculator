import {Rect, type ReadonlyPointType, type ReadonlyRectType} from '@/scripts/geometry';
import {unrefElement, type Arrayable, type MaybeComputedElementRef, type MaybeElement} from '@vueuse/core';

export function getScrollBox(target: MaybeComputedElementRef<MaybeElement> | undefined) {
    const targetElement = unrefElement(target);
    if(!targetElement)
        return {};

    let scrollboxElement = targetElement as HTMLElement | null;
    for(;;) {
        scrollboxElement = scrollboxElement?.parentElement || null;
        if(!scrollboxElement)
            break;
        const isScrolling = (scrollboxElement.scrollHeight > scrollboxElement.clientHeight)
            || (scrollboxElement.scrollWidth > scrollboxElement.clientWidth);
        if(isScrolling)
            break;
    }
    return {
        targetElement,
        scrollboxElement,
    };
}

//two methods
//first one is based on scrollable parent (element may have scrollable parent) - blueprint has
//second one is based on elementsFromPoint - should be universal, maybe slower
export function isPointInsideElement1(
    target: MaybeComputedElementRef<MaybeElement> | undefined,
    point: ReadonlyPointType,
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
    target: MaybeComputedElementRef<MaybeElement> | undefined,
    point: ReadonlyPointType,
): boolean {
    const targetElement = unrefElement(target);
    if(!targetElement)
        return false;
    if((point.x < 0) || (point.y < 0))
        return false;
    const elements = document.elementsFromPoint(point.x, point.y);
    return elements.some((e) => (e === targetElement));
}

//if scaled - transform-origin must be: 0 0;
export function screenToClient<T = Arrayable<ReadonlyRectType>>(
    parent: MaybeComputedElementRef<MaybeElement> | undefined,
    rects: T,
    scale?: number,
): T extends ReadonlyRectType ? Rect : Rect[];
export function screenToClient(
    parent: MaybeComputedElementRef<MaybeElement> | undefined,
    rects: Arrayable<ReadonlyRectType>,
    scale?: number,
): Arrayable<Rect> {
    const parentElement = unrefElement(parent);
    const parentRect = parentElement?.getBoundingClientRect() || Rect.assign();
    const rectsArray = Array.isArray(rects) ? rects : [rects];
    const clientRects = rectsArray.map((rect) => {
        let clientRect = Rect.assign(rect).offsetBy(parentRect, -1);
        if(scale && (scale != 1)) {
            const div = 1 / scale;
            clientRect = clientRect.scalePoint(div).scaleSize(div);
        }
        return clientRect;
    });
    return Array.isArray(rects) ? clientRects : clientRects[0];
}
