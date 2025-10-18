import type { ActionIconProps } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import type { IconProps } from '@phosphor-icons/react';
import type { HTMLAttributes, ReactElement } from 'react';
import { cloneElement } from 'react';

type Props = {
    icon: ReactElement<IconProps>;
} & HTMLAttributes<HTMLElement> &
    Omit<ActionIconProps, 'children'>;

export default function ActionButton({ icon, ...props }: Props) {
    const clonedIcon = cloneElement(icon, {
        size: '80%',
    });

    return (
        <ActionIcon size='md' variant='outline' {...props}>
            {clonedIcon}
        </ActionIcon>
    );
}
