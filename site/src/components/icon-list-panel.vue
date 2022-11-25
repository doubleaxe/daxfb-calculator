<script setup lang="ts">
import { itemCollection } from '../scripts/factory';

const producerItems = itemCollection.getProducerItems();
</script>

<template>
    <icon-component v-for="item in producerItems" :image="item.image" />
</template>

<style scoped>
</style>
