
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
    protected readonly _x;
    protected readonly _y;

    protected constructor(_baseAssign: AssignablePoinFunction<T>, base?: PartialPointType, assign?: PartialPointType) {
        this._baseAssign = _baseAssign;
        this._x = assign?.x ?? base?.x ?? 0;
        this._y = assign?.y ?? base?.y ?? 0;
    }
    get x() { return this._x; }
    get y() { return this._y; }

    assignPoint(assign?: PartialPointType) {
        //filter only valid ones, for not unexpectedly dragging rect instead of point
        return this._baseAssign(this, {x: assign?.x, y: assign?.y});
    }
    offsetBy(point: ReadonlyPointType, sign?: number) {
        return this.assignPoint({
            x: this._x + (sign || 1) * (point.x),
            y: this._y + (sign || 1) * (point.y),
        });
    }
    positive() {
        return this.assignPoint({
            x: Math.max(this._x, 0),
            y: Math.max(this._y, 0),
        });
    }
    middlePoint(point: ReadonlyPointType) {
        const middleX = (this._x + point.x) / 2;
        const middleY = (this._y + point.y) / 2;
        return this.assignPoint({x: middleX, y: middleY});
    }
    distanceTo(point: ReadonlyPointType) {
        return this.assignPoint({
            x: (this._x - point.x),
            y: (this._y - point.y),
        });
    }
    isEqual(point: ReadonlyPointType) {
        return (this._x === point.x) && (this._y === point.y);
    }
}

//object is immutable
export class Point extends PointBase<Point> implements ReadonlyPointType {
    protected constructor(base?: PartialPointType, assign?: PartialPointType) {
        super(Point.assign, base, assign);
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
    protected readonly _width;
    protected readonly _height;
    protected constructor(base?: PartialRectType, assign?: PartialRectType) {
        super(Rect.assign, base, assign);
        this._width = assign?.width ?? base?.width ?? 0;
        this._height = assign?.height ?? base?.height ?? 0;
    }
    get width() { return this._width; }
    get height() { return this._height; }

    get x1() { return this._x + this._width; }
    get y1() { return this._y + this._height; }

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

    isEqual(rect: ReadonlyRectType) {
        return super.isEqual(rect) && (this._width === rect.width) && (this._height === rect.height);
    }

    isPointInRect(point: ReadonlyPointType) {
        return (point.x >= this._x) && (point.y >= this._y)
            && (point.x <= this.x1) && (point.y <= this.y1);
    }
}

export * from './drop-helper';
