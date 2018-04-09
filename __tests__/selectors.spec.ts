import * as R from 'ramda';

import {
    getResourceObject,
    getResourceObjects,
    getResourceObjectsMeta,
    getResourceObjectMeta,
    getCachedQuery,
} from '../src/redux/selectors';

import { JasonApiState } from '../src/common-types/state';

import { commentJsonResponse, initialJsonApiResponse } from './mocks';

import {
    cacheQuery,
    insertOrUpdateResourceObjects,
} from '../src/state-transformer';

const state = R.pipe<JasonApiState, JasonApiState, JasonApiState>(
    R.assocPath(['articles', 'meta'], {
        isLoading: true,
        anotherMetaProperty: 666,
    }),
    R.assocPath(['articles', 'byId', '1', 'meta', 'isLoading'], true)
)(
    cacheQuery(
        insertOrUpdateResourceObjects({}, initialJsonApiResponse),
        'cacheKey',
        initialJsonApiResponse
    )
);

describe('getResourceObject', () => {
    it('should return an resource object', () => {
        const resourceObject = getResourceObject(state, 'article', '1');

        expect(resourceObject.id).toEqual('1');
        expect(resourceObject.type).toEqual('articles');
        expect(resourceObject.attributes).toEqual({
            title: 'JSON API paints my bikeshed!',
        });
    });

    it('should return `undefined` if the resource object does not exist', () => {
        expect(getResourceObject(state, 'article', '666')).toEqual(undefined);
    });
});

describe('getResourceObjects', () => {
    it('should return all resource objects', () => {
        const results = getResourceObjects(state, 'comments');
        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return a subset of resource objects', () => {
        const results = getResourceObjects(state, 'comments', ['5', '12']);

        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return only resource objects that exist', () => {
        const results = getResourceObjects(state, 'comments', ['5', '666']);
        expect(results.length).toEqual(1);
        expect(results[0].attributes).toEqual({
            body: 'First!',
        });
    });

    it('should return an empty array if the resource objects do not exist', () => {
        expect(getResourceObjects(state, 'comments', ['666', '777'])).toEqual(
            []
        );
        expect(getResourceObjects(state, 'spicyboys')).toEqual([]);
    });
});

describe('getResourceObjectsMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        expect(getResourceObjectsMeta(state, 'articles')).toEqual({
            isLoading: true,
            anotherMetaProperty: 666,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        expect(getResourceObjectsMeta(state, 'articles', 'isLoading')).toEqual(
            true
        );
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectsMeta(state, 'articles', 'invalidMetaKey')
        ).toEqual(undefined);
        expect(getResourceObjectsMeta(state, 'authors')).toEqual(undefined);
    });
});

describe('getResourceObjectMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        expect(getResourceObjectMeta(state, 'articles', '1')).toEqual({
            isLoading: true,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        expect(
            getResourceObjectMeta(state, 'articles', '1', 'isLoading')
        ).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectMeta(state, 'articles', '1', 'invalidMetaKey')
        ).toEqual(undefined);
        expect(getResourceObjectMeta(state, 'authors', '1')).toEqual(undefined);
    });
});

describe('getCachedQuery', () => {
    it('should get a cached query', () => {
        const result = getCachedQuery(state, 'cacheKey');

        expect(result).toEqual({
            data: [{ type: 'articles', id: '1' }],
            links: {
                self: 'http://example.com/articles',
                next: 'http://example.com/articles?page[offset]=2',
                last: 'http://example.com/articles?page[offset]=10',
            },
        });
    });

    it('should fetch and expand a cached query', () => {
        const result = getCachedQuery(state, 'cacheKey', true);

        expect(result.data[0].attributes.title).toEqual(
            'JSON API paints my bikeshed!'
        );
    });
});
