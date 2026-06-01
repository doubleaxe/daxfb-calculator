import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { Icon } from '@phosphor-icons/react';
import { QuestionMarkIcon, WrenchIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { NodeStatus } from '#core/game/model/index.js';
import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';
import GameIcon from '#core/ui/components/GameIcon.jsx';

type StatusConfig = { color: string; icon: Icon };
type FactoryConnectionMarkerProps = {
    config: StatusConfig | undefined;
};

const statusConfig: Partial<Record<NodeStatus, StatusConfig>> = {
    [NodeStatus.PossibleClickTarget]: {
        icon: QuestionMarkIcon,
        color: 'var(--mantine-color-yellow-filled)',
    },
};

function FactoryConnectionMarker({ config }: FactoryConnectionMarkerProps) {
    const Icon = config?.icon;

    if (!Icon)
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
            className={css({
                position: 'absolute',
                top: '0px',
                left: '0px',
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
}

const FactoryMainButton = observer(({ data }: FactoryNodeProps) => {
    const config = statusConfig[data.status];

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
            <FactoryConnectionMarker config={config} />
        </button>
    );
});

export default FactoryMainButton;
