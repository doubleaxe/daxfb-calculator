import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { useMantineColorScheme } from '@mantine/core';
import { ListIcon, MoonIcon, SunIcon, XIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

import ActionButton from '../components/ActionButton';

const ToolBarBase = observer(() => {
    const factoryPaletteState = useFactoryPaletteState();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <div className={hstack({ alignItems: 'center', justify: 'space-between' })}>
            <div className={hstack()}>
                <ActionButton
                    icon={factoryPaletteState.factoryPaletteOpened ? <XIcon /> : <ListIcon />}
                    onClick={() => factoryPaletteState.toggleFactoryPalette()}
                    title='Toggle palette'
                />
            </div>
            <div className={hstack()}>
                <ActionButton
                    color={colorScheme === 'dark' ? 'yellow.3' : 'blue.6'}
                    icon={colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    onClick={() => toggleColorScheme()}
                    title='Toggle color scheme'
                />
            </div>
        </div>
    );
});

export default ToolBarBase;
