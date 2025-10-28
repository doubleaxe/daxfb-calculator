import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { Flex } from '@mantine/core';
import { Handle, Position } from '@xyflow/react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import type { RecipeIOModelBase } from '#core/game/model';
import GameIcon from '#core/ui/components/GameIcon.js';

type Props = {
    io: RecipeIOModelBase;
};

const IOConnectionPoint = observer(({ io }: Props) => {
    const edgePosition = computed(() => {
        const isLeft = io.isFlipped ? !io.isInput : io.isInput;
        return isLeft ? Position.Left : Position.Right;
    }).get();

    return (
        <div className={css({ position: 'relative' })}>
            <GameIcon image={io.image} />
            <Handle
                id={io.itemId}
                isConnectableEnd
                isConnectableStart
                position={edgePosition}
                type={io.isInput ? 'target' : 'source'}
            />
        </div>
    );
});

const FactoryIO = observer(({ io }: Props) => {
    const isLtr = computed(() => (io.isFlipped ? !io.isInput : io.isInput)).get();
    return (
        <Flex align='center' direction={isLtr ? 'row' : 'row-reverse'}>
            <IOConnectionPoint io={io} />
            <div
                className={css({
                    paddingLeft: '0.25em',
                    paddingRight: '0.25em',
                    flex: 1,
                    textAlign: isLtr ? 'left' : 'right',
                })}
            >
                {io.label}
            </div>
        </Flex>
    );
});

export default FactoryIO;
