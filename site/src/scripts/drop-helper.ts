import type {Ref} from 'vue';
import {unref} from 'vue';
import {Point, Vector, Rectangle} from 'ts-2d-geometry';
import {useElementBounding, unrefElement} from '@vueuse/core';

interface Options {
    scrollableParent?: boolean;
}

export type DropHelper<Param> = (dropPoint: {x: number; y: number}, param: Param) => void;

export function useDropHelper<Param>(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    processor: DropHelper<Param>,
    {scrollableParent}: Options = {}
): DropHelper<Param> {
    return ({x: screenX, y: sceenY}, param) => {
        const targetRaw = unrefElement(target);
        const scrollboxRaw = scrollableParent ? targetRaw?.parentElement : targetRaw;
        const options = {
            windowResize: false,
            windowScroll: false,
        };
        const {
            x: blueprintX,
            y: blueprintY,
        } = useElementBounding(targetRaw, options);
        const {
            x: scrollboxX,
            y: scrollboxY,
            width: scrollboxWidth,
            height: scrollboxHeight
        } = useElementBounding(scrollboxRaw, options);
        const screenPoint = new Point(screenX, sceenY);
        const scrollboxOrigin = new Point(unref(scrollboxX), unref(scrollboxY));
        const boundingRect = new Rectangle(
            scrollboxOrigin,
            scrollboxOrigin.plus(new Vector(unref(scrollboxWidth), unref(scrollboxHeight))),
        );
        if(boundingRect.toPolygon().containsPoint(screenPoint)) {
            const targetOrigin = new Point(unref(blueprintX), unref(blueprintY));
            const targetPoint = screenPoint.minus(targetOrigin);
            processor(targetPoint, param);
        }
    };
}
