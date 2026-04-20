import FactoryPalette from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPalette';
import FactoryPaletteItemList from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FactoryPaletteItemList';
import FilterFactoryItem from '@doubleaxe/daxfb-calculator-core/ui/factory-palette/FilterFactoryItem';
import FlowChartFrame from '@doubleaxe/daxfb-calculator-core/ui/flowchart/FlowChartFrame';
import AppWindowBase from '@doubleaxe/daxfb-calculator-core/ui/main/AppWindowBase';
import ToolBarBase from '@doubleaxe/daxfb-calculator-core/ui/toolbar/ToolBarBase';

export default function AppWindow() {
    return (
        <AppWindowBase>
            <AppWindowBase.ToolBar>
                <ToolBarBase />
            </AppWindowBase.ToolBar>
            <AppWindowBase.FactoryPalette>
                <FactoryPalette>
                    <FactoryPalette.FilterPanel>
                        <FilterFactoryItem />
                    </FactoryPalette.FilterPanel>
                    <FactoryPalette.ItemList>
                        <FactoryPaletteItemList />
                    </FactoryPalette.ItemList>
                </FactoryPalette>
            </AppWindowBase.FactoryPalette>
            <AppWindowBase.FlowChart>
                <FlowChartFrame />
            </AppWindowBase.FlowChart>
        </AppWindowBase>
    );
}
