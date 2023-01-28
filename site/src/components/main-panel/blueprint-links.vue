<script setup lang="ts">
import {injectBlueprintModel} from '@/scripts/model/store';

const blueprintModel = injectBlueprintModel();
</script>

<template>
    <svg class="background-svg">
        <blueprint-link
            v-if="blueprintModel.tempLink"
            :key="blueprintModel.tempLink.key"
            :link="blueprintModel.tempLink"
            color="link-stroke-black"
        />

        <blueprint-link
            v-for="_link in blueprintModel.links"
            :key="_link.key"
            :link="_link"
        />
    </svg>
    <template v-for="_link in blueprintModel.links" :key="_link.key">
        <blueprint-link-connector :link="_link" />
    </template>
</template>

<style scoped>
.background-svg {
    width: 100%;
    height: 100%;
}
</style>
