import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';
import { Store } from './store/index';
import { ProviderStore } from './storeConfig/index';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(<StrictMode>
    <BrowserRouter>
        <ProviderStore store={Store}>
            <App />
        </ProviderStore>
    </BrowserRouter>
</StrictMode>, document.getElementById('root')
)
