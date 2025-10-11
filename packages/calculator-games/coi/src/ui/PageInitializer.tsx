import useStylesInitializer from '#core/ui/main/StylesInitializer';
import iconsPath from '#daxfb-gamedata-generated/coi/images.png';

import { useGameContext } from '../game/parser';
import AppWindow from './AppWindow';

export default function PageInitializer() {
    const gameData = useGameContext();
    useStylesInitializer({ gameData, iconsPath });

    return <AppWindow />;
}
