import MantineInit from '@doubleaxe/daxfb-calculator-core/ui/MantineInit';
import { center } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { Loader } from '@mantine/core';
import { lazy, Suspense, useEffect, useState } from 'react';

import { GameIds } from './GameIds.js';

const LandingPage = lazy(() => import(`./pages/LandingPage.jsx`));
const CoiGamePage = lazy(() => import('./pages/CoiGamePage.jsx'));

function getGameId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('gameId');
}

export default function App() {
    const [gameId, setGameId] = useState<null | string>(getGameId());

    useEffect(() => {
        const updateGameId = () => {
            setGameId(getGameId());
        };

        window.addEventListener('popstate', updateGameId);
        return () => {
            window.removeEventListener('popstate', updateGameId);
        };
    }, []);

    let PageComponent = LandingPage;
    switch (gameId) {
        case GameIds.COI:
            PageComponent = CoiGamePage;
            break;
    }

    return (
        <MantineInit>
            <Suspense
                fallback={
                    <div className={center({ width: '100%', height: '100%' })}>
                        <Loader />
                    </div>
                }
            >
                <PageComponent />
            </Suspense>
        </MantineInit>
    );
}
