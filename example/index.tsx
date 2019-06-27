import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Article from './src/components/Article';
import { mockAxios } from './src/mockAxios';
import { store } from './src/store';

// Mock the network response.
mockAxios();

ReactDOM.render(
    <Provider store={store}>
        <Article />
    </Provider>,
    document.getElementById('root')
);
