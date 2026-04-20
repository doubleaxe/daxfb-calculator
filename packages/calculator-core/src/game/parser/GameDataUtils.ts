import { GameItemFlagsBase } from '@doubleaxe/daxfb-shared/types/gamedata/common';

import type { GameItemBase } from './ParsedGameData.js';

export function isAbstractClassItem(item: GameItemBase | undefined) {
    return !!((item?.flags ?? 0) & GameItemFlagsBase.AbstractTypePlaceholderItem);
}
