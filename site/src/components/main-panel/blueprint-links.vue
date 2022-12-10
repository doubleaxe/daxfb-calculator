<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';

const blueprintModel = injectBlueprintModel();
</script>

<template>
    <svg class="background-svg">
        <blueprint-link
            v-for="_link in blueprintModel.tempLinks"
            :key="_link.key"
            :link="_link"
        />

        <blueprint-link
            v-for="_link in blueprintModel.links"
            :key="_link.key"
            :link="_link"
        />
    </svg>
</template>

<style scoped>
.background-svg {
    width: 100%;
    height: 100%;
}
</style>
