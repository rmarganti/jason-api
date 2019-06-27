import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { mockResponse } from '../__mocks__/mockResponse';

export const mockAxios = () => {
    // Mock the Axios (used under the hood) response
    const mock = new MockAdapter(axios, {
        delayResponse: 2000,
    });

    mock.onGet('/articles/1').reply(200, mockResponse);
    mock.onPost('/articles').reply(200, mockResponse);
};
