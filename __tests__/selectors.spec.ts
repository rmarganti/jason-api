import * as R from 'ramda';
import { iJsonApiResponseWithData } from 'ts-json-api';

import {
    getResourceObject,
    getResourceObjects,
    getResourceObjectsMeta,
    getResourceObjectMeta,
} from '../src/selectors';

import { iState } from '../src/interfaces/state';

import { commentJsonResponse, initialJsonApiResponse } from './mocks';
import { insertOrUpdateResourceObjects } from '../src/state-transformer';

const reverseMerge = R.flip(R.merge);

const state = R.pipe(
    R.assocPath(['articles', 'meta'], {
        isLoading: true,
        anotherMetaProperty: 666,
    }),
    R.assocPath(['articles', 'byId', '1', 'meta', 'isLoading'], true)
)(insertOrUpdateResourceObjects({}, initialJsonApiResponse));

describe('getResourceObject', () => {
    it('should return an resource object', () => {
        const resourceObject = getResourceObject(<iState>state, 'article', '1');

        expect(resourceObject.id).toEqual('1');
        expect(resourceObject.type).toEqual('articles');
        expect(resourceObject.attributes).toEqual({
            title: 'JSON API paints my bikeshed!',
        });
    });

    it('should return `undefined` if the resource object does not exist', () => {
        expect(getResourceObject(<iState>state, 'article', '666')).toEqual(
            undefined
        );
    });
});

describe('getResourceObjects', () => {
    it('should return all resource objects', () => {
        const results = getResourceObjects(<iState>state, 'comments');
        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return a subset of resource objects', () => {
        const results = getResourceObjects(<iState>state, 'comments', [
            '5',
            '12',
        ]);

        expect(results[0].attributes).toEqual({
            body: 'First!',
        });

        expect(results[1].attributes).toEqual({
            body: 'I like XML better',
        });
    });

    it('should return only resource objects that exist', () => {
        const results = getResourceObjects(<iState>state, 'comments', [
            '5',
            '666',
        ]);
        expect(results.length).toEqual(1);
        expect(results[0].attributes).toEqual({
            body: 'First!',
        });
    });

    it('should return an empty array if the resource objects do not exist', () => {
        expect(
            getResourceObjects(<iState>state, 'comments', ['666', '777'])
        ).toEqual([]);
        expect(getResourceObjects(<iState>state, 'spicyboys')).toEqual([]);
    });
});

describe('getResourceObjectsMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        expect(getResourceObjectsMeta(<iState>state, 'articles')).toEqual({
            isLoading: true,
            anotherMetaProperty: 666,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        expect(
            getResourceObjectsMeta(<iState>state, 'articles', 'isLoading')
        ).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectsMeta(<iState>state, 'articles', 'invalidMetaKey')
        ).toEqual(undefined);
        expect(getResourceObjectsMeta(<iState>state, 'authors')).toEqual(
            undefined
        );
    });
});

describe('getResourceObjectMeta', () => {
    it('should return all the meta data for an resource object type', () => {
        expect(getResourceObjectMeta(<iState>state, 'articles', '1')).toEqual({
            isLoading: true,
        });
    });

    it("should return a specific meta property's value for an resource object group", () => {
        expect(
            getResourceObjectMeta(<iState>state, 'articles', '1', 'isLoading')
        ).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an resource object group', () => {
        expect(
            getResourceObjectMeta(
                <iState>state,
                'articles',
                '1',
                'invalidMetaKey'
            )
        ).toEqual(undefined);
        expect(getResourceObjectMeta(<iState>state, 'authors', '1')).toEqual(
            undefined
        );
    });
});
