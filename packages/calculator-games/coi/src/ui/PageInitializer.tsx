import DragAndDropInitializer from '#core/ui/main/DragAndDropInitializer';
import InternalStoresInitializer from '#core/ui/main/InternalStoresInitializer';
import useStylesInitializer from '#core/ui/main/StylesInitializer';
import iconsPath from '#daxfb-gamedata-generated/coi/images.png';

import { useGameData } from '../game/parser';
import AppWindow from './AppWindow';

export default function PageInitializer() {
    const gameData = useGameData();
    useStylesInitializer({ gameData, iconsPath });

    return (
        <DragAndDropInitializer>
            <InternalStoresInitializer>
                <AppWindow />
            </InternalStoresInitializer>
        </DragAndDropInitializer>
    );
}
