import './index.css';
import '../generated/styled-system/styles.css';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { initApplication } from '#core/ui/init';

import App from './App';

initApplication();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
