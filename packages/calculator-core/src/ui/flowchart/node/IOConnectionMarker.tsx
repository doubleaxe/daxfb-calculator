import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { ArrowFatLinesDownIcon, ArrowFatLinesUpIcon, type Icon, XCircleIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { EdgeStatus } from '#core/game/model/index.js';

type Props = {
    status: EdgeStatus;
};

const statusConfig: Partial<Record<EdgeStatus, { color: string; icon: Icon }>> = {
    [EdgeStatus.ClickSource]: {
        icon: ArrowFatLinesUpIcon,
        color: 'var(--mantine-color-indigo-filled)',
    },
    [EdgeStatus.ClickTarget]: {
        icon: ArrowFatLinesDownIcon,
        color: 'var(--mantine-color-green-filled)',
    },
    [EdgeStatus.ImpossibleDragTarget]: {
        icon: XCircleIcon,
        color: 'var(--mantine-color-red-filled)',
    },
};

const ConnectionMarker = observer(({ status }: Props) => {
    if (status === EdgeStatus.None) {
        return null;
    }

    const config = statusConfig[status];
    const Icon = config?.icon;

    return Icon ? (
        <Icon
            className={css({
                minWidth: 'auto',
                minHeight: 'auto',
                width: '100%',
                height: '100%',
                background: 'var(--mantine-color-body)',
                opacity: 0.5,
            })}
            color={config?.color}
            weight='bold'
        />
    ) : null;
});

export default ConnectionMarker;
