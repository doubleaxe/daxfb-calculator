import FactoryPalette from '#core/ui/factory-palette/FactoryPalette';
import AppWindowBase from '#core/ui/main/AppWindowBase';

export default function AppWindow() {
    return (
        <AppWindowBase>
            <AppWindowBase.FactoryPalette>
                <FactoryPalette />
            </AppWindowBase.FactoryPalette>
            <AppWindowBase.FlowChart>
                <h1>FlowChart</h1>
            </AppWindowBase.FlowChart>
        </AppWindowBase>
    );
}
