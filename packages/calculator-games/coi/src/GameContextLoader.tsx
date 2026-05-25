import { GameContextProvider } from '#game-ui-coi/game/parser/index.js';
import PageInitializer from '#game-ui-coi/ui/PageInitializer.jsx';

export default function GameContextLoader() {
    return (
        <GameContextProvider>
            <PageInitializer />
        </GameContextProvider>
    );
}
