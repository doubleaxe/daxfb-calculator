import type {BlueprintItemModel} from '../../scripts/model/store';
import {useEventListener} from '@vueuse/core';
import {Point} from '../../scripts/geometry';

//custom useDraggable
//because original captures all events, and cannot be used to drag only parts
class SingleItemDraggable {
    private readonly item;
    private readonly deltaXY;
    constructor(item: BlueprintItemModel, element: HTMLElement) {
        this.item = item;
        this.deltaXY = new Point();
        useEventListener(element, 'pointerdown', this.onStart.bind(this));
        SingleItemDraggable.init();
    }
    onStart(event: PointerEvent) {
        //draggable will pass incorrect coordinates, due to scrollable, padding, ect
        //we should fix it here
        const {item, deltaXY} = this;
        const mouseClientPos = item.owner?.screenToClient({x: event.pageX, y: event.pageY}, {noUpdate: false});
        this.item.owner?.requestUpdateOffsetPosition();
        deltaXY.assign(item.pos);
        deltaXY.offsetTo(mouseClientPos, -1);
        SingleItemDraggable.currentlyDragging = this;
    }
    onMove(event: PointerEvent) {
        const {item, deltaXY} = this;
        const mouseClientPos = item.owner?.screenToClient({x: event.pageX, y: event.pageY}, {noUpdate: true});
        item.pos.assign(new Point(mouseClientPos).offsetTo(deltaXY));
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
        const element = mouseEvent.currentTarget as HTMLElement;
        if(this.itemsDraggable.has(element))
            return;
        const itemDraggable = new SingleItemDraggable(item, element);
        this.itemsDraggable.set(element, itemDraggable);
        //activate draggable then resend event, to activate first dragging
        itemDraggable.onStart(mouseEvent);
    }
}
