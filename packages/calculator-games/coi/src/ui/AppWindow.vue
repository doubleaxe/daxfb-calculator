<script setup lang="ts">
import FactoryPalette from '@daxfb/core/ui/factory-palette/FactoryPalette.vue';
import FactoryPaletteItemList from '@daxfb/core/ui/factory-palette/FactoryPaletteItemList.vue';
import FilterFactoryItem from '@daxfb/core/ui/factory-palette/FilterFactoryItem.vue';
import FlowChartFrame from '@daxfb/core/ui/flowchart/FlowChartFrame.vue';
import AppWindowBase from '@daxfb/core/ui/main/AppWindowBase.vue';
import ToolBarBase from '@daxfb/core/ui/toolbar/ToolBarBase.vue';
</script>

<template>
    <AppWindowBase>
        <template #toolbar>
            <ToolBarBase />
        </template>
        <template #factoryPalette>
            <FactoryPalette>
                <template #filterPanel>
                    <FilterFactoryItem />
                </template>
                <template #itemList>
                    <FactoryPaletteItemList />
                </template>
            </FactoryPalette>
        </template>
        <template #flowChart>
            <FlowChartFrame />
        </template>
    </AppWindowBase>
</template>
