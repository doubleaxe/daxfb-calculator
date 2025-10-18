import { Burger, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { observer } from 'mobx-react-lite';

import { useFactoryPaletteState } from '#core/stores/FactoryPaletteState.js';

import ActionButton from '../components/ActionButton';

const ToolBarBase = observer(() => {
    const factoryPaletteState = useFactoryPaletteState();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Group align='center' justify='space-between'>
            <Group>
                <Tooltip label='Toggle palette'>
                    <Burger
                        onClick={() => factoryPaletteState.toggleFactoryPalette()}
                        opened={factoryPaletteState.factoryPaletteOpened}
                        size='md'
                    />
                </Tooltip>
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
