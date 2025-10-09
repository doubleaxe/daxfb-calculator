import { GameContextProvider } from './parser';

export default function MainPage() {
    return (
        <GameContextProvider>
            <div>
                <h1>COI</h1>
            </div>
        </GameContextProvider>
    );
}
