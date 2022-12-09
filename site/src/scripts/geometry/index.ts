
export type PointType = {x: number; y: number};
export class Point implements PointType {
    x = 0;
    y = 0;
    constructor(point?: PointType) {
        this.assign(point);
    }
    assign(point?: PointType) {
        if(!point)
            return;
        this.x = point.x;
        this.y = point.y;
    }
    offsetTo(point?: PointType, sign?: number) {
        if(!point)
            return this;
        this.x = this.x + (sign || 1) * point.x;
        this.y = this.y + (sign || 1) * point.y;
        return this;
    }
}

//aligned to upper-left, as in html
export type RectType = PointType & {width: number; height: number};
export class Rect extends Point implements RectType {
    width = 0;
    height = 0;

    constructor(rect?: RectType) {
        super();
        this.assign(rect);
    }

    get x1() { return this.x + this.width; }
    get y1() { return this.y + this.height; }

    assign(rect?: RectType) {
        if(!rect)
            return;
        super.assign(rect);
        this.width = rect.width;
        this.height = rect.height;
    }
    isPointInRect(point: PointType) {
        return (point.x >= this.x) && (point.y >= this.y)
            && (point.x <= this.x1) && (point.y <= this.y1);
    }
}

export * from './drop-helper';
