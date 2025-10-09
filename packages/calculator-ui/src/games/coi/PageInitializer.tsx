import useStylesInitializer from '#core-ui/main/StylesInitializer';
import iconsPath from '#daxfb-gamedata-generated/coi/images.png';

import { useGameContext } from './parser';

export default function PageInitializer() {
    const gameData = useGameContext();
    useStylesInitializer({ gameData, iconsPath });

    return (
        <div>
            <h1>COI</h1>
        </div>
    );
}
