import {getScrollBox, Point, Rect} from '@/scripts/geometry';
import {unrefElement, useEventListener} from '@vueuse/core';
import type {Ref} from 'vue';
import type {Pointer} from '@/scripts/html/pointer';

export class ScrollHelper {
    private readonly target;
    private readonly pointer;
    constructor(target: Ref<HTMLElement | null> | HTMLElement | null, pointer: Pointer) {
        this.target = target;
        this.registerDragScroll();
        this.pointer = pointer;
    }

    private currentItem?: HTMLElement;
    private currentInterval?: number;
    processItemDrag(item: Ref<HTMLElement | null> | HTMLElement | null) {
        const currentItem = unrefElement(item);
        if(currentItem && (currentItem != this.currentItem)) {
            this.processItemDrop();
            this.currentItem = currentItem;
            this.currentInterval = setInterval(() => this._processScroll(), 200);
        }
    }
    processItemDrop() {
        clearInterval(this.currentInterval);
        this.currentItem = undefined;
        this.currentInterval = undefined;
    }
    private _processScroll() {
        const {scrollboxElement} = getScrollBox(this.target);
        if(!scrollboxElement || !this.currentItem)
            return;
        const itemRect = Rect.assign(this.currentItem.getBoundingClientRect());
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

        //emit pointermove so element may adjust its position (link for example)
        const pointerMove = this.pointer.cloneLastEvent('pointermove');
        if(pointerMove) {
            this.currentItem.dispatchEvent(pointerMove);
        }
    }

    private dragScrolling?: {mouse: Point; scroll: Point; scrollboxElement: HTMLElement};
    registerDragScroll() {
        useEventListener(window, 'pointermove', this.dragScrollMove.bind(this));
        useEventListener(window, 'pointerup', this.dragScrollStop.bind(this));
    }
    dragScrollStart(event: PointerEvent) {
        //TODO user clicked on something else
        const {scrollboxElement} = getScrollBox(this.target);
        if(!scrollboxElement)
            return;
        this.dragScrolling = {
            mouse: Point.assign({x: event.pageX, y: event.pageY}),
            scroll: Point.assign({x: scrollboxElement.scrollLeft, y: scrollboxElement.scrollTop}),
            scrollboxElement,
        };
    }
    dragScrollMove(event: PointerEvent) {
        if(!this.dragScrolling)
            return;
        const {mouse, scroll, scrollboxElement} = this.dragScrolling;
        const delta = Point.assign({x: event.pageX, y: event.pageY}).offsetBy(mouse, -1);
        const deltaScroll = scroll.offsetBy(delta, -1);
        if(deltaScroll.x >= 0)
            scrollboxElement.scrollLeft = deltaScroll.x;
        if(deltaScroll.y >= 0)
            scrollboxElement.scrollTop = deltaScroll.y;
    }
    dragScrollStop() {
        this.dragScrolling = undefined;
    }
}
