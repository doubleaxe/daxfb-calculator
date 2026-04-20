import { GameContextProvider } from './game/parser/index.js';
import PageInitializer from './ui/PageInitializer.jsx';

export default function GameContextLoader() {
    return (
        <GameContextProvider>
            <PageInitializer />
        </GameContextProvider>
    );
}
