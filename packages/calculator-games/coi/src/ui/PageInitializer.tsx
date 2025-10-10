import StylesInitializer from '#core/ui/main/StylesInitializer';
import iconsPath from '#daxfb-gamedata-generated/coi/images.png';

import { useGameContext } from '../game/parser';

export default function PageInitializer() {
    const gameData = useGameContext();

    return (
        <StylesInitializer gameData={gameData} iconsPath={iconsPath}>
            <h1>COI</h1>
        </StylesInitializer>
    );
}
