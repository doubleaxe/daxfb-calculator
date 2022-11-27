<script setup lang="ts">
import {useBlueprintModel} from '../scripts/blueprint-model';

const {blueprint} = useBlueprintModel();
</script>

<template>
    <div class="blueprint-collection">
        <div
            v-for="item in blueprint.items"
            :key="item.name"
            class="blueprint-item"
            :style="{left: item.x+'px', top: item.y+'px'}"
        >
            <icon-component :image="item.item.image" />
            <div class="scroll-helper" />
        </div>
    </div>
</template>

<style scoped>
.blueprint-collection {
    position: relative;
}
.blueprint-item {
    position: absolute;
}
.scroll-helper {
    /* give some free space, so new items can be placed further */
    position: absolute;
    left: 0px;
    top: 0px;
    width: 200px;
    height: 200px;
}
</style>
