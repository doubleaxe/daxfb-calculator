import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import type { NodeProps } from '@xyflow/react';
import { NodeToolbar, useUpdateNodeInternals } from '@xyflow/react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

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
                className={css({
                    cursor: 'auto',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '2px solid',
                    borderRadius: 'var(--mantine-radius-sm)',
                    userSelect: 'none',
                    touchAction: 'none',
                    _light: {
                        borderColor: 'var(--mantine-color-gray-5)',
                        background:
                            'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-gray-3) 100%)',
                    },
                    _dark: {
                        borderColor: 'var(--mantine-color-gray-6)',
                        background:
                            'linear-gradient(135deg, var(--mantine-color-gray-9) 0%, var(--mantine-color-gray-7) 100%)',
                    },
                })}
                data-dragging={props.dragging || undefined}
            >
                <TitleRow data={data} />
                <FactorySurface data={data} />
            </div>
        </>
    );
});

export default FactoryNode;
