import { Group, useMantineColorScheme } from '@mantine/core';
import { ListIcon, MoonIcon, SunIcon, XIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

import ActionButton from '../components/ActionButton';

const ToolBarBase = observer(() => {
    const factoryPaletteState = useFactoryPaletteState();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Group align='center' justify='space-between'>
            <Group>
                <ActionButton
                    icon={factoryPaletteState.factoryPaletteOpened ? <XIcon /> : <ListIcon />}
                    onClick={() => factoryPaletteState.toggleFactoryPalette()}
                    title='Toggle palette'
                />
            </Group>
            <Group>
                <ActionButton
                    color={colorScheme === 'dark' ? 'yellow.3' : 'blue.6'}
                    icon={colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    onClick={() => toggleColorScheme()}
                    title='Toggle color scheme'
                />
            </Group>
        </Group>
    );
});

export default ToolBarBase;
