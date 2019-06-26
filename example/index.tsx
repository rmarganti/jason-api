import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ResponseWithData } from 'ts-json-api';

import { useRequestResponse, useRequest } from '../src'; // JasonApi

import { createArticle, getArticle } from './actions';
import { mockAxios } from './mockAxios';
import { store } from './store';
import { Article } from './types';

// Mock the network response.
mockAxios();

const App = () => {
    const result = useRequestResponse<Article>({
        action: getArticle('1'),
        expandResourceObjects: true,
    });

    const doCreateArticle = useRequest(() => createArticle('Article title'));
    const doCreateArticleAndAlert = React.useCallback(
        () =>
            doCreateArticle().then((result: ResponseWithData<Article>) => {
                console.log(result);
                alert('Success!: Check the console for the response body.');
            }),
        [doCreateArticle]
    );

    return result.meta && result.meta.isLoading ? (
        <p>Loading</p>
    ) : result.errors ? (
        <div>Errors!</div>
    ) : result.data ? (
        <div>
            <h1>{result.data.attributes.title}</h1>
            <p>{result.data.attributes.body}</p>
            <button onClick={doCreateArticleAndAlert}>
                Create New Article
            </button>
        </div>
    ) : null;
};

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
