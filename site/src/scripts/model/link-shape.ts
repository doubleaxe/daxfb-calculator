/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {Point, Rect} from '../geometry';
import type {PublicPoint, PublicRect} from '../geometry';
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

export class LinkShapeDescriptor {
    public readonly input;
    public readonly output;
    public readonly inputFlipped;
    public readonly outputFlipped;

    constructor(input?: PublicRect, output?: PublicRect, inputFlipped?: boolean, outputFlipped?: boolean) {
        this.input = input || Rect.assign();
        this.output = output || Rect.assign();
        this.inputFlipped = inputFlipped || false;
        this.outputFlipped = outputFlipped || false;
    }

    isEqual(shape: LinkShapeDescriptor) {
        return this.input.isEqual(shape.input)
            && this.output.isEqual(shape.output)
            && (this.inputFlipped === shape.inputFlipped)
            && (this.outputFlipped === shape.outputFlipped);
    }

    toString() {
        return `${this.input.toString()}=>${this.output.toString()}`;
    }
}

export class LinkShapeModel {
    public readonly shape;
    public readonly descriptor;

    constructor(shape: LinkShape, descriptor: LinkShapeDescriptor) {
        this.shape = shape;
        this.descriptor = descriptor;
    }
}

export class LinkShapeModelBuilder {
    private readonly descriptor;

    constructor(descriptor: LinkShapeDescriptor) {
        this.descriptor = descriptor;
    }

    buildShape() {
        return new LinkShapeModel(this._buildShape(), this.descriptor);
    }

    _buildShape(): LinkShape {
        const {
            input,
            output,
            inputFlipped,
            outputFlipped,
        } = this.descriptor;

        const inputPoint = LinkShapeModelBuilder.calculateLinkOrigin(input, !inputFlipped);
        const outputPoint = LinkShapeModelBuilder.calculateLinkOrigin(output, outputFlipped);

        if(inputFlipped == outputFlipped) {
            return this._buildShapeSameDirection(inputPoint, outputPoint, inputFlipped);
        }
        return this._buildShapeMultiDirection(inputPoint, outputPoint, outputFlipped);
    }

    private _buildShapeSameDirection(inputPoint: PublicPoint, outputPoint: PublicPoint, isFlipped: boolean) {
        const breakingWidth = this.curveBreakingWidth();
        const sourcePoint = isFlipped ? inputPoint : outputPoint;
        const targetPoint = isFlipped ? outputPoint : inputPoint;
        const distance = targetPoint.distanceTo(sourcePoint);

        //important, that link will run through middle point, even if curved
        //so link connector will use the same algorithm for both
        const middlePoint = sourcePoint.middlePoint(targetPoint);

        if((distance.x > breakingWidth) || (Math.abs(distance.y) < breakingWidth)) {
            const svgLink = svgLinkBuilderStraight({
                source: [sourcePoint?.x || 0, sourcePoint?.y || 0],
                target: [targetPoint?.x || 0, targetPoint?.y || 0],
            });
            return new LinkShape(svgLink || '', middlePoint);
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
        return new LinkShape((svgLink1 || '') + (svgLink2 || ''), middlePoint);
    }

    private _buildShapeMultiDirection(inputPoint: PublicPoint, outputPoint: PublicPoint, leftSide: boolean) {
        const breakingWidth = this.curveBreakingWidth();
        const offsetMultiplier = leftSide ? -1 : 1;

        const inputPoint2 = inputPoint.offsetBy({x: offsetMultiplier * breakingWidth, y: 0});
        const outputPoint2 = outputPoint.offsetBy({x: offsetMultiplier * breakingWidth, y: 0});
        const offsetMax = leftSide ? Math.min(inputPoint2.x, outputPoint2.x) : Math.max(inputPoint2.x, outputPoint2.x);
        const middlePoint = inputPoint2.middlePoint(outputPoint2).assignPoint({x: offsetMax});

        //build a square path then make curve for two segments
        const svgLink1 = svgLinkBuilderCurved([
            [inputPoint.x, inputPoint.y],
            [offsetMax, inputPoint2.y],
            [offsetMax, middlePoint.y],
            [middlePoint.x, middlePoint.y],
        ]);
        const svgLink2 = svgLinkBuilderCurved([
            [middlePoint.x, middlePoint.y],
            [offsetMax, middlePoint.y],
            [offsetMax, outputPoint2.y],
            [outputPoint.x, outputPoint.y],
        ]);
        return new LinkShape((svgLink1 || '') + (svgLink2 || ''), middlePoint);
    }

    private static calculateLinkOrigin(rect: PublicRect, isLeftSide: boolean): PublicPoint {
        if(isLeftSide) {
            return Point.assign({
                x: rect.x,
                y: rect.y + (rect.height / 2),
            });
        }
        return Point.assign({
            x: rect.x + rect.width,
            y: rect.y + (rect.height / 2),
        });
    }
    private curveBreakingWidth() {
        const {
            input,
            output,
        } = this.descriptor;

        const maxHeight = Math.max(input.height, output.height);
        return maxHeight * 1.2;
    }
}
