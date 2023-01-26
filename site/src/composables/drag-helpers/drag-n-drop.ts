import {Point, Rect, type ReadonlyPointType} from '@/scripts/geometry';
import {injectSettings} from '@/scripts/settings';
import {createEventHook, createGlobalState, createSharedComposable, tryOnScopeDispose, unrefElement, useEventListener, type MaybeElement} from '@vueuse/core';
import {computed, ref, unref} from 'vue';
import {justEventHook, type JustEventHook} from '../use-event-hook';
import {isPointInsideElement2} from './commons';

interface CurrentlyDraggable {
    onMove: (event?: PointerEvent) => void;
    onEnd: (event?: PointerEvent) => void;
}

export type DragStart<ItemType> = (event: PointerEvent, item: ItemType) => void;

export interface UseDragAndDropOptions {
    /**
     * If both point-and-click and drag-and-drop api is enabled
     * and this is true, then dragging starts with delay, to distinct from regular clicks
     */
    useDelay?: boolean;
}

export interface DraggableListenerParam<ItemType> {
    item: ItemType;
    itemRect: Rect;
}

const NotifierKeyValues = [
    'notifyStart',
    'notifyMove',
    'notifyDrop',
    'notifyCancel',
] as const;
export type NotifierKeys = (typeof NotifierKeyValues)[number];
export type DraggableHooks<ItemType> = {
    [s in NotifierKeys]: JustEventHook<DraggableListenerParam<ItemType>>;
};

class DraggableHooksImpl<ItemType> {
    readonly notifyStart = createEventHook<DraggableListenerParam<ItemType>>();
    readonly notifyMove = createEventHook<DraggableListenerParam<ItemType>>();
    readonly notifyDrop = createEventHook<DraggableListenerParam<ItemType>>();
    readonly notifyCancel = createEventHook<DraggableListenerParam<ItemType>>();

    toJustEventHooks() {
        const result = Object.fromEntries(
            NotifierKeyValues.map((key) => [key, justEventHook(this[key])]),
        ) as DraggableHooks<ItemType>;
        return result;
    }
    trigger(key: NotifierKeys, param: DraggableListenerParam<ItemType>) {
        this[key].trigger(param);
    }
}

//we have only one active drag and drop at a time
const useSharedMouse = createSharedComposable(() => {
    const currentlyDragging = ref<CurrentlyDraggable | undefined>();
    const lastMousePosition = ref<ReadonlyPointType | undefined>();

    //window by default
    useEventListener('pointermove', (event: PointerEvent) => {
        lastMousePosition.value = {x: event.clientX, y: event.clientY};
        unref(currentlyDragging)?.onMove(event);
    }, {passive: true});
    useEventListener('pointerup', (event: PointerEvent) => {
        lastMousePosition.value = {x: event.clientX, y: event.clientY};
        unref(currentlyDragging)?.onEnd(event);
    }, {passive: true});
    //when scrolled - try to keep item in place
    useEventListener(['scroll', 'resize'], () => unref(currentlyDragging)?.onMove(), {capture: true, passive: true});

    return {currentlyDragging, lastMousePosition};
});

//this is for auto scroll while dragging something
const globalHooks = new DraggableHooksImpl();
export const useGlobalDragAndDropListener = createGlobalState(() => globalHooks.toJustEventHooks());

//listener for single instance
//notifier for shared instance
export function useDragAndDrop<ItemType>(
    options: UseDragAndDropOptions = {},
) {
    const settings = injectSettings();
    const {currentlyDragging, lastMousePosition} = useSharedMouse();

    //activator is element, which activates drag-and-drop on keydown
    //it will be taken from PointerEvent
    const activatorElem = ref<HTMLElement | undefined>();
    //movable is what is moved on screen, by default = activator
    //for links and left panel it is different
    const movableElem = ref<MaybeElement>();
    const movableElemAuto = computed(() => (unrefElement(movableElem) as HTMLElement | undefined) || unref(activatorElem));
    //dropZone is where to drop, by default = entire window
    //drag is not finished if dropped outside drop zone
    const dropZoneElem = ref<MaybeElement>();

    const offsetPosition = ref<Point | undefined>();
    //in screen coordinates
    const dragRect = ref<Rect | undefined>();
    const isDragging = ref(false);

    const currentItem = ref<ItemType | undefined>();
    const hooks = new DraggableHooksImpl<ItemType>();

    function trigger(key: NotifierKeys) {
        const param: DraggableListenerParam<ItemType> = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            item: unref(currentItem)!,
            itemRect: unref(dragRect) || Rect.assign(),
        };
        hooks.trigger(key, param);
        globalHooks.trigger(key, param);
    }

    function cleanup() {
        currentItem.value = undefined;
        currentlyDragging.value = undefined;
        activatorElem.value = undefined;
        isDragging.value = false;
        //don't clear rect, item may use it for positions
    }

    function updatePosition(event?: PointerEvent) {
        let mousePosition: Point;
        if(event) {
            mousePosition = Point.assign({x: event.clientX, y: event.clientY});
        } else {
            mousePosition = Point.assign(unref(lastMousePosition));
        }

        const offset = unref(offsetPosition) || Point.assign();
        const movableRect = unref(dragRect) || Rect.assign();
        dragRect.value = Rect.assign(movableRect, mousePosition.offsetBy(offset));
        return mousePosition;
    }

    const draggable: CurrentlyDraggable = {
        onMove(event?: PointerEvent) {
            updatePosition(event);
            trigger('notifyMove');
        },
        onEnd(event?: PointerEvent) {
            const mousePosition = updatePosition(event);
            if(unref(dropZoneElem) && !isPointInsideElement2(dropZoneElem, mousePosition)) {
                trigger('notifyCancel');
            } else {
                trigger('notifyDrop');
            }
            cleanup();
        },
    };

    let timer: number | undefined = undefined;
    function cancelDelayedStart() {
        if(timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
        }
    }

    function onStart(event: PointerEvent, item: ItemType) {
        timer = undefined;
        if(unref(currentlyDragging)) {
            console.warn('Already dragging something, you can drag only one item at a time');
        }
        currentItem.value = item;
        currentlyDragging.value = draggable;
        isDragging.value = true;

        const activator = event.target as HTMLElement;
        const movable = unref(movableElemAuto) || activator;
        activatorElem.value = activator;

        //we will align activatorElem and movableElem by center points, then calculate offset mouse position
        //so movableElem will be shown in the same place as activatorElem
        const activatorRect = Rect.assign(activator.getBoundingClientRect());
        const movableRect = Rect.assign(movable.getBoundingClientRect());
        const mousePosition = Point.assign({x: event.clientX, y: event.clientY});

        //we assume movable is less than activator, and mouse is inside activator
        //otherwise all calculations become negative, but it won't break them
        const halfDeltaSize = Point.assign({
            x: (activatorRect.width - movableRect.width) / 2,
            y: (activatorRect.height - movableRect.height) / 2,
        });
        //half delta - (mouse pos - upper left of activator) = mouse offset from movable
        const offset = halfDeltaSize.offsetBy(mousePosition.offsetBy(activatorRect, -1), -1);
        //mouse pos + offset = movable pos
        const movablePos = mousePosition.offsetBy(offset);

        offsetPosition.value = offset;
        dragRect.value = Rect.assign(movablePos, {width: movableRect.width, height: movableRect.height});
        trigger('notifyStart');
    }

    const dragStart: DragStart<ItemType> = (event: PointerEvent, item: ItemType) => {
        cancelDelayedStart();
        const start = () => onStart(event, item);
        if(settings.pointAndClickEnabled && options.useDelay) {
            //usual click takes around 110-130 ms
            setTimeout(start, 300);
        } else {
            start();
        }
    };

    //if we are waiting for activation and user moves cursor out of element - cancel drag
    useEventListener(activatorElem, 'pointerleave', cancelDelayedStart);

    tryOnScopeDispose(cancelDelayedStart);

    return {
        dragStart,
        dragRect,
        isDragging,
        hooks: hooks.toJustEventHooks(),
        currentItem,
        activatorElem,
        movableElem,
        movableElemAuto,
        dropZoneElem,
    };
}
