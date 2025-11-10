import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import type { IconProps } from '@phosphor-icons/react';
import { CaretDoubleDownIcon, CaretDoubleUpIcon, MinusIcon, PlusIcon, WrenchIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';
import type { ReactElement } from 'react';

import ActionButton from '#core/ui/components/ActionButton';
import GameIcon from '#core/ui/components/GameIcon';

import type { FactoryNodeProps } from './types';

const cssVars = css({
    '--action-icon-size': '20px',
    '--central-border': '2px',
    '--central-padding': '2px',
});

const cssVarsUpgradable = css({
    '--total-size-y':
        'calc(var(--action-icon-size) * 2 + var(--central-border) * 2 + var(--central-padding) * 2 + var(--game-icon-size))',
    '--total-size-x': 'var(--total-size-y)',
    '--side-offset-y': 'calc(var(--action-icon-size) / 2)',
    '--side-height':
        'calc(var(--action-icon-size) + var(--central-border) + var(--central-padding) + var(--game-icon-size))',
});

const cssVarsNonUpgradable = css({
    '--total-size-y': 'calc(var(--central-border) * 2 + var(--central-padding) * 2 + var(--game-icon-size))',
    '--total-size-x': 'calc(var(--action-icon-size) * 2 + var(--total-size-y))',
    '--side-offset-y': '0px',
    '--side-height': 'var(--total-size-y)',
});

type SideButtonProps = {
    className?: string;
    icon: ReactElement<IconProps>;
};

function SideButton({ icon, className }: SideButtonProps) {
    return (
        <ActionButton
            className={cx(
                css({
                    position: 'absolute',
                    borderRadius: 0,
                    minHeight: 0,
                    minWidth: 0,
                    borderColor: 'var(--mantine-color-blue-filled)',
                }),
                className
            )}
            icon={icon}
            variant='default'
        />
    );
}

const MainIconActions = observer(({ data }: FactoryNodeProps) => {
    return (
        <div
            className={cx(
                cssVars,
                data.upgradable ? cssVarsUpgradable : cssVarsNonUpgradable,
                css({
                    position: 'relative',
                    width: 'var(--total-size-x)',
                    height: 'var(--total-size-y)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                })
            )}
        >
            {data.upgradable ? (
                <>
                    <SideButton
                        className={css({
                            top: '0',
                            left: '0',
                            width: 'var(--total-size-x)',
                            height: 'var(--action-icon-size)',
                        })}
                        icon={<CaretDoubleUpIcon />}
                    />
                    <SideButton
                        className={css({
                            bottom: '0',
                            left: '0',
                            width: 'var(--total-size-x)',
                            height: 'var(--action-icon-size)',
                        })}
                        icon={<CaretDoubleDownIcon />}
                    />
                </>
            ) : null}
            <SideButton
                className={css({
                    left: '0',
                    top: 'var(--side-offset-y)',
                    width: 'var(--action-icon-size)',
                    height: 'var(--side-height)',
                })}
                icon={<MinusIcon />}
            />
            <SideButton
                className={css({
                    right: '0',
                    top: 'var(--side-offset-y)',
                    width: 'var(--action-icon-size)',
                    height: 'var(--side-height)',
                })}
                icon={<PlusIcon />}
            />
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
                            backgroundColor: 'var(--mantine-color-gray-7)',
                        },
                    })
                )}
                type='button'
            >
                <GameIcon image={data.image} />
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
            </button>
        </div>
    );
});

export default MainIconActions;
