## Hooking up the reducer and middleware

Basic setup

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
