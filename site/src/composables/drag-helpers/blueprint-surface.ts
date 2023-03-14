/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {Point, Rect, type PublicRect} from '@/scripts/geometry';
import type {BlueprintItemModel} from '@/scripts/model/store';
import {injectSettings} from '@/scripts/settings';
import {createSharedComposable, unrefElement, type MaybeElement} from '@vueuse/core';
import {readonly, ref, unref} from 'vue';
import {getScrollBox} from './commons';

export function useBlueprintSurface() {
    const settings = injectSettings();
    const boundingRectRef = ref<PublicRect>(Rect.assign());
    const surfaceElem = ref<MaybeElement>();
    //this may be different from surface to support negative scroll
    const originElem = ref<MaybeElement>();

    function applyStyle(elem: HTMLElement | SVGElement | null | undefined, style: Record<string, string>) {
        if(!elem)
            return;
        Object.entries(style).forEach(([key, value]) => {
            elem.style.setProperty(key, value);
        });
    }

    //there will be glitches, if we drag and expand and scroll simultaneously
    //so we do this only on demand, when blueprint items changed
    function updateSurface(items: IterableIterator<BlueprintItemModel>) {
        type MinMax = Record<'minX' | 'minY' | 'maxX' | 'maxY', number | undefined>;
        const {minX, minY, maxX, maxY} = [...items].reduce((minmax: MinMax, {rect}) => ({
            minX: (minmax.minX !== undefined) ? Math.min(rect.x, minmax.minX) : rect.x,
            minY: (minmax.minY !== undefined) ? Math.min(rect.y, minmax.minY) : rect.y,
            maxX: (minmax.maxX !== undefined) ? Math.max(rect.x1, minmax.maxX) : rect.x1,
            maxY: (minmax.maxY !== undefined) ? Math.max(rect.y1, minmax.maxY) : rect.y1,
        }), {} as MinMax);
        const _minItemXY = Point.assign({x: minX, y: minY});
        const _maxItemXY = Point.assign({x: maxX, y: maxY});
        const scale = settings.scale;
        const haveScale = (scale && (scale != 1));

        const {scrollboxElement, targetElement} = getScrollBox(surfaceElem);
        let visibleRect = Rect.assign();
        if(scrollboxElement) {
            visibleRect = Rect.assign(scrollboxElement.getBoundingClientRect());
            if(haveScale) {
                const div = 1 / scale;
                visibleRect = visibleRect.scalePoint(div).scaleSize(div);
            }
        }

        let boundingRect: PublicRect;
        if(!_minItemXY.x && !_minItemXY.y && !_maxItemXY.x && !_maxItemXY.y) {
            boundingRect = Rect.assign();
        } else {
            const x1 = Math.min(_minItemXY.x - 500, 0);
            const y1 = Math.min(_minItemXY.y - 500, 0);

            //we need keep scroll position, so it will not suddenly jump somewhere
            //for this we must make bounding rect bigger than visible rect (at offset 0,0)
            const x2 = Math.max(_maxItemXY.x, visibleRect.width);
            const y2 = Math.max(_maxItemXY.y, visibleRect.height);

            //0:0 is min top-left point, so everything works fine at first drop
            boundingRect = Rect.assign({
                x: x1,
                y: y1,
                width: ((x2 - x1) + 500),
                height: ((y2 - y1) + 500),
            });
        }
        const {x, y, width, height} = boundingRect;
        let delta = Point.assign({
            x: unref(boundingRectRef).x - x,
            y: unref(boundingRectRef).y - y,
        });
        let unscaledRect = boundingRect;
        if(haveScale) {
            delta = delta.scalePoint(scale);
            unscaledRect = unscaledRect.scalePoint(scale).scaleSize(scale);
        }

        //surface is not slaced, but origin is
        //this is because scrollbars work incorrectly when surface is scaled
        //adjust surface and scrollbox immediatelly, so it will not flicker and no need to synchronize states
        //we directly manipulate DOM to achieve it
        const surfaceStyle = {
            width: unscaledRect.width ? `${unscaledRect.width}px` : '100%',
            height: unscaledRect.height ? `${unscaledRect.height}px` : '100%',
        };
        const originStyle = {
            left: `${-unscaledRect.x}px`,
            top: `${-unscaledRect.y}px`,
            width: `${width + x}px`,
            height: `${height + y}px`,
        };
        applyStyle(targetElement, surfaceStyle);
        applyStyle(unrefElement(originElem), originStyle);
        if(scrollboxElement) {
            //adjusting scrolling the same amount, so screen is left on the same position
            const scrollX = scrollboxElement.scrollLeft + delta.x;
            const scrollY = scrollboxElement.scrollTop + delta.y;
            if(scrollX >= 0)
                scrollboxElement.scrollLeft = scrollX;
            if(scrollY >= 0)
                scrollboxElement.scrollTop = scrollY;
        }

        boundingRectRef.value = boundingRect;
    }

    return {
        surfaceElem,
        originElem,
        updateSurface,
        boundingRect: readonly(boundingRectRef),
    };
}

export const useSharedBlueprintSurface = createSharedComposable(() => useBlueprintSurface());
