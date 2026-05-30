import { CheckCircleIcon, QuestionMarkIcon, XCircleIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { EdgeStatus } from '#core/game/model/index.js';

type Props = {
    status: EdgeStatus;
};

const statusConfig: Partial<Record<EdgeStatus, { color: string; icon: typeof CheckCircleIcon; label: string }>> = {
    [EdgeStatus.ClickTarget]: {
        icon: CheckCircleIcon,
        color: 'var(--mantine-color-green-filled)',
        label: 'connectable',
    },
    [EdgeStatus.ClickSource]: {
        icon: QuestionMarkIcon,
        color: 'var(--mantine-color-yellow-filled)',
        label: 'needs-recipe-switch',
    },
    [EdgeStatus.ImpossibleDragTarget]: {
        icon: XCircleIcon,
        color: 'var(--mantine-color-red-filled)',
        label: 'cannot-connect',
    },
    [EdgeStatus.DragSource]: { icon: CheckCircleIcon, color: 'transparent', label: 'none' },
};

const ConnectionMarker = observer(({ status }: Props) => {
    if (status === EdgeStatus.None) {
        return null;
    }

    const config = statusConfig[status];
    const Icon = config?.icon;

    return Icon ? <Icon color={config?.color} size='var(--game-icon-size)' weight='fill' /> : null;
});

export default ConnectionMarker;
