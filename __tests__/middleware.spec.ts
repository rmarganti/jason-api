import axios from 'axios';
import * as sinon from 'sinon';
import { ApiResourceObject } from 'ts-json-api';

import * as actionTypes from '../src/redux/actionTypes';
import middleware from '../src/redux/middleware';
import * as actionMocks from './mocks/actionMocks';
import { createMockStore, restoreNetworkFunctions } from './tools';

const collectionResponse = require('./mocks/collectionResponse');
const errorResponse = require('./mocks/errorResponse');
const itemResponse = require('./mocks/itemResponse');

let mockStore;

describe('middleware', () => {
    beforeEach(() => {
        mockStore = createMockStore();
        restoreNetworkFunctions(axios);
    });

    it('ignores unrelated action types', () => {
        const action = { type: 'IGNORE_ME' };
        const result = mockStore.dispatch(action);
        expect(result).toEqual(action);
    });

    it('Fetches an item and returns a JsonApiResponse object', done => {
        const action = {
            type: actionTypes.JASON_API_REQUEST,
            url: 'http://www.api.com/articles/1',
            resourceType: 'articles',
            resourceId: '1',
        };

        const expectedActions = [
            ...actionMocks.startAndStopLoading('articles', '1'),
            ...actionMocks.loadResponse(itemResponse, 'articles'),
        ];

        const getStub = sinon
            .stub(axios, 'request')
            .callsFake(() => Promise.resolve({ data: itemResponse }));

        mockStore.dispatch(action).then(result => {
            expect(mockStore.getActions()).toEqual(expectedActions);
            expect(getStub.callCount).toEqual(1);
            expect(result).toEqual(itemResponse);
            done();
        });
    });

    it('Fetches a collection and returns the JSON API response', done => {
        const action = {
            type: actionTypes.JASON_API_REQUEST,
            url: 'http://www.api.com/articles',
            resourceType: 'articles',
        };

        const expectedActions = [
            ...actionMocks.startAndStopLoading('articles'),
            ...actionMocks.loadResponse(collectionResponse, 'articles'),
        ];

        const getStub = sinon
            .stub(axios, 'request')
            .callsFake(() => Promise.resolve({ data: collectionResponse }));

        mockStore.dispatch(action).then(result => {
            expect(mockStore.getActions()).toEqual(expectedActions);
            expect(getStub.callCount).toEqual(1);
            expect(Array.isArray(result.data)).toBeTruthy();
            expect(result).toEqual(collectionResponse);
            done();
        });
    });

    it('Posts a new ApiResourceObject and returns a JsonApiResponse', done => {
        const action = {
            type: actionTypes.JASON_API_REQUEST,
            url: 'http://www.api.com/articles',
            method: 'post',
            payload: ApiResourceObject.build('articles', {
                title: 'JSON API paints my bikeshed',
            }),
        };

        const expectedActions = [
            ...actionMocks.startAndStopLoading('articles'),
            ...actionMocks.loadResponse(itemResponse, 'articles'),
        ];

        const postStub = sinon
            .stub(axios, 'request')
            .callsFake(() => Promise.resolve({ data: itemResponse }));

        mockStore.dispatch(action).then(result => {
            expect(mockStore.getActions()).toEqual(expectedActions);
            expect(postStub.callCount).toEqual(1);
            expect(result.data.id).toEqual('1');
            done();
        });
    });

    it('throws on an erroneous api response', done => {
        const action = {
            type: actionTypes.JASON_API_REQUEST,
            url: 'http://www.api.com/articles/1',
            resourceType: 'articles',
            resourceId: '1',
        };

        const expectedActions = [
            ...actionMocks.startLoading('articles', '1'),
            ...actionMocks.stopLoading('articles', '1'),
            {
                type: actionTypes.UPDATE_RESOURCE_OBJECT_META,
                payload: {
                    metaKey: 'errors',
                    resourceId: '1',
                    resourceType: 'articles',
                    value: [
                        {
                            detail: 'The requested Article was not found.',
                            status: '404',
                            title: 'Not Found',
                        },
                    ],
                },
            },
        ];

        const getStub = sinon
            .stub(axios, 'request')
            .callsFake(() =>
                Promise.reject({ response: { data: errorResponse } })
            );

        mockStore.dispatch(action).catch(result => {
            expect(mockStore.getActions()).toEqual(expectedActions);
            expect(getStub.callCount).toEqual(1);
            expect(result).toEqual(errorResponse);
            done();
        });
    });
});
