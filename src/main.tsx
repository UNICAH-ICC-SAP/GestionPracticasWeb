import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';
import { Store } from './store/index';
import { ProviderStore } from './storeConfig/index';
import { BrowserRouter } from 'react-router-dom';

const divElement = document.getElementById('root') as HTMLDivElement

const root = createRoot(divElement);

root.render(<StrictMode>
    <BrowserRouter>
        <ProviderStore store={Store}>
            <App />
        </ProviderStore>
    </BrowserRouter>
</StrictMode>
)
