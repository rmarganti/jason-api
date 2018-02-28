import configureMockStore from 'redux-mock-store';
import { middlewareFactory } from '../../src/redux/middleware';

const defaultStoreContent = require('../mocks/defaultStore.json');

const startLoading = () => ({ type: 'START_LOADING' });
const stopLoading = () => ({ type: 'STOP_LOADING' });
const displayError = () => ({ type: 'DISPLAY_ERROR' });

export const jsonApiFetchMiddleware = middlewareFactory({
    startLoadingActionCreator: startLoading,
    stopLoadingActionCreator: stopLoading,
    displayErrorActionCreator: displayError,
});

export const createMockStore = configureMockStore([jsonApiFetchMiddleware]);

export const defaultStore = createMockStore({
    resourceObjects: defaultStoreContent,
});

export const restoreNetworkFunctions = network => {
    ['destroy', 'get', 'post', 'patch', 'request'].forEach(action => {
        if (network[action] && network[action].restore)
            network[action].restore();
    });
};
