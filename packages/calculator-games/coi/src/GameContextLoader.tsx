import { GameContextProvider } from './game/parser';
import PageInitializer from './ui/PageInitializer';

export default function GameContextLoader() {
    return (
        <GameContextProvider>
            <PageInitializer />
        </GameContextProvider>
    );
}
