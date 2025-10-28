import FactoryPalette from '#core/ui/factory-palette/FactoryPalette';
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
                <FactoryPalette />
            </AppWindowBase.FactoryPalette>
            <AppWindowBase.FlowChart>
                <FlowChartFrame />
            </AppWindowBase.FlowChart>
        </AppWindowBase>
    );
}
