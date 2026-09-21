<script setup lang="ts">
import { hstack, vstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
</script>

<template>
    <div :class="vstack({})">
        <div :class="hstack({ flex: 'none', alignSelf: 'center' })">
            <slot name="filterPanel" />
        </div>
        <div :class="hstack({ flexGrow: 1, alignSelf: 'start' })">
            <slot name="itemList" />
        </div>
    </div>
</template>
