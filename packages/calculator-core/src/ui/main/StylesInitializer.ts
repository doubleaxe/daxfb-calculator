import { useEffect } from 'react';

import type { GameDataBase } from '#core/game/parser';

type Props = {
    gameData: GameDataBase;
    iconsPath: string;
};
export default function useStylesInitializer({ gameData, iconsPath }: Props) {
    useEffect(() => {
        const imageSize = gameData.description.imageSize;
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = `:root {
--game-icon-path: url(${iconsPath});
--game-icon-size: ${imageSize}px;
--xy-edge-stroke-width: ${imageSize >> 1}px;
}`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, [gameData, iconsPath]);
}
