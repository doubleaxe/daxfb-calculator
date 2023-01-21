import type {BlueprintItemModel, BlueprintModel} from '@/scripts/model/store';
import {useEventListener} from '@vueuse/core';
import {Point, type ReadonlyPointType} from '@/scripts/geometry';
import {watch} from 'vue';

interface DragListener {
    onDrag: (element: HTMLElement) => void;
    onDrop: () => void;
}

//custom useDraggable
//because original captures all events, and cannot be used to drag only parts
class SingleItemDraggable {
    private readonly item;
    private readonly element;
    private deltaXY: Point;
    private lastPosition: ReadonlyPointType | undefined;
    private readonly listener;
    constructor(item: BlueprintItemModel, element: HTMLElement, listener?: DragListener) {
        this.item = item;
        this.element = element;
        this.deltaXY = Point.assign();
        this.listener = listener;
        useEventListener(element, 'pointerdown', this.onStart.bind(this));
        SingleItemDraggable.init(item.owner);
    }
    onStart(event: PointerEvent) {
        //draggable will pass incorrect coordinates, due to scrollable, padding, ect
        //we should fix it here
        const {item, deltaXY} = this;
        const mouseClientPos = item.screenToClient({x: event.pageX, y: event.pageY}, {isPassive: false});
        this.deltaXY = deltaXY.assign(item.rect).offsetBy(mouseClientPos, -1);
        SingleItemDraggable.currentlyDragging = this;
        this.item.isFloating = true;
    }
    onMove(event?: PointerEvent) {
        const {item, deltaXY} = this;
        const position = event ? {x: event.pageX, y: event.pageY} : this.lastPosition;
        if(!position)
            return;
        this.lastPosition = position;
        const mouseClientPos = item.owner?.screenToClient(position, {isPassive: true});
        item.rect = item.rect.assignPoint(mouseClientPos?.offsetBy(deltaXY)?.positive());
        this.listener?.onDrag(this.element);
    }
    onEnd() {
        this.item.isFloating = false;
        this.listener?.onDrop();
    }
    private static initialized = false;
    private static currentlyDragging?: SingleItemDraggable;
    private static onMove(event?: PointerEvent) {
        this.currentlyDragging?.onMove(event);
    }
    private static onEnd() {
        this.currentlyDragging?.onEnd();
        this.currentlyDragging = undefined;
    }
    private static init(blueprint?: BlueprintModel) {
        if(this.initialized)
            return;
        useEventListener(window, 'pointermove', this.onMove.bind(this));
        useEventListener(window, 'pointerup', this.onEnd.bind(this));
        if(blueprint) {
            watch([() => blueprint.boundingRect.x, () => blueprint.boundingRect.y], () => {
                this.onMove();
            });
        }
    }
}

export default class ItemsDraggable {
    private itemsDraggable = new WeakMap<HTMLElement, SingleItemDraggable>();
    private readonly listener;

    constructor(listener?: DragListener) {
        this.listener = listener;
    }

    addDraggable(item?: BlueprintItemModel, mouseEvent?: PointerEvent) {
        if(!item || !mouseEvent)
            return;
        if(!(mouseEvent?.currentTarget instanceof HTMLElement))
            return;
        const element = mouseEvent.currentTarget as HTMLElement;
        if(this.itemsDraggable.has(element))
            return;
        const itemDraggable = new SingleItemDraggable(item, element, this.listener);
        this.itemsDraggable.set(element, itemDraggable);
        //activate draggable then resend event, to activate first dragging
        itemDraggable.onStart(mouseEvent);
    }
}
