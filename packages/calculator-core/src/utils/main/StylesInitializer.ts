import { onMounted, onUnmounted } from 'vue';

import type { GameDataBase } from '#core/game/parser/index.js';

type Props = {
    gameData: GameDataBase;
    iconsPath: string;
};

export default function useStylesInitializer({ gameData, iconsPath }: Props) {
    let style: HTMLStyleElement | undefined;

    onMounted(() => {
        const imageSize = gameData.description.imageSize;
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = `:root {
--game-icon-path: url(${iconsPath});
--game-icon-size: ${imageSize}px;
--game-icon-size-half: ${imageSize >> 1}px;
--game-icon-size-quarter: ${imageSize >> 2}px;
}`;
        document.head.appendChild(style);
    });

    onUnmounted(() => {
        if (style) document.head.removeChild(style);
    });
}
