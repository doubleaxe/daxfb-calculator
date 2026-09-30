<script setup lang="ts">
import FactoryPalette from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPalette.vue';
import FactoryPaletteItemList from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPaletteItemList.vue';
import FilterFactoryItem from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FilterFactoryItem.vue';
import FlowChartFrame from '@doubleaxe/daxfb-calculator-core/ui/flowchart/FlowChartFrame.vue';
import AppWindowBase from '@doubleaxe/daxfb-calculator-core/ui/main/AppWindowBase.vue';
import ToolBarBase from '@doubleaxe/daxfb-calculator-core/ui/toolbar/ToolBarBase.vue';
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
