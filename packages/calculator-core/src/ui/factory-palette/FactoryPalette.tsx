import { hstack, vstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';

import type { BaseProps } from '#core/types/props';

function FilterPanel({ children }: BaseProps) {
    return children;
}
function ItemList({ children }: BaseProps) {
    return children;
}

function FactoryPalette({ children }: BaseProps) {
    let filterPanel: ReactNode | undefined;
    let itemList: ReactNode | undefined;

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;
        if (child.type === FilterPanel) {
            filterPanel = child;
        } else if (child.type === ItemList) {
            itemList = child;
        }
    });

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
