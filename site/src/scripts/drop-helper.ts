import type {Ref} from 'vue';
import {unref} from 'vue';
import {Point, Vector, Rectangle} from 'ts-2d-geometry';
import {useElementBounding, unrefElement} from '@vueuse/core';

interface Options {
    scrollableParent?: boolean;
}

export type PontXY = {x: number; y: number};
export type DropHelper<Param> = (dropPoint: PontXY, param: Param) => void;

//converts window coordinates to client coordinates for position: absolute
export function screenToClient(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    {x: screenX, y: sceenY}: PontXY,
    {scrollableParent}: Options = {}
): PontXY & {pointInsideClient: boolean} {
    const targetRaw = unrefElement(target);
    const scrollboxRaw = scrollableParent ? targetRaw?.parentElement : targetRaw;
    const options = {
        windowResize: false,
        windowScroll: false,
    };
    const {
        x: targetX,
        y: targetY,
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
    const targetOrigin = new Point(unref(targetX), unref(targetY));
    const targetPoint = screenPoint.minus(targetOrigin);
    return {
        x: targetPoint.x,
        y: targetPoint.y,
        pointInsideClient: boundingRect.toPolygon().containsPoint(screenPoint),
    };
}

export function useDropHelper<Param>(
    target: Ref<HTMLElement | null> | HTMLElement | null,
    processor: DropHelper<Param>,
    options: Options = {}
): DropHelper<Param> {
    return (screenXY: PontXY, param) => {
        const clientXY = screenToClient(target, screenXY, options);
        if(clientXY.pointInsideClient) {
            processor(clientXY, param);
        }
    };
}
