import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { AppShell, ScrollArea } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState';
import type { BaseProps } from '#core/types/props';

function AppWindowBaseToolBar({ children }: BaseProps) {
    return children;
}
function AppWindowBaseFactoryPalette({ children }: BaseProps) {
    return children;
}
function AppWindowBaseFlowChart({ children }: BaseProps) {
    return children;
}

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

    let toolBar: ReactNode | undefined;
    let factoryPalette: ReactNode | undefined;
    let flowChart: ReactNode | undefined;

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;
        if (child.type === AppWindowBaseToolBar) {
            toolBar = child;
        }
        if (child.type === AppWindowBaseFactoryPalette) {
            factoryPalette = child;
        } else if (child.type === AppWindowBaseFlowChart) {
            flowChart = child;
        }
    });

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
