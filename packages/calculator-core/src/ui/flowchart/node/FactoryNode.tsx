import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { NodeProps } from '@xyflow/react';
import { NodeToolbar, useUpdateNodeInternals } from '@xyflow/react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { draggableSelectableStyles } from '#core/ui/styles/DraggableSelectable';
import { draggingStyle } from '#core/ui/styles/Dragging';
import { useReaction } from '#core/utils/hooks.js';

import ExampleFlowchart from '../test/deepseek';
import FactorySurface from './FactorySurface';
import TitleRow from './TitleRow';
import type { FactoryNodeType } from './types';

const FactoryNode = observer((props: NodeProps<FactoryNodeType>) => {
    const data = props.data;

    if (data.name === 'CoolingTowerT1') {
        return <ExampleFlowchart />;
    }

    const updateNodeInternals = useUpdateNodeInternals();

    useReaction(
        () =>
            reaction(
                () => data.isFlipped,
                () => {
                    updateNodeInternals(data.itemId);
                },
                { delay: 1 }
            ),
        [data, updateNodeInternals]
    );

    return (
        <>
            <NodeToolbar isVisible={false}>
                <button type='button'>cut</button>
            </NodeToolbar>
            <div
                className={cx(
                    css({
                        cursor: 'auto',
                        borderRadius: 'var(--mantine-radius-sm)',
                        _light: {
                            borderColor: 'var(--mantine-color-gray-5)',
                            background:
                                'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-gray-4) 100%)',
                        },
                        _dark: {
                            borderColor: 'var(--mantine-color-gray-6)',
                            background:
                                'linear-gradient(135deg, var(--mantine-color-gray-9) 0%, var(--mantine-color-gray-7) 100%)',
                        },
                    }),
                    draggableSelectableStyles({ hover: 'child', transition: 'none' }),
                    draggingStyle
                )}
                data-dragging={props.dragging || undefined}
            >
                <TitleRow data={data} dragging={props.dragging} />
                <FactorySurface data={data} />
            </div>
        </>
    );
});

export default FactoryNode;
