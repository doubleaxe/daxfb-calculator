/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {BlueprintModel} from '../model/store';
import {autoLayoutGraphDagre, knownLayoutAlgorithmsDagre} from './graph-auto-layout-dagre';
import {autoLayoutGraphElk, knownLayoutAlgorithmsElk} from './graph-auto-layout-elk';

export interface CommonLayoutOptions {
    nodeSpacing?: number;
    connectedNodeSpacing?: number;
    edgeWidth?: number;
    edgeSpacing?: number;
    algorithms?: string;
    customOptions?: {
        [key: string]: unknown;
    };
}

export type AutoLayoutGraph = (blueprint: BlueprintModel, layoutOptions?: CommonLayoutOptions, signal?: AbortSignal) => Promise<void>;

export enum LayoutType {
    DAGRE = 'DAGRE',
    ELK = 'ELK',
}

export function layoutFactory(layoutType: LayoutType): Promise<AutoLayoutGraph> {
    switch(layoutType) {
        case LayoutType.DAGRE:
            return Promise.resolve(autoLayoutGraphDagre);
        case LayoutType.ELK:
            return Promise.resolve(autoLayoutGraphElk);
    }
    return Promise.reject(new Error(`Unknown layout type: ${layoutType}`));
}

export function knownLayoutAlgorithms(layoutType: LayoutType) {
    switch(layoutType) {
        case LayoutType.DAGRE:
            return knownLayoutAlgorithmsDagre();
        case LayoutType.ELK:
            return knownLayoutAlgorithmsElk();
    }
    throw new Error(`Unknown layout type: ${layoutType}`);
}
