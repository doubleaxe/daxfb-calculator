import {type InjectionKey, type App, reactive, inject} from 'vue';
import type {InterfaceOf} from '../types';
import {PointerImpl, type Pointer} from './pointer';
import {PoinAndClickImpl, type PoinAndClick, type SelectedObject} from './point-n-click-impl';

export type {Pointer, PoinAndClick, SelectedObject};

//TODO - move all drag-n-drop, drag-n-scroll and autoscroll logic here
class HtmlHelpersImpl {
    private readonly _pointer: Pointer;
    private readonly _pointAndClickImpl: PoinAndClick;
    constructor() {
        this._pointer = new PointerImpl();
        this._pointAndClickImpl = new PoinAndClickImpl();
    }

    get pointer() { return this._pointer; }
    get pointAndClickImpl() { return this._pointAndClickImpl; }
}
export type HtmlHelpers = InterfaceOf<HtmlHelpersImpl>;


export const HtmlHelpersKey = Symbol('HtmlHelpers') as InjectionKey<HtmlHelpers>;
export const provideHtmlHelpers = (app: App): HtmlHelpers => {
    const helpers = reactive(new HtmlHelpersImpl());
    app.provide(HtmlHelpersKey, helpers);
    return helpers;
};
export const injectHtmlHelpers = (): HtmlHelpers => {
    const helpers = inject(HtmlHelpersKey);
    if(!helpers)
        throw new Error('HtmlHelpers not instantiated');
    return helpers;
};
