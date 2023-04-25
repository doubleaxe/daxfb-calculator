/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

//this will perform correct setup on Tableau prototype
import '@ellbur/javascript-lp-solver/src/Tableau/index';

//original code is https://github.com/JWally/jsLPSolver
//it is old, dependent on native node 'fs' module, and cannot be imported as web module
//we use port someone made, which uses 'import' instead of 'require', and they published this port to npm registry
//see https://github.com/ellbur/jsLPSolver

//upper case letter in Model!!! otherwise unix systems will not build
import Model from '@ellbur/javascript-lp-solver/src/Model';
import type {Variable} from '@ellbur/javascript-lp-solver/src/Model';

export {Model};
export type {Variable};
