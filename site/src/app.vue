<script setup lang="ts">
import {ref} from 'vue';

</script>

<template>
    <n-layout has-sider class="main-window">
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="10"
            width="20%"
            :default-collapsed="false"
            :show-collapsed-content="false"
            show-trigger
        >
            <icon-list-panel />
        </n-layout-sider>
        <n-layout-content>
            <p>You did it!</p>
        </n-layout-content>
    </n-layout>
</template>

<style scoped>
.main-window {
    height: 100%;
    width: 100%;
}
</style>
