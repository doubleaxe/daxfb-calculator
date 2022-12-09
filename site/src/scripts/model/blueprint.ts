import {reactive, watch} from 'vue';
import {Point, type PointType} from '../geometry';
import {BlueprintItemModelImpl} from './blueprint-item';
import {LinkModelImpl} from './link';
import type {BlueprintItemModel, LinkModel, RecipeIOModel} from './store';

type UpdateOffsetPositionCallback = () => PointType | undefined;

export class BlueprintModelImpl {
    public readonly items: BlueprintItemModel[] = [];
    public readonly links: LinkModel[] = [];
    public readonly tempLinks: LinkModel[] = [];
    private _xmax = 0;
    private _ymax = 0;
    private offsetPos = new Point();
    private updateOffsetPositionCallback: UpdateOffsetPositionCallback | undefined;

    //types are compatible, just don't use instanceof
    //ReactiveBlueprintItemModel, ReactiveLinkModel are too complex and too mess to implement
    addItem(name: string) {
        const item = reactive(new BlueprintItemModelImpl(this, name));
        this.items.push(item);
        watch([() => item.pos.x, () => item.pos.y], this._updateXY.bind(this));
        return item;
    }
    addLink(input: RecipeIOModel, output: RecipeIOModel) {
        const link = reactive(new LinkModelImpl(input, output));
        this.links.push(link);
        return link;
    }
    createTempLink(...io: RecipeIOModel[]) {
        const link = BlueprintModelImpl.newLink(io);
        this.tempLinks.push(link);
        return link;
    }
    clearTempLinks() {
        this.tempLinks.splice(0, this.tempLinks.length);
    }
    private static newLink(io: RecipeIOModel[]) {
        if(io.length > 2)
            throw new Error(`Expected 2 elements, got ${io.length}`);
        const _io: {input?: RecipeIOModel; output?: RecipeIOModel} = {
            input: undefined,
            output: undefined,
        };
        for(const i of io) {
            const target: keyof(typeof _io) = i.isInput ? 'input' : 'output';
            if(_io[target])
                throw new Error('Expecting 1 input and 1 output, got duplicates');
            _io[target] = i;
        }
        return reactive(new LinkModelImpl(_io.input, _io.output));
    }

    //basically we cannot watch window move (relayout) events
    //so we should update offset every time we would need it
    //also automatically updated on create and on scroll
    requestUpdateOffsetPosition() {
        if(this.updateOffsetPositionCallback) {
            this.offsetPos.assign(this.updateOffsetPositionCallback());
        }
    }
    registerUpdateOffsetPosition(callback: UpdateOffsetPositionCallback) {
        if(this.updateOffsetPositionCallback)
            throw new Error('Callback already registered');
        this.updateOffsetPositionCallback = callback;
    }
    screenToClient(point: PointType, {noUpdate}: {noUpdate?: boolean} = {}): PointType {
        if(!noUpdate)
            this.requestUpdateOffsetPosition();
        return {
            x: point.x - this.offsetPos.x,
            y: point.y - this.offsetPos.y,
        };
    }
    private _updateXY([newX, newY]: number[], oldXY: number[]) {
        if(newX > this._xmax)
            this._xmax = newX;
        if(newY > this._ymax)
            this._ymax = newY;
    }

    get xmax() { return this._xmax; }
    get ymax() { return this._ymax; }
}
