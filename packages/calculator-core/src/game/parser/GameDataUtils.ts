import { GameItemFlagsBase } from '@daxfb/shared/types/gamedata/common.js';

import type { GameItemBase } from './ParsedGameData.js';

export function isAbstractClassItem(item: GameItemBase | undefined) {
    return !!((item?.flags ?? 0) & GameItemFlagsBase.AbstractTypePlaceholderItem);
}
