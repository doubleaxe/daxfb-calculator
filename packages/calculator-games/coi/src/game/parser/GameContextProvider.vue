<script setup lang="ts">
import { useProvideGameDataBase } from '@doubleaxe/daxfb-calculator-core/game/parser';

import { GameDataCoiImpl } from './ParsedGameData.js';

const [{ gameDataJson }, { localeJson }] = await Promise.all([
    import('@doubleaxe/daxfb-gamedata-generated/coi'),
    import('@doubleaxe/daxfb-gamedata-generated/coi/locales/en'),
]);

gameDataJson.locale = localeJson;
useProvideGameDataBase(new GameDataCoiImpl(gameDataJson));
</script>

<template>
    <slot />
</template>
