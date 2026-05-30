import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { NodeProps } from '@xyflow/react';
import { NodeToolbar, useUpdateNodeInternals } from '@xyflow/react';
import { computed, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useFlowChartModelBase } from '#core/game/model/index.js';
import { draggableSelectableStyles } from '#core/styles/DraggableSelectable.js';
import { draggingStyle } from '#core/styles/Dragging.js';
import type { FactoryNodeType } from '#core/types/flowchart/node/types.js';
import { useReaction } from '#core/utils/hooks.js';

import FactorySurface from './FactorySurface.jsx';
import TitleRow from './TitleRow.jsx';

const FactoryNode = observer((props: NodeProps<FactoryNodeType>) => {
    const flowChartModel = useFlowChartModelBase();
    const data = computed(() => flowChartModel.itemByKey(props.id)).get();
    if (!data) {
        return null;
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
