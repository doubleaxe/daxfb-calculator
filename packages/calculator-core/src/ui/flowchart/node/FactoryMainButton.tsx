import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { Icon } from '@phosphor-icons/react';
import { ArrowFatLinesDownIcon, WrenchIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { NodeStatus } from '#core/game/model/index.js';
import { actionIconIndicatorStyle } from '#core/styles/ActionIconIndicator.js';
import { StatusIconColor } from '#core/styles/StatusIcons.js';
import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import GameIcon from '#core/ui/components/GameIcon.jsx';

type FactoryConnectionMarkerProps = {
    status: NodeStatus;
};

const statusConfig: Partial<Record<NodeStatus, { color: string; icon: Icon }>> = {
    [NodeStatus.PossibleTarget]: {
        icon: ArrowFatLinesDownIcon,
        color: StatusIconColor({ color: NodeStatus.PossibleTarget }),
    },
};

function FactoryConnectionMarker({ status }: FactoryConnectionMarkerProps) {
    const config = statusConfig[status];
    const Icon = config?.icon;

    if (!Icon || !config)
        return (
            <div
                className={css({
                    display: 'none',
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: 'var(--action-icon-size)',
                    height: 'var(--action-icon-size)',
                    color: 'var(--mantine-color-bright)',
                    border: '1px solid var(--mantine-color-bright)',
                    _light: {
                        backgroundColor: 'rgb(var(--mantine-color-rgb-blue-1) / 0.7)',
                    },
                    _dark: {
                        backgroundColor: 'rgb(var(--mantine-color-rgb-blue-9) / 0.7)',
                    },
                    _groupHover: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                })}
            >
                <WrenchIcon size='100%' />
            </div>
        );

    return Icon ? (
        <Icon
            className={cx(
                css({
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    background: 'var(--mantine-color-body)',
                    opacity: 0.5,
                }),
                css(actionIconIndicatorStyle),
                config?.color
            )}
            weight='bold'
        />
    ) : null;
}

const FactoryMainButton = observer(({ data }: FactoryNodeProps) => {
    return (
        <button
            className={cx(
                'group',
                css({
                    position: 'relative',
                    padding: 'var(--central-padding)',
                    width: 'var(--game-icon-size)',
                    height: 'var(--game-icon-size)',
                    border: 'var(--central-border) solid',
                    borderColor: 'var(--mantine-color-blue-filled)',
                    boxSizing: 'content-box',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    _hover: {
                        transform: 'scale(1.1)',
                    },
                    _light: {
                        backgroundColor: 'var(--mantine-color-gray-1)',
                    },
                    _dark: {
                        backgroundColor: 'var(--mantine-color-dark-7)',
                    },
                })
            )}
            type='button'
        >
            <GameIcon image={data.image} />
            <FactoryConnectionMarker status={data.status} />
        </button>
    );
});

export default FactoryMainButton;
