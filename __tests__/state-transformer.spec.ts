import * as R from 'ramda';
import { ResourceObject, ResourceObjects } from 'ts-json-api';

import {
    addRelationshipToResourceObject,
    clearResourceObjectType,
    insertOrUpdateResourceObjects,
    removeResourceObject,
    removeRelationshipFromResourceObject,
    updateResourceObject,
    updateResourceObjectsMeta,
    setRelationshipOnResourceObject,
    clearRelationshipOnResourceObject,
} from '../src/state-transformer';
import {
    commentJsonResponse,
    commentsJsonResponse,
    initialJsonApiResponse,
} from './mocks';

describe('insertOrUpdateResourceObjects', () => {
    it('parses json data', () => {
        const result = insertOrUpdateResourceObjects(
            {},
            initialJsonApiResponse
        );

        expect(Object.keys(result).sort()).toEqual([
            'articles',
            'comments',
            'people',
        ]);
        expect(
            R.path(
                [
                    'articles',
                    'byId',
                    '1',
                    'relationships',
                    'author',
                    'data',
                    'id',
                ],
                result
            )
        ).toEqual('9');
        expect(
            R.path<ResourceObject[]>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['5', '12']);
    });

    it('create a brand new type of entity not via json api data', () => {
        const result = insertOrUpdateResourceObjects(
            {},
            {
                type: 'movie',
                id: '123',
                attributes: {
                    title: 'Puppy goes swimming',
                    rating: 5,
                },
            }
        );

        expect(
            R.path(['movies', 'byId', '123', 'attributes', 'title'], result)
        ).toEqual('Puppy goes swimming');
        expect(
            R.path(['movies', 'byId', '123', 'attributes', 'rating'], result)
        ).toEqual(5);
    });

    it("throws an error if an entity doesn't have an id", () => {
        const entityWithNoId = {
            data: {
                type: 'TestResourceObject',
            },
        };

        const functionCallWithInvalidResourceObject = () =>
            insertOrUpdateResourceObjects({}, entityWithNoId);
        expect(functionCallWithInvalidResourceObject).toThrow(
            /must have an `id`/
        );
    });

    it("throws an error if an entity doesn't have a type", () => {
        const entityWithNoType = { data: { id: '123' } };

        const functionCallWithInvalidResourceObject = () =>
            insertOrUpdateResourceObjects({}, entityWithNoType);

        expect(functionCallWithInvalidResourceObject).toThrow(
            /must have a `type`/
        );
    });
});

describe('addRelationshipToResourceObject', () => {
    it('Adds new relationships when given a data wrapped object', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = addRelationshipToResourceObject(
            state,
            'articles',
            '1',
            'comments',
            commentJsonResponse
        );

        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual([
            '5',
            '12',
            '44',
        ]);
        expect(
            R.path<ResourceObjects>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['5', '12', '44']);
    });

    it('Adds new relationships when given a non-data wrapped object', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = addRelationshipToResourceObject(
            state,
            'articles',
            '1',
            'comments',
            commentJsonResponse.data
        );

        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual([
            '5',
            '12',
            '44',
        ]);
        expect(
            R.path<ResourceObjects>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['5', '12', '44']);
    });

    it('Adds new relationships when given an array of objects', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = addRelationshipToResourceObject(
            state,
            'articles',
            '1',
            'comments',
            commentsJsonResponse
        );

        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual([
            '5',
            '12',
            '42',
            '44',
        ]);
        expect(
            R.path<ResourceObjects>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['42', '44', '5', '12']);
    });
});

describe('removeRelationshipFromResourceObject', () => {
    it('removes a relationship', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = removeRelationshipFromResourceObject(
            state,
            'articles',
            '1',
            'comments',
            '5'
        );

        expect(
            R.path<ResourceObjects>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['12']);
    });
});

describe('setRelationshipOnResourceObject', () => {
    it('sets a single relationship', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = setRelationshipOnResourceObject(
            state,
            'articles',
            '1',
            'author',
            {
                type: 'people',
                id: '4444',
            }
        );

        expect(
            R.path(
                [
                    'articles',
                    'byId',
                    '1',
                    'relationships',
                    'author',
                    'data',
                    'id',
                ],
                result
            )
        ).toEqual('4444');
    });

    it('sets a relationship to an array or resource itesms', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = setRelationshipOnResourceObject(
            state,
            'articles',
            '1',
            'comments',
            [{ type: 'comments', id: '4444' }, { type: 'comments', id: '6666' }]
        );

        expect(
            R.path<ResourceObjects>(
                ['articles', 'byId', '1', 'relationships', 'comments', 'data'],
                result
            ).map(comment => comment.id)
        ).toEqual(['4444', '6666']);
    });
});

describe('clearRelationshipOnResourceObject', () => {
    it('clears a relationship type', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = clearRelationshipOnResourceObject(
            state,
            'articles',
            '1',
            'comments'
        );

        expect(
            R.path(
                ['articles', 'byId', '1', 'relationships', 'comments'],
                result
            )
        ).toEqual(undefined);
    });

    it('does not fail on a non-existent relationship', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = clearRelationshipOnResourceObject(
            state,
            'articles',
            '1',
            'flavors'
        );
    });
});

describe('updateResourceObject', () => {
    it('updates an entity', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = updateResourceObject(state, 'articles', '1', {
            title: 'New Title',
        });

        expect(
            R.path(['articles', 'byId', '1', 'attributes', 'title'], result)
        ).toEqual('New Title');
    });

    it('updates an entity from a ResourceObject', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const result = updateResourceObject(state, {
            type: 'articles',
            id: '1',
            attributes: {
                title: 'New Title',
            },
        });

        expect(
            R.path(['articles', 'byId', '1', 'attributes', 'title'], result)
        ).toEqual('New Title');
    });
});

describe('updateResourceObjectsMeta', () => {
    it('should set a meta property for an entity', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const updatedState = updateResourceObjectsMeta(
            state,
            'articles',
            'isLoading',
            true
        );

        expect(R.path(['articles', 'meta', 'isLoading'], updatedState)).toEqual(
            true
        );
    });

    it('should completely replace the metadata for an entity', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const updatedState = updateResourceObjectsMeta(
            state,
            'articles',
            null,
            {
                newMetaProperty: 'newMetaValue',
            }
        );

        expect(R.path(['articles', 'meta'], updatedState)).toEqual({
            newMetaProperty: 'newMetaValue',
        });
    });
});

describe('removeResourceObject', () => {
    it('should delete an entity', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const updatedState = removeResourceObject(state, 'articles', '1');
        expect(R.path(['articles', 'byId'], updatedState)).toEqual({});
    });
});

describe('clearResourceObjectType', () => {
    it('should reset an entity type', () => {
        const state = insertOrUpdateResourceObjects({}, initialJsonApiResponse);
        const updatedState = clearResourceObjectType(state, 'articles');
        expect(updatedState.articles).toEqual(undefined);
    });
});
