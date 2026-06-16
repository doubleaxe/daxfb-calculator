import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { ArrowFatLinesDownIcon, ArrowFatLinesUpIcon, type Icon, XIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { EdgeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';
import { StatusIconColor } from '#core/styles/StatusIcons.js';

type Props = {
    status: EdgeStatus;
};

const statusConfig: Partial<Record<EdgeStatus, { color: string; icon: Icon }>> = {
    [EdgeStatus.Source]: {
        icon: ArrowFatLinesUpIcon,
        color: StatusIconColor({ color: EdgeStatus.Source }),
    },
    [EdgeStatus.Target]: {
        icon: ArrowFatLinesDownIcon,
        color: StatusIconColor({ color: EdgeStatus.Target }),
    },
    [EdgeStatus.ConnectedTarget]: {
        icon: XIcon,
        color: StatusIconColor({ color: EdgeStatus.ConnectedTarget }),
    },
};

const ConnectionMarker = observer(({ status }: Props) => {
    if (status === EdgeStatus.None) {
        return null;
    }

    const config = statusConfig[status];
    const Icon = config?.icon;
    return config && Icon ? <Icon className={cx(css(actionIconIndicatorStyle), config.color)} weight='bold' /> : null;
});

export default ConnectionMarker;
