import AppWindowBase from '#core/ui/main/AppWindowBase';

export default function AppWindow() {
    return (
        <AppWindowBase>
            <AppWindowBase.FactoryPalette>
                <h1>Palette</h1>
            </AppWindowBase.FactoryPalette>
            <AppWindowBase.FlowChart>
                <h1>FlowChart</h1>
            </AppWindowBase.FlowChart>
        </AppWindowBase>
    );
}
