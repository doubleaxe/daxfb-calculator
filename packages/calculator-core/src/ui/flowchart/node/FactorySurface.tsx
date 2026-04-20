import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';

import FactoryIO from './FactoryIO.jsx';
import MainIconActions from './MainIconActions.jsx';

const FactorySurface = observer(({ data }: FactoryNodeProps) => {
    const isFat = computed(() => {
        const recipe = data.selectedRecipe;
        return (recipe?.visibleInput?.length ?? 0) > 1 || (recipe?.visibleOutput?.length ?? 0) > 1;
    }).get();
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
        <div className={hstack({ alignItems: isFat ? 'start' : 'center' })}>
            <div>
                {leftSide.map((io) => (
                    <FactoryIO io={io} key={io.itemId} />
                ))}
            </div>
            <div className={css({ alignSelf: 'center' })}>
                <MainIconActions data={data} />
            </div>
            <div>
                {rightSide.map((io) => (
                    <FactoryIO io={io} key={io.itemId} />
                ))}
            </div>
        </div>
    );
});

export default FactorySurface;
