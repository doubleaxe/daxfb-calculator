import { hstack, vstack } from '@doubleaxe/daxfb-calculator-styles/patterns';

import type { BaseProps } from '#core/types/props.js';
import { assignDisplayName, extractComponentsForCompoundParent } from '#core/utils/tsxhelpers.js';

function FilterPanel({ children }: BaseProps) {
    return children;
}
assignDisplayName(FilterPanel, 'FilterPanel');
function ItemList({ children }: BaseProps) {
    return children;
}
assignDisplayName(ItemList, 'ItemList');

function FactoryPalette({ children }: BaseProps) {
    const [filterPanel, itemList] = extractComponentsForCompoundParent(children, ['FilterPanel', 'ItemList']);

    return (
        <div className={vstack({})}>
            <div
                className={hstack({
                    flex: 'none',
                    alignSelf: 'center',
                })}
            >
                {filterPanel}
            </div>
            <div
                className={hstack({
                    flexGrow: 1,
                    alignSelf: 'start',
                })}
            >
                {itemList}
            </div>
        </div>
    );
}

FactoryPalette.FilterPanel = FilterPanel;
FactoryPalette.ItemList = ItemList;

export default FactoryPalette;
