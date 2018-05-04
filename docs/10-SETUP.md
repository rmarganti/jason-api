# Hooking up the reducer and middleware

## Basic setup

```ts
import {
    // All of JasonAPI's HOC's default to using `resourceObjects`
    // as the redux store key, so we recommend you do the same.
    reducer as resourceObjects,
    middleware as jasonApiMiddleware,
} from 'jason-api';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import * as yourReducers from './reducers';

const store = createStore(
    combineReducers({ ...yourReducers, resourceObjects }),
    applyMiddleware(jasonApiMiddleware)
);
```

### Customizing the middleware

If you would like to customize the JasonAPI middleware, use the `middlewareFactory`. It accepts accepts action creators that will be triggered at the approriate times.

```js
import { middlewareFactory } from 'jason-api';

const jasonApiMiddleware = middlewareFactory({
    startLoadingActionCreator: () => ({ type: 'START_LOADING' }),
    stopLoadingActionCreator: () => ({ type: 'STOP_LOADING' }),
    displayErrorActionCreator: (errorMessage) => ({ type: 'START_LOADING', message: errorMessage }),
    authenticationExpiredActionCreator: () => ({ type: 'AUTHENTICATION_EXPIRED' }),
});

```
