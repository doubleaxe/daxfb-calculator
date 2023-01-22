import {useEventListener} from '@vueuse/core';
import type {PointType} from '../geometry';
import type {InterfaceOf} from '../types';

const CoordinateType = [
    'client',
    'movement',
    'offset',
    'page',
    'screen',
] as const;
type CoordinateTypeKey = (typeof CoordinateType)[number];
type CoordinateObject = {[K in CoordinateTypeKey]: PointType};
type PointerObject = {
    coordinate: CoordinateObject;
    button: number;
    buttons: number;
};

export class PointerImpl {
    private _isInside = false;
    private _pointer?: PointerObject;
    constructor() {
        const handler = (event: PointerEvent) => {
            const e = event as unknown as {[K: string]: unknown};
            const coordinate = Object.fromEntries(CoordinateType.map((t) => [
                t,
                {x: e[t + 'X'] as number, y: e[t + 'Y'] as number}
            ])) as CoordinateObject;
            this._pointer = {
                coordinate,
                button: event.button,
                buttons: event.buttons,
            };
            this._isInside = true;
        };
        useEventListener(window, ['pointerenter', 'pointerdown', 'pointermove', 'pointerup'], handler, {passive: true});
        useEventListener(window, 'pointerleave', () => { this._isInside = false; }, {passive: true});
    }

    cloneLastEvent(type: string) {
        const pointer = this._pointer;
        if(!pointer)
            return undefined;
        const event = new Event(type);
        const e = event as unknown as {[K: string]: unknown};
        for(const t of CoordinateType) {
            e[t + 'X'] = pointer.coordinate[t].x;
            e[t + 'Y'] = pointer.coordinate[t].y;
        }
        e['x'] = pointer.coordinate.client.x;
        e['y'] = pointer.coordinate.client.y;
        e['button'] = pointer.button;
        e['buttons'] = pointer.buttons;
        return event;
    }
    get isInside() { return this._isInside; }
    getCoordinate(t: CoordinateTypeKey) {
        const pointer = this._pointer;
        if(!pointer)
            return {x: 0, y: 0};
        return pointer.coordinate[t];
    }
}
export type Pointer = InterfaceOf<PointerImpl>;
