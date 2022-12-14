
export type AssignOptions = {isSize?: boolean; isPosition?: boolean};
export type PointType = {x: number; y: number};
export type ReadonlyPointType = Readonly<PointType>;
export type SizeType = {width: number; height: number};
export type ReadonlySizeType = Readonly<SizeType>;
export type RectType = PointType & SizeType;
export type ReadonlyRectType = Readonly<RectType>;

export class Point implements PointType {
    x = 0;
    y = 0;
    constructor(point?: ReadonlyPointType) {
        this.assignPoint(point);
    }
    assignPoint(point?: ReadonlyPointType) {
        if(point?.x !== undefined)
            this.x = point.x;
        if(point?.y !== undefined)
            this.y = point.y;
        return this;
    }
    offsetBy(point?: ReadonlyPointType, sign?: number) {
        this.x = this.x + (sign || 1) * (point?.x ?? 0);
        this.y = this.y + (sign || 1) * (point?.y ?? 0);
        return this;
    }
    positive() {
        if(this.x < 0)
            this.x = 0;
        if(this.y < 0)
            this.y = 0;
        return this;
    }
}

//aligned to upper-left, as in html
export class Rect extends Point implements RectType {
    width = 0;
    height = 0;

    constructor(rect?: ReadonlyRectType) {
        super();
        this.assignRect(rect);
    }

    get x1() { return this.x + this.width; }
    get y1() { return this.y + this.height; }

    assignSize(size?: ReadonlySizeType) {
        if(size?.width !== undefined)
            this.width = size.width;
        if(size?.height !== undefined)
            this.height = size.height;
        return this;
    }
    assignRect(rect?: ReadonlyRectType) {
        this.assignPoint(rect);
        this.assignSize(rect);
        return this;
    }
    isPointInRect(point: ReadonlyPointType) {
        return (point.x >= this.x) && (point.y >= this.y)
            && (point.x <= this.x1) && (point.y <= this.y1);
    }
}

export * from './drop-helper';
