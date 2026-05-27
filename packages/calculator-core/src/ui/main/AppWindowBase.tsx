import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { AppShell, ScrollArea } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';
import type { BaseProps } from '#core/types/props.js';
import { assignDisplayName, extractComponentsForCompoundParent } from '#core/utils/tsxhelpers.js';

function AppWindowBaseToolBar({ children }: BaseProps) {
    return children;
}
assignDisplayName(AppWindowBaseToolBar, 'AppWindowBaseToolBar');
function AppWindowBaseFactoryPalette({ children }: BaseProps) {
    return children;
}
assignDisplayName(AppWindowBaseFactoryPalette, 'AppWindowBaseFactoryPalette');
function AppWindowBaseFlowChart({ children }: BaseProps) {
    return children;
}
assignDisplayName(AppWindowBaseFlowChart, 'AppWindowBaseFlowChart');

const ScrollAreaAutoHide = observer((props: Record<string, unknown>) => {
    const factoryPaletteState = useFactoryPaletteState();
    return (
        <ScrollArea
            offsetScrollbars
            scrollbars='y'
            type={factoryPaletteState.itemSearchOpened ? 'never' : 'auto'}
            {...props}
        />
    );
});

function AppWindowBase({ children }: BaseProps) {
    const factoryPaletteState = useFactoryPaletteState();

    const [toolBar, factoryPalette, flowChart] = extractComponentsForCompoundParent(children, [
        'AppWindowBaseToolBar',
        'AppWindowBaseFactoryPalette',
        'AppWindowBaseFlowChart',
    ]);

    return (
        <AppShell
            className={css({ width: '100%', height: '100%' })}
            header={{ height: 60 }}
            navbar={{
                width: { sm: 190, lg: 260 },
                breakpoint: 'xs',
                collapsed: {
                    desktop: !factoryPaletteState.factoryPaletteOpened,
                    mobile: !factoryPaletteState.factoryPaletteOpened,
                },
            }}
            padding='md'
        >
            <AppShell.Header>{toolBar}</AppShell.Header>

            <AppShell.Navbar>
                <AppShell.Section grow renderRoot={(props) => <ScrollAreaAutoHide {...props} />}>
                    {factoryPalette}
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main className={css({ width: '100%', height: '100%' })}>{flowChart}</AppShell.Main>
        </AppShell>
    );
}

AppWindowBase.ToolBar = AppWindowBaseToolBar;
AppWindowBase.FactoryPalette = AppWindowBaseFactoryPalette;
AppWindowBase.FlowChart = AppWindowBaseFlowChart;

const AppWindowBaseObserved = observer(AppWindowBase);
export default AppWindowBaseObserved;
