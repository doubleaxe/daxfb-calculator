<script setup lang="ts">
import FactoryPalette from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPalette';
import FactoryPaletteItemList from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPaletteItemList';
import FilterFactoryItem from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FilterFactoryItem';
import FlowChartFrame from '@doubleaxe/daxfb-calculator-core/ui/flowchart/FlowChartFrame';
import AppWindowBase from '@doubleaxe/daxfb-calculator-core/ui/main/AppWindowBase';
import ToolBarBase from '@doubleaxe/daxfb-calculator-core/ui/toolbar/ToolBarBase';
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
