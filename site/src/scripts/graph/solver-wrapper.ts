// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as AnyModel from 'javascript-lp-solver/src/Model';
//side effects
import 'javascript-lp-solver/src/Tableau';

export interface Variable {
    id: string;
    cost: number;
    index: number;
    value: number;
    priority: number;
    isInteger?: boolean;
}

export interface Constraint {
    index: number;
    addTerm(coefficient: number, variable: Variable): Constraint;
    relax(weight: number, priority: number): void;
}

export interface Solution {
    feasible: boolean;
    evaluation: number;
    bounded: boolean;
}

//it doesn't have ts exports, so we need to make ourselves
export interface Model {
    minimize(): Model;
    maximize(): Model;
    addVariable(cost: number, id: string, isInteger?: boolean, isUnrestricted?: boolean, priority?: number | string): Variable;
    solve(): Solution;
    smallerThan(rhs: number): Constraint;
    greaterThan(rhs: number): Constraint;
    equal(rhs: number): Constraint;
}


export function newModel(precision?: number): Model {
    return new AnyModel(precision);
}
