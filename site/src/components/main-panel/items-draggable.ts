import type {BlueprintItemModel} from '../../scripts/model/store';
import {useDraggable, useEventListener} from '@vueuse/core';
import {nextTick, unref} from 'vue';

//custom useDraggable
//because original captures all events, and cannot be used to drag only parts
class SingleItemDraggable {
    private readonly item;
    private readonly deltaXY;
    constructor(item: BlueprintItemModel, component: HTMLElement) {
        this.item = item;
        this.deltaXY = {x: 0, y: 0};
        useEventListener(component, 'pointerdown', this.onStart.bind(this));
        SingleItemDraggable.init();
    }
    onStart(event: PointerEvent) {
        //draggable will pass incorrect coordinates, due to scrollable, padding, ect
        //we should fix it here
        const {item, deltaXY} = this;
        deltaXY.x = item.x - event.pageX;
        deltaXY.y = item.y - event.pageY;
        SingleItemDraggable.currentlyDragging = this;
    }
    onMove(event: PointerEvent) {
        const {item, deltaXY} = this;
        item.x = Math.max(0, deltaXY.x + event.pageX);
        item.y = Math.max(0, deltaXY.y + event.pageY);
    }
    private static initialized = false;
    private static currentlyDragging?: SingleItemDraggable;
    private static onMove(event: PointerEvent) {
        this.currentlyDragging?.onMove(event);
    }
    private static onEnd() {
        this.currentlyDragging = undefined;
    }
    private static init() {
        if(this.initialized)
            return;
        useEventListener(window, 'pointermove', this.onMove.bind(this));
        useEventListener(window, 'pointerup', this.onEnd.bind(this));
    }
}
/*
function useSingleItemDraggable(item: BlueprintItemModel, component: HTMLElement) {
    const deltaXY = {
        x: 0,
        y: 0,
    };
    useDraggable(component, {
        initialValue: {x: item.x, y: item.y},
        exact: true,
        onStart({x, y}, event) {
            //where vuesue thinks position should be
            const vueUseXY = {
                x: event.pageX - unref(x),
                y: event.pageY - unref(y),
            };
            //draggable will pass incorrect coordinates, due to scrollable, padding, ect
            //we should fix it here
            deltaXY.x = item.x - vueUseXY.x;
            deltaXY.y = item.y - vueUseXY.y;
        },
        onMove({x, y}) {
            item.x = deltaXY.x + unref(x);
            item.y = deltaXY.y + unref(y);
        }
    });
}

export default class ItemsDraggable {
    private itemsDraggable = new WeakSet<HTMLElement>();

    addDraggable(item?: BlueprintItemModel, mouseEvent?: Event) {
        if(!item || !mouseEvent)
            return;
        if(!(mouseEvent?.currentTarget instanceof HTMLElement))
            return;
        const component = mouseEvent.currentTarget as HTMLElement;
        if(this.itemsDraggable.has(component))
            return;
        this.itemsDraggable.add(component);
        //activate draggable then resend event, to activate first dragging
        useSingleItemDraggable(item, component);

        const mouseEventAny = (mouseEvent as unknown as {[key: string]: unknown});
        const mouseEventCopy = new Event(mouseEvent.type);
        Object.assign(mouseEventCopy, {
            pageX: mouseEventAny.pageX,
            pageY: mouseEventAny.pageY,
        });
        nextTick(() => component.dispatchEvent(mouseEventCopy));
    }
}
*/

export default class ItemsDraggable {
    private itemsDraggable = new WeakMap<HTMLElement, SingleItemDraggable>();

    addDraggable(item?: BlueprintItemModel, mouseEvent?: PointerEvent) {
        if(!item || !mouseEvent)
            return;
        if(!(mouseEvent?.currentTarget instanceof HTMLElement))
            return;
        const component = mouseEvent.currentTarget as HTMLElement;
        if(this.itemsDraggable.has(component))
            return;
        const itemDraggable = new SingleItemDraggable(item, component);
        this.itemsDraggable.set(component, itemDraggable);
        //activate draggable then resend event, to activate first dragging
        itemDraggable.onStart(mouseEvent);
    }
}
