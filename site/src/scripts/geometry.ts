/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export type PointType = {x: number; y: number};
export type ReadonlyPointType = Readonly<PointType>;
export type PartialPointType = Partial<ReadonlyPointType>;
export type SizeType = {width: number; height: number};
export type ReadonlySizeType = Readonly<SizeType>;
export type PartialSizeType = Partial<ReadonlySizeType>;
export type RectType = PointType & SizeType;
export type ReadonlyRectType = Readonly<RectType>;
export type PartialRectType = Partial<RectType>;

type AssignablePoinFunction<T> = (point?: PartialPointType, assign?: PartialPointType) => T;

class PointBase<T> implements ReadonlyPointType {
    private readonly _baseAssign;
    readonly x;
    readonly y;

    protected constructor(_baseAssign: AssignablePoinFunction<T>, base?: PartialPointType, assign?: PartialPointType) {
        this._baseAssign = _baseAssign;
        this.x = assign?.x ?? base?.x ?? 0;
        this.y = assign?.y ?? base?.y ?? 0;
    }

    assignPoint(assign?: PartialPointType) {
        //filter only valid ones, for not unexpectedly dragging rect instead of point
        return this._baseAssign(this, {x: assign?.x, y: assign?.y});
    }
    offsetBy(point: ReadonlyPointType, sign?: number) {
        return this.assignPoint({
            x: this.x + (sign || 1) * (point.x),
            y: this.y + (sign || 1) * (point.y),
        });
    }
    positive() {
        return this.assignPoint({
            x: Math.max(this.x, 0),
            y: Math.max(this.y, 0),
        });
    }
    middlePoint(point: ReadonlyPointType) {
        const middleX = (this.x + point.x) / 2;
        const middleY = (this.y + point.y) / 2;
        return this.assignPoint({x: middleX, y: middleY});
    }
    distanceTo(point: ReadonlyPointType) {
        return this.assignPoint({
            x: (this.x - point.x),
            y: (this.y - point.y),
        });
    }
    scalePoint(scale: number) {
        return this.assignPoint({
            x: (this.x * scale),
            y: (this.y * scale),
        });
    }
    isEqual(point: ReadonlyPointType) {
        return (this.x === point.x) && (this.y === point.y);
    }

    toString() {
        return `${this.x}:${this.y}`;
    }
}

//object is immutable
export class Point extends PointBase<Point> implements ReadonlyPointType {
    protected constructor(base?: PartialPointType, assign?: PartialPointType) {
        super(Point.assign, base, assign);
        Object.freeze(this);
    }

    static assign(base?: PartialPointType, assign?: PartialPointType): Point {
        return new Point(base, assign);
    }

    assign(assign?: PartialPointType) {
        return Point.assign(this, assign);
    }
}

//object is immutable
//aligned to upper-left, as in html
export class Rect extends PointBase<Rect> implements ReadonlyRectType {
    readonly width;
    readonly height;
    protected constructor(base?: PartialRectType, assign?: PartialRectType) {
        super(Rect.assign, base, assign);
        this.width = assign?.width ?? base?.width ?? 0;
        this.height = assign?.height ?? base?.height ?? 0;
        Object.freeze(this);
    }

    get x1() { return this.x + this.width; }
    get y1() { return this.y + this.height; }

    static assign(base?: PartialRectType, assign?: PartialRectType): Rect {
        return new Rect(base, assign);
    }

    assign(assign?: PartialRectType): Rect {
        return Rect.assign(this, assign);
    }
    assignSize(assign?: PartialSizeType): Rect {
        //filter only valid ones
        return Rect.assign(this, {width: assign?.width, height: assign?.height});
    }

    scaleSize(scale: number) {
        return this.assignSize({
            width: (this.width * scale),
            height: (this.height * scale),
        });
    }

    isEqual(rect: ReadonlyRectType) {
        return super.isEqual(rect) && (this.width === rect.width) && (this.height === rect.height);
    }

    isPointInRect(point: ReadonlyPointType) {
        return (point.x >= this.x) && (point.y >= this.y)
            && (point.x <= this.x1) && (point.y <= this.y1);
    }
    isRectInRect(rect: ReadonlyRectType) {
        return (rect.x >= this.x) && (rect.y >= this.y)
            && ((rect.x + rect.width) <= this.x1) && ((rect.y + rect.height) <= this.y1);
    }

    toString() {
        return `${super.toString()}|${this.width}:${this.height}`;
    }
}
