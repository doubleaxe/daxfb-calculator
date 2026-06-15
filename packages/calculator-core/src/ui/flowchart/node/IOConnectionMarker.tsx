import { css, cva, cx, type RecipeVariant } from '@doubleaxe/daxfb-calculator-styles/css';
import { ArrowFatLinesDownIcon, ArrowFatLinesUpIcon, type Icon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { EdgeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';

type Props = {
    status: EdgeStatus;
};

const iconColor = cva({
    variants: {
        color: {
            Source: {
                _light: {
                    fill: 'var(--mantine-color-indigo-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-indigo-3)',
                },
            },
            Target: {
                _light: {
                    fill: 'var(--mantine-color-green-6)',
                },
                _dark: {
                    fill: 'var(--mantine-color-green-3)',
                },
            },
        },
    },
});

export type IconColorVariants = RecipeVariant<typeof iconColor>['color'];

const statusConfig: Partial<Record<EdgeStatus, { icon: Icon }>> = {
    [EdgeStatus.Source]: {
        icon: ArrowFatLinesUpIcon,
    },
    [EdgeStatus.Target]: {
        icon: ArrowFatLinesDownIcon,
    },
};

const ConnectionMarker = observer(({ status }: Props) => {
    if (status === EdgeStatus.None) {
        return null;
    }

    const config = statusConfig[status];
    const Icon = config?.icon;
    const color = iconColor({ color: status as IconColorVariants });

    return Icon ? <Icon className={cx(css(actionIconIndicatorStyle), color)} weight='bold' /> : null;
});

export default ConnectionMarker;
