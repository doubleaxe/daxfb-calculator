import { Center, Loader } from '@mantine/core';
import { lazy, Suspense, useEffect, useState } from 'react';
import { css } from 'styled-system/css';

import MantineInit from '#core-ui/MantineInit';
import { GameIds } from '#types/constants';

const LandingPage = lazy(() => import(`./pages/LandingPage`));
const CoiGamePage = lazy(() => import('./pages/CoiGamePage'));

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
                    <Center className={css({ width: '100%', height: '100%' })}>
                        <Loader />
                    </Center>
                }
            >
                <PageComponent />
            </Suspense>
        </MantineInit>
    );
}
