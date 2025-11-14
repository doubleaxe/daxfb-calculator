import FactoryPalette from '#core/ui/factory-palette/FactoryPalette';
import FactoryPaletteItemList from '#core/ui/factory-palette/FactoryPaletteItemList';
import FilterFactoryItem from '#core/ui/factory-palette/FilterFactoryItem';
import FlowChartFrame from '#core/ui/flowchart/FlowChartFrame';
import AppWindowBase from '#core/ui/main/AppWindowBase';
import ToolBarBase from '#core/ui/toolbar/ToolBarBase';

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
