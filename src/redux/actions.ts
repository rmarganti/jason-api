import * as pluralize from 'pluralize';
import {
    iJsonApiResponseWithData,
    iAttributes,
    iResourceObject,
    iJsonApiResponse,
} from 'ts-json-api';

import { actionNames } from '../constants';
import {
    iLoadAction,
    iAddRelationshipAction,
    iRemoveRelationshipAction,
    iSetRelationshipAction,
    iClearRelationshipAction,
    iUpdateResourceObjectsMetaAction,
    iUpdateResourceObjectMetaAction,
    iUpdateResourceObjectAction,
    iRemoveResourceObjectAction,
    iClearResourceObjectTypeAction,
    iCacheQueryAction,
} from '../interfaces/actions';
import { FlexiblePayload } from '../interfaces/other';

const singularCase = (input: string) => pluralize(input, 1).toUpperCase();
const pluralCase = (input: string) => pluralize(input).toUpperCase();

/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export const loadJsonApiResourceObjectData = (
    data: FlexiblePayload
): iLoadAction => ({
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    payload: { data },
});

/**
 * Add a relationship to an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipObject
 */
export const addRelationshipToResourceObject = (
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iAddRelationshipAction => ({
    type: `${actionNames.ADD_RELATIONSHIP_TO_ENTITY}_${singularCase(
        resourceType
    )}_${pluralCase(relationshipKey)}`,
    payload: { resourceType, resourceId, relationshipKey, relationshipObject },
});

/**
 * Set a relationship on an ResourceObject
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 * @param relationshipId
 */
export const setRelationshipOnResourceObject = (
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iSetRelationshipAction => ({
    type: `${actionNames.SET_RELATIONSHIP_ON_ENTITY}_${singularCase(
        resourceType
    )}_${pluralCase(relationshipKey)}`,
    payload: { resourceType, resourceId, relationshipKey, relationshipObject },
});

/**
 * Remove a relationship from an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipId
 */
export const removeRelationshipFromResourceObject = (
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipId: string
): iRemoveRelationshipAction => ({
    type: `${actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY}_${singularCase(
        resourceType
    )}_${pluralCase(relationshipKey)}`,
    payload: { resourceType, resourceId, relationshipKey, relationshipId },
});

/**
 * Completely remove a relationship from a ResourceObject
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 */
export const clearRelationshipOnResourceObject = (
    resourceType: string,
    resourceId: string,
    relationshipKey: string
): iClearRelationshipAction => ({
    type: `${actionNames.CLEAR_RELATIONSHIP_ON_ENTITY}_${singularCase(
        resourceType
    )}_${pluralCase(relationshipKey)}`,
    payload: { resourceType, resourceId, relationshipKey },
});

/**
 * Update an ResourceObject's attributes
 *
 * @param  resourceType
 * @param  resourceId
 * @param  {Object} data
 */
export const updateResourceObject = (
    resourceType: string,
    resourceId: string,
    data: iAttributes
): iUpdateResourceObjectAction => ({
    type: `${actionNames.UPDATE_ENTITY}_${singularCase(resourceType)}`,
    payload: { resourceType, resourceId, data },
});

/**
 * Update an ResourceObject group's meta data
 *
 * @param  resourceType
 * @param  metaKey
 * @param  value
 */
export const updateResourceObjectsMeta = (
    resourceType: string,
    metaKey: string,
    value: any
): iUpdateResourceObjectsMetaAction => ({
    type: `${actionNames.UPDATE_ENTITIES_META}_${pluralCase(resourceType)}`,
    payload: { resourceType, metaKey, value },
});

/**
 * Update an ResourceObject's meta data
 *
 * @param  resourceType
 * @param  resourceId
 * @param  metaKey
 * @param  value
 */
export const updateResourceObjectMeta = (
    resourceType: string,
    resourceId: string,
    metaKey: string,
    value: any
): iUpdateResourceObjectMetaAction => ({
    type: `${actionNames.UPDATE_ENTITY_META}_${singularCase(resourceType)}`,
    payload: { resourceType, resourceId, metaKey, value },
});

/**
 * Remove a single ResourceObject

 * @param  resourceType
 * @param  resourceId
 */
export const removeResourceObject = (
    resourceType: string,
    resourceId: string
): iRemoveResourceObjectAction => ({
    type: `${actionNames.REMOVE_ENTITY}_${singularCase(resourceType)}`,
    payload: { resourceType, resourceId },
});

/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
export const clearResourceObjectType = (
    resourceType: string
): iClearResourceObjectTypeAction => ({
    type: `${actionNames.CLEAR_ENTITY_TYPE}_${pluralCase(resourceType)}`,
    payload: { resourceType },
});

/**
 * Cache a simplified version of a JSON API query response
 *
 * @param url
 * @param response
 */
export const cacheQuery = (
    url: string,
    response: iJsonApiResponse
): iCacheQueryAction => ({
    type: actionNames.CACHE_QUERY,
    payload: { response, url },
});
