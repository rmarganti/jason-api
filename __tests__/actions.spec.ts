import pluralize from 'pluralize';

import * as actions from '../src/actions';
import actionNames from '../src/action-names';

describe('actions', () => {
    it('should create an action to load json api data', () => {
        const data = {
            data: {
                type: 'article',
                id: '12345',
                attributes: {
                    title: 'Test Title',
                },
            },
        };
        const expectedAction = {
            type: actionNames.LOAD_JSON_API_ENTITY_DATA,
            payload: { data },
        };
        expect(actions.loadJsonApiResourceObjectData(data)).toEqual(
            expectedAction
        );
    });

    it('should create an action to add a relationship to an entity', () => {
        const resourceType = 'articles';
        const resourceId = '1';
        const relationshipKey = 'reader';
        const relationshipObject = {
            type: 'user',
            id: '54321',
            attributes: {
                name: 'Bob Ross',
            },
        };
        const expectedAction = {
            type: actionNames.ADD_RELATIONSHIP_TO_ENTITY + '_ARTICLE_READERS',
            payload: {
                resourceType,
                resourceId,
                relationshipKey,
                relationshipObject,
            },
        };
        expect(
            actions.addRelationshipToResourceObject(
                resourceType,
                resourceId,
                relationshipKey,
                relationshipObject
            )
        ).toEqual(expectedAction);
    });

    it('should create an action to remove a relationship from an entity', () => {
        const resourceType = 'articles';
        const resourceId = '1';
        const relationshipKey = 'reader';
        const relationshipId = '54321';
        const expectedAction = {
            type:
                actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY +
                '_ARTICLE_READERS',
            payload: {
                resourceType,
                resourceId,
                relationshipKey,
                relationshipId,
            },
        };

        expect(
            actions.removeRelationshipFromResourceObject(
                resourceType,
                resourceId,
                relationshipKey,
                relationshipId
            )
        ).toEqual(expectedAction);
    });

    it('should create an action to update an entity', () => {
        const resourceType = 'articles';
        const resourceId = '1';
        const data = {
            title: 'New Test Title',
        };
        const expectedAction = {
            type: actionNames.UPDATE_ENTITY + '_ARTICLE',
            payload: {
                resourceType,
                resourceId,
                data,
            },
        };
        expect(
            actions.updateResourceObject(resourceType, resourceId, data)
        ).toEqual(expectedAction);
    });

    it('should create an action to update metadata for an entity group', () => {
        const resourceType = 'articles';
        const metaKey = 'isLoading';
        const value = true;

        const expectedAction = {
            type: actionNames.UPDATE_ENTITIES_META + '_ARTICLES',
            payload: {
                resourceType,
                metaKey,
                value,
            },
        };

        expect(
            actions.updateResourceObjectsMeta(resourceType, metaKey, value)
        ).toEqual(expectedAction);
    });

    it('should create an action to update metadata for an entity', () => {
        const resourceType = 'article',
            resourceId = '1',
            metaKey = 'isLoading',
            value = true;

        const expectedAction = {
            type: actionNames.UPDATE_ENTITY_META + '_ARTICLE',
            payload: {
                resourceType,
                resourceId,
                metaKey,
                value,
            },
        };

        expect(
            actions.updateResourceObjectMeta(
                resourceType,
                resourceId,
                metaKey,
                value
            )
        ).toEqual(expectedAction);
    });

    it('should create an action to delete an entity', () => {
        const resourceType = 'article',
            resourceId = '1';

        const expectedAction = {
            type: actionNames.REMOVE_ENTITY + '_ARTICLE',
            payload: {
                resourceType,
                resourceId,
            },
        };

        expect(actions.removeResourceObject(resourceType, resourceId)).toEqual(
            expectedAction
        );
    });

    it('should create an action to delete an entity type', () => {
        const resourceType = 'articles';

        const expectedAction = {
            type: actionNames.CLEAR_ENTITY_TYPE + '_ARTICLES',
            payload: {
                resourceType,
            },
        };

        expect(actions.clearResourceObjectType(resourceType)).toEqual(
            expectedAction
        );
    });
});
