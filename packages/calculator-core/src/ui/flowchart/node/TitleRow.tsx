import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { ActionIcon } from '@mantine/core';
import { ListIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import type { FactoryNodeProps } from './types';
import { NodeDragHandleClass } from './types';

const TitleRow = observer(({ data, dragging }: { dragging?: boolean } & FactoryNodeProps) => {
    return (
        <div
            className={cx(
                hstack({ gap: '0.25em', paddingLeft: '0.25em', paddingRight: '0.25em' }),
                css({
                    'fontSize': 'var(--mantine-font-size-sm)',
                    'lineHeight': 'var(--mantine-line-height-sm)',
                    'height': '1.55em',
                    'color': 'var(--mantine-primary-color-contrast)',
                    '_light': {
                        background:
                            'linear-gradient(135deg, var(--mantine-color-blue-7) 0%, var(--mantine-color-blue-9) 100%)',
                    },
                    '_dark': {
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    },
                    '&:has([data-hoverable]:hover)': {
                        _light: {
                            background:
                                'linear-gradient(135deg, var(--mantine-color-blue-5) 0%, var(--mantine-color-blue-7) 100%)',
                        },
                        _dark: {
                            background:
                                'linear-gradient(135deg, var(--mantine-color-indigo-8) 0%, var(--mantine-color-indigo-9) 100%)',
                        },
                    },
                })
            )}
        >
            <div
                className={cx(
                    css({
                        'cursor': 'grab',
                        'flex': 1,
                        'minWidth': 0,
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'whiteSpace': 'nowrap',
                        'userSelect': 'none',
                        '&[data-dragging]': {
                            cursor: 'grabbing!',
                        },
                    }),
                    NodeDragHandleClass
                )}
                data-dragging={dragging ? 'true' : undefined}
                data-hoverable
            >
                {data.label}
            </div>
            <div className={css({ flex: 'none', whiteSpace: 'nowrap' })}>
                <ActionIcon aria-label='Menu' size='sm' variant='filled'>
                    <ListIcon />
                </ActionIcon>
            </div>
        </div>
    );
});

export default TitleRow;
