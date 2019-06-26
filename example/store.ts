import { applyMiddleware, createStore, combineReducers } from 'redux';

// JasonAPI
import { middleware as jasonApiMiddleware, reducer as jasonApi } from '../src';

// Setup the store
const rootReducer = combineReducers({ jasonApi });

export const store = createStore(
    rootReducer,
    applyMiddleware(jasonApiMiddleware)
);
