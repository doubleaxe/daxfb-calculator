import { Center, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { css } from 'styled-system/css';

import MantineInit from '#core-ui/MantineInit';

import LandingPage from './pages/LandingPage';

export default function App() {
    return (
        <MantineInit>
            <BrowserRouter>
                <Suspense
                    fallback={
                        <Center className={css({ width: '100%', height: '100%' })}>
                            <Loader />
                        </Center>
                    }
                >
                    <Routes>
                        <Route element={<LandingPage />} path='/' />
                        <Route element={<div>qqq</div>} path='/?gameId=coi' />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </MantineInit>
    );
}
