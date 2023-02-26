<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {provide, shallowRef} from 'vue';
import {GameDataKey, type GameData} from './scripts/data';

const gameData = shallowRef<GameData | undefined>();
provide(GameDataKey, gameData);

function provideGameData(_gameData: GameData) {
    gameData.value = _gameData;
}
</script>

<template>
    <error-dialog />
    <game-data-loader v-if="!gameData" @ready="provideGameData" />
    <main-window v-if="gameData" />
</template>
