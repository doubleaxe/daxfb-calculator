/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
//overall javascript-lp-solver.d.ts is full of any and other dirty stuff
//we import Model alone
//it doesn't have ts exports, so we need to make ourselves
declare module '@ellbur/javascript-lp-solver/src/Model' {
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

    class Model {
        constructor(precision: number, name?: string);
        minimize(): Model;
        maximize(): Model;
        addVariable(cost: number, id: string, isInteger?: boolean, isUnrestricted?: boolean, priority?: number | string): Variable;
        solve(): Solution;
        smallerThan(rhs: number): Constraint;
        greaterThan(rhs: number): Constraint;
        equal(rhs: number): Constraint;
    }

    export = Model;
}
