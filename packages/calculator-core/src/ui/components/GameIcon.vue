<script setup lang="ts">
import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { PhWarning as WarningIcon } from '@phosphor-icons/vue';
import { computed } from 'vue';

import type { GameItemImageJson } from '#core/game/parser/index.js';
import { useGameDataBase } from '#core/game/parser/index.js';

const { image } = defineProps<{
    image: GameItemImageJson | undefined;
}>();

const gameData = useGameDataBase();

const backgroundPosition = computed(() => {
    if (!image) return undefined;
    const imageSize = gameData.description.imageSize;
    return `${(-image[0] * imageSize).toFixed(0)}px ${(-image[1] * imageSize).toFixed(0)}px`;
});
</script>

<template>
    <div
        v-if="backgroundPosition"
        :class="
            css({
                backgroundImage: 'var(--game-icon-path)',
                backgroundRepeat: 'no-repeat',
                width: 'var(--game-icon-size)',
                height: 'var(--game-icon-size)',
            })
        "
        :style="{ backgroundPosition }"
    />
    <WarningIcon
        v-else
        :class="
            css({
                width: 'var(--game-icon-size)',
                height: 'var(--game-icon-size)',
            })
        "
    />
</template>
