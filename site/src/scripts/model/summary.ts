/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {GameItemType} from '#types/constants';
import type {GameItem} from '#types/game-data';
import type {BlueprintModel} from './store';

export enum SummaryType {
    Input = 1,
    Output,
    Cost,
}

export type SummaryItem = {
    item: GameItem;
    totalCountPerSecond: number;
};

export type SummaryTotal = {
    items: SummaryItem[];
    type: GameItemType;
    sampleItem: GameItem;
    totalCountPerSecond: number;
};

export type SummaryIoTotal = {
    summaryType: SummaryType;
    totals: SummaryTotal[];
};

export type SummaryTotals = SummaryIoTotal[];

type SummaryItemMap = Map<string, SummaryItem>;
type SummaryTempMap = Map<GameItemType, SummaryItemMap>;

export function calculateSummary(model: BlueprintModel) {
    const gameData = model.gameData;
    const inputByType: SummaryTempMap = new Map();
    const outputByType: SummaryTempMap = new Map();
    const costByItem: SummaryItemMap = new Map();
    for(const blueprintItem of model.items) {
        for(const io of blueprintItem.selectedRecipe?.items || []) {
            if(io.linksCount) {
                //summary only takes open ends into account
                continue;
            }
            if(io.isAbstractClassItem && !io.isMatherialized) {
                //summary only takes real items
                continue;
            }
            const cpsTotal = io.cpsSolvedTotal;
            if(!cpsTotal) {
                continue;
            }
            const ioByType = io.isInput ? inputByType : outputByType;
            const ioType = io.type ?? GameItemType.Unknown;
            let ioByItem = ioByType.get(ioType);
            if(!ioByItem) {
                ioByItem = new Map();
                ioByType.set(ioType, ioByItem);
            }

            let summary = ioByItem.get(io.name || '');
            if(io.name && !summary) {
                const item = gameData.getGameItem(io.name);
                if(item) {
                    summary = {
                        item,
                        totalCountPerSecond: 0,
                    };
                    ioByItem.set(io.name, summary);
                }
            }
            if(summary) {
                summary.totalCountPerSecond += cpsTotal;
            }
        }

        if(blueprintItem.cost) {
            for(const cost of blueprintItem.cost) {
                let summary = costByItem.get(cost.name);
                if(!summary) {
                    const item = gameData.getGameItem(cost.name);
                    if(item) {
                        summary = {
                            item,
                            totalCountPerSecond: 0,
                        };
                        costByItem.set(cost.name, summary);
                    }
                }
                if(summary) {
                    summary.totalCountPerSecond += cost.count;
                }
            }
        }
    }

    const costByType: SummaryTempMap = new Map(costByItem.size ? [[GameItemType.Unknown, costByItem]] : []);

    //sorted map
    const summaryResult: SummaryTotals = [];
    for(const {io: ioByType, summaryType} of [
        {io: inputByType, summaryType: SummaryType.Input},
        {io: outputByType, summaryType: SummaryType.Output},
        {io: costByType, summaryType: SummaryType.Cost},
    ]) {
        if(!ioByType.size) {
            continue;
        }

        const totals: SummaryTotal[] = [];
        for(const [ioType, ioByItem] of ioByType) {
            const items: SummaryItem[] = [];
            let sampleItem: GameItem | undefined;
            let totalCountPerSecond = 0;
            for(const summary of ioByItem.values()) {
                items.push(summary);
                if(sampleItem === undefined) {
                    sampleItem = summary.item;
                }
                totalCountPerSecond += summary.totalCountPerSecond;
            }
            if(!items.length || (sampleItem === undefined)) {
                continue;
            }
            items.sort((a, b) => a.item.order - b.item.order);
            totals.push({
                items,
                type: ioType,
                sampleItem,
                totalCountPerSecond,
            });
        }

        //from energy to unknown
        totals.sort((a, b) => b.type - a.type);

        summaryResult.push({
            summaryType,
            totals,
        });
    }
    return summaryResult;
}
