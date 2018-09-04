import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import registerServiceWorker from './scripts/registerServiceWorker';
import { Provider } from 'react-redux'
import getStore from './scripts/store';

ReactDOM.render(
    <Provider store={getStore()}>
        <App />
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
