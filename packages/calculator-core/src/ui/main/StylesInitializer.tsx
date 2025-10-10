import type { GameDataBase } from '#core/game/parser';
import type { BaseProps } from '#core/types/props';

type Props = {
    gameData: GameDataBase;
    iconsPath: string;
} & BaseProps;

export default function StylesInitializer({ gameData, iconsPath, children }: Props) {
    const imageSize = gameData.description.imageSize;
    const styleVariables = {
        '--game-icon-path': `url(${iconsPath})`,
        '--game-icon-size': `${imageSize}px`,
        '--xy-edge-stroke-width': `${imageSize >> 1}px`,
    } as React.CSSProperties;

    return <div style={styleVariables}>{children}</div>;
}
