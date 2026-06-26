import './index.css';
import './panda.css';

import { initApplication } from '@doubleaxe/daxfb-calculator-core/ui/init';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

initApplication();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
