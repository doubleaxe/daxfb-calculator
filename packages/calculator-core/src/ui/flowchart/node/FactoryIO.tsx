import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { stack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { Handle, Position } from '@xyflow/react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import type { RecipeIOModelBase } from '#core/game/model';
import GameIcon from '#core/ui/components/GameIcon.js';
import { draggableSelectableStyles } from '#core/ui/styles/DraggableSelectable';

type Props = {
    io: RecipeIOModelBase;
};

const IOConnectionPoint = observer(({ io }: Props) => {
    const edgePosition = computed(() => {
        const isLeft = io.isFlipped ? !io.isInput : io.isInput;
        return isLeft ? Position.Left : Position.Right;
    }).get();

    return (
        <div
            className={cx(
                css({ position: 'relative', borderRadius: 'var(--mantine-radius-md)', borderColor: 'transparent' }),
                draggableSelectableStyles({ hover: 'cursor', transition: 'lift', select: 'flow' })
            )}
        >
            <GameIcon image={io.image} />
            <Handle
                className={css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    transform: 'none',
                    minWidth: 'auto',
                    minHeight: 'auto',
                    width: '100%',
                    height: '100%',
                    borderRadius: 0,
                    border: '0px transparent',
                    backgroundColor: 'transparent',
                    cursor: 'grab',
                })}
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
        <div className={stack({ alignItems: 'center', direction: isLtr ? 'row' : 'row-reverse' })}>
            <IOConnectionPoint io={io} />
            <div
                className={css({
                    paddingLeft: '0.25em',
                    paddingRight: '0.25em',
                    flex: 1,
                    textAlign: isLtr ? 'left' : 'right',
                    fontSize: 'var(--mantine-font-size-xs)',
                })}
            >
                {io.label}
            </div>
        </div>
    );
});

export default FactoryIO;
