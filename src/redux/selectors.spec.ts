import {
    getResourceObject,
    getResourceObjects,
    getResourceObjectsMeta,
    getResourceObjectMeta,
    getCachedQuery,
} from './selectors';

import { defaultState } from '../../__mocks__';

const state = { jasonApi: defaultState };

describe('getResourceObject', () => {
    it('should return an resource object', () => {
        const resourceObject = getResourceObject('article', '1')(state)!;

        expect(resourceObject.id).toEqual('1');
        expect(resourceObject.type).toEqual('articles');
        expect(resourceObject.attributes).toEqual({
            title: 'JSON API paints my bikeshed!',
        });
    });

    it('should return `undefined` if the resource object does not exist', () => {
        expect(getResourceObject('article', '666')(state)).toEqual(undefined);
    });
});

describe('getResourceObjects', () => {
    it('should return all resource objects', () => {
        const results = getResourceObjects('comments')(state);

        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return a subset of resource objects', () => {
        const results = getResourceObjects('comments', ['5', '12'])(state);

        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return only resource objects that exist', () => {
        const results = getResourceObjects('comments', ['5', '666'])(state);
        expect(results.length).toEqual(1);
        expect(results[0].attributes).toEqual({
            body: 'First!',
        });
    });

    it('should return an empty array if the resource objects do not exist', () => {
        expect(getResourceObjects('comments', ['666', '777'])(state)).toEqual(
            []
        );
        expect(getResourceObjects('spicyboys')(state)).toEqual([]);
    });
});

describe('getResourceObjectsMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        expect(getResourceObjectsMeta('articles')(state)).toEqual({
            isLoading: true,
            anotherMetaProperty: 666,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        expect(getResourceObjectsMeta('articles', 'isLoading')(state)).toEqual(
            true
        );
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectsMeta('articles', 'invalidMetaKey')(state)
        ).toEqual(undefined);
        expect(getResourceObjectsMeta('authors')(state)).toEqual(undefined);
    });
});

describe('getResourceObjectMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        const result = getResourceObjectMeta('articles', '1')(state);

        expect(result).toEqual({
            isLoading: true,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        const result = getResourceObjectMeta('articles', '1', 'isLoading')(
            state
        );

        expect(result).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectMeta('articles', '1', 'invalidMetaKey')(state)
        ).toEqual(undefined);
        expect(getResourceObjectMeta('authors', '1')(state)).toEqual(undefined);
    });
});

describe('getCachedQuery', () => {
    it('should get a cached query', () => {
        const result = getCachedQuery('cacheKey')(state);

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
        const result = getCachedQuery('cacheKey', true)(state);

        // @ts-ignore
        expect(result.data[0].attributes.title).toEqual(
            'JSON API paints my bikeshed!'
        );
    });
});
