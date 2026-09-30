<script setup lang="ts">
import { useProvideGameDataBase } from '@doubleaxe/daxfb-calculator-core/game/parser/index.js';

import { GameDataCoiImpl } from '#game-ui-coi/game/parser/ParsedGameData.js';
import PageInitializer from '#game-ui-coi/ui/PageInitializer.vue';

const [{ gameDataJson }, { localeJson }] = await Promise.all([
    import('@doubleaxe/daxfb-gamedata-generated/coi.js'),
    import('@doubleaxe/daxfb-gamedata-generated/coi/locales/en.js'),
]);

gameDataJson.locale = localeJson;
useProvideGameDataBase(new GameDataCoiImpl(gameDataJson));
</script>

<template>
    <PageInitializer />
</template>
