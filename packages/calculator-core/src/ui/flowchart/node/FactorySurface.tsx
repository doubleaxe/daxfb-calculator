import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import FactoryIO from './FactoryIO';
import type { FactoryNodeProps } from './types';

const FactorySurface = observer(({ data }: FactoryNodeProps) => {
    const leftSide = computed(() => {
        const recipe = data.selectedRecipe;
        const io = (data.isFlipped ? recipe?.visibleOutput : recipe?.visibleInput) ?? [];
        return io;
    }).get();
    const rightSide = computed(() => {
        const recipe = data.selectedRecipe;
        const io = (data.isFlipped ? recipe?.visibleInput : recipe?.visibleOutput) ?? [];
        return io;
    }).get();
    return (
        <div className={hstack({ alignItems: 'start' })}>
            <div>
                {leftSide.map((io) => (
                    <FactoryIO io={io} key={io.itemId} />
                ))}
            </div>
            <div className={css({ alignSelf: 'center' })}></div>
            <div>
                {rightSide.map((io) => (
                    <FactoryIO io={io} key={io.itemId} />
                ))}
            </div>
        </div>
    );
});

export default FactorySurface;
