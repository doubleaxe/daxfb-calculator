import type {BlueprintItemModel} from '../../scripts/model/store';
import {useEventListener} from '@vueuse/core';

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
