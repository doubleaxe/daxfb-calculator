import {getScrollBox, Rect} from '@/scripts/geometry';
import {unrefElement} from '@vueuse/core';
import type {Ref} from 'vue';

export class ScrollHelper {
    private readonly target;
    private currentItem?: HTMLElement;
    private currentInterval?: number;
    constructor(target: Ref<HTMLElement | null> | HTMLElement | null) {
        this.target = target;
    }

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
    }
}
