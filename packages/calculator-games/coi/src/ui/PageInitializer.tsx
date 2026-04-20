import DragAndDropInitializer from '@doubleaxe/daxfb-calculator-core/ui/main/DragAndDropInitializer';
import InternalStoresInitializer from '@doubleaxe/daxfb-calculator-core/ui/main/InternalStoresInitializer';
import useStylesInitializer from '@doubleaxe/daxfb-calculator-core/utils/main/StylesInitializer';
import iconsPath from '@doubleaxe/daxfb-gamedata-generated/coi/images.png';

import { flowChartModelCoiFactory } from '../game/model/index.js';
import { useGameData } from '../game/parser/index.js';
import AppWindow from './AppWindow.jsx';

export default function PageInitializer() {
    const gameData = useGameData();
    useStylesInitializer({ gameData, iconsPath });

    return (
        <DragAndDropInitializer>
            <InternalStoresInitializer flowChartModel={() => flowChartModelCoiFactory(gameData)}>
                <AppWindow />
            </InternalStoresInitializer>
        </DragAndDropInitializer>
    );
}
