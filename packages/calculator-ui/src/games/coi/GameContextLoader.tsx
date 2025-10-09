import PageInitializer from './PageInitializer';
import { GameContextProvider } from './parser';

export default function GameContextLoader() {
    return (
        <GameContextProvider>
            <PageInitializer />
        </GameContextProvider>
    );
}
