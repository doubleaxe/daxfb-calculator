import { css, cx } from '@doubleaxe/daxfb-calculator-styles/css';
import { WarningIcon } from '@phosphor-icons/react';

import { useGameDataBase } from '#core/game/parser';
import type { GameItemImageJson } from '#daxfb-shared/types/gamedata/common';

type Props = {
    className?: string;
    image?: GameItemImageJson;
};

export default function GameIcon({ image, className }: Props) {
    const gameData = useGameDataBase();
    const imageSize = gameData.description.imageSize;
    const location = image
        ? `${(-image[0] * imageSize).toFixed(0)}px ${(-image[1] * imageSize).toFixed(0)}px`
        : undefined;

    if (!location)
        return (
            <WarningIcon
                className={cx(
                    css({
                        width: 'var(--game-icon-size)',
                        height: 'var(--game-icon-size)',
                    }),
                    className
                )}
            />
        );

    return (
        <div
            className={cx(
                css({
                    backgroundImage: 'var(--game-icon-path)',
                    backgroundRepeat: 'no-repeat',
                    width: 'var(--game-icon-size)',
                    height: 'var(--game-icon-size)',
                }),
                className
            )}
            style={{ backgroundPosition: location }}
        />
    );
}
