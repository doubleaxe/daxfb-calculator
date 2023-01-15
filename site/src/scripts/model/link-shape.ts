import {Point, Rect} from '../geometry';
import type {LinkShapeModel, PublicPoint, PublicRect} from './store';
import {link, curveBumpX, line, curveBasis} from 'd3-shape';

const svgLinkBuilderStraight = link(curveBumpX);
const svgLinkBuilderCurved = line().curve(curveBasis);

export class LinkShape {
    public readonly svgLink;
    public readonly middlePoint;

    constructor(svgLink: string, middlePoint: PublicPoint) {
        this.svgLink = svgLink;
        this.middlePoint = middlePoint;
    }
}

export class LinkShapeModelImpl {
    public readonly input;
    public readonly output;
    public readonly flipped;
    private _shape?: LinkShape;

    constructor(input?: PublicRect, output?: PublicRect, flipped?: boolean) {
        this.input = input || Rect.assign();
        this.output = output || Rect.assign();
        this.flipped = flipped || false;
    }

    isEqual(shape: LinkShapeModel) {
        return this.input.isEqual(shape.input)
            && this.output.isEqual(shape.output)
            && (this.flipped === shape.flipped);
    }

    buildShape(): LinkShape {
        if(this._shape)
            return this._shape;

        const sourcePoint = LinkShapeModelImpl.calculateLinkOrigin(this.output, false);
        const targetPoint = LinkShapeModelImpl.calculateLinkOrigin(this.input, true);

        const breakingWidth = this.curveBreakingWidth();
        //important, that link will run through middle point, even if curved
        //so link connector will use the same algorithm for both
        const middlePoint = sourcePoint.middlePoint(targetPoint);

        if((targetPoint.x - sourcePoint.x) > breakingWidth) {
            const svgLink = svgLinkBuilderStraight({
                source: [sourcePoint?.x || 0, sourcePoint?.y || 0],
                target: [targetPoint?.x || 0, targetPoint?.y || 0],
            });
            this._shape = new LinkShape(svgLink || '', middlePoint);
            return this._shape;
        }

        const sourcePoint2 = sourcePoint.offsetBy({x: breakingWidth, y: 0});
        const targetPoint2 = targetPoint.offsetBy({x: -breakingWidth, y: 0});

        //build a square path then make curve for two segments
        const svgLink1 = svgLinkBuilderCurved([
            [sourcePoint.x, sourcePoint.y],
            [sourcePoint2.x, sourcePoint2.y],
            [sourcePoint2.x, middlePoint.y],
            [middlePoint.x, middlePoint.y],
        ]);
        const svgLink2 = svgLinkBuilderCurved([
            [middlePoint.x, middlePoint.y],
            [targetPoint2.x, middlePoint.y],
            [targetPoint2.x, targetPoint2.y],
            [targetPoint.x, targetPoint.y],
        ]);
        this._shape = new LinkShape((svgLink1 || '') + (svgLink2 || ''), middlePoint);
        return this._shape;
    }

    private static calculateLinkOrigin(rect: PublicRect, isInput: boolean): PublicPoint {
        if(isInput) {
            return Point.assign({
                x: rect.x,
                y: rect.y + (rect.height / 2)
            });
        }
        return Point.assign({
            x: rect.x + rect.width,
            y: rect.y + (rect.height / 2)
        });
    }
    private curveBreakingWidth() {
        const maxHeight = Math.max(this.input.height, this.output.height);
        return maxHeight * 2;
    }
}
