import type { FilterStoreBase } from '#core/stores/FilterStoreBase';
import FilterStoreContextProvider from '#core/stores/FilterStoreContextProvider';
import type { BaseProps } from '#core/types/props';

type Props = {
    store?: FilterStoreBase;
} & BaseProps;

export default function InternalStoresInitializer({ children, store }: Props) {
    return <FilterStoreContextProvider store={store}>{children}</FilterStoreContextProvider>;
}
