import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { ActionIcon } from '@mantine/core';
import { ListIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import type { FactoryNodeProps } from './types';

const TitleRow = observer(({ data }: FactoryNodeProps) => {
    return (
        <div
            className={css({
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                fontSize: 'var(--mantine-font-size-sm)',
                lineHeight: 'var(--mantine-line-height-sm)',
                height: '1.55em',
                backgroundColor: 'var(--mantine-primary-color-light)',
                _hover: {
                    backgroundColor: 'var(--mantine-primary-color-light-hover)',
                },
            })}
        >
            <div
                className={css({
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    paddingLeft: '0.25em',
                    userSelect: 'none',
                })}
            >
                {data.label}
            </div>
            <div className={css({ float: 'right', marginRight: '0.25em' })}>
                <ActionIcon aria-label='Menu' size='sm' variant='filled'>
                    <ListIcon />
                </ActionIcon>
            </div>
        </div>
    );
});

export default TitleRow;
