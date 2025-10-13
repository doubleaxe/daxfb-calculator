import { GameItemFlagsBase } from '#daxfb-shared/types/gamedata/common';

import type { GameItemBase } from './ParsedGameData';

export function isAbstractClassItem(item: GameItemBase | undefined) {
    return !!((item?.flags ?? 0) & GameItemFlagsBase.AbstractTypePlaceholderItem);
}
