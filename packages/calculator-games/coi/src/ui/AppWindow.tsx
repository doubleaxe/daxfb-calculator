import FactoryPalette from '#core/ui/factory-palette/FactoryPalette';
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
                <h1>FlowChart</h1>
            </AppWindowBase.FlowChart>
        </AppWindowBase>
    );
}
