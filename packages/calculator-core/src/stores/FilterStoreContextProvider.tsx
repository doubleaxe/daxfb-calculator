import { useGameDataBase } from '#core/game/parser';
import type { BaseProps } from '#core/types/props';
import { useInitRef } from '#core/utils/hooks';

import type { FilterStoreBase } from './FilterStoreBase';
import { FilterStoreBaseImpl, FilterStoreContext } from './FilterStoreBase';

type Props = {
    store?: FilterStoreBase;
} & BaseProps;

export default function FilterStoreContextProvider({ children, store }: Props) {
    const gameData = useGameDataBase();
    const filterState = useInitRef(() => store ?? new FilterStoreBaseImpl(gameData));
    return <FilterStoreContext value={filterState}>{children}</FilterStoreContext>;
}
