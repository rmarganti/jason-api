import * as pluralize from 'pluralize';
import * as R from 'ramda';

import * as JsonApi from 'ts-json-api/types/structure';

import { JasonApiState } from './common-types/state';
import { FlexiblePayload } from './common-types/other';

import {
    appendOrConcat,
    ensureArray,
    mapOrOnce,
    reverseMergeDeepLeft,
    simplifyResourceObject,
    simplifyJsonApi,
    unwrapDataProp,
} from './utils/data';

/**
 * Insert an ResourceObject or group of ResourceObjects
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export const insertOrUpdateResourceObjects = (
    state: JasonApiState,
    payload: FlexiblePayload
): JasonApiState => {
    const included: JsonApi.ResourceObjects = R.propOr([], 'included', payload);

    return R.pipe(
        unwrapDataProp,
        ensureArray,
        R.concat(included),
        R.reduce(insertOrUpdateResourceObject, state)
    )(payload);
};

/**
 * Insert a single ResourceObject into the state
 *
 * @param state
 * @param entity
 */
const insertOrUpdateResourceObject = (
    state: JasonApiState = {},
    entity: JsonApi.ResourceObject
): JasonApiState => {
    validateResourceObject(entity);

    if (!entity.id) {
        throw new Error('ResourceObjects must have an id');
    }

    return R.over(
        R.lensPath([pluralize(entity.type), 'byId', entity.id]),
        reverseMergeDeepLeft(entity),
        state
    );
};

/**
 * Ensure that an ResourceObject is well-formed
 *
 * @param  entity
 */
const validateResourceObject = (entity: JsonApi.ResourceObject) => {
    if (!('type' in entity)) {
        throw new Error(
            'JSON API resource objects must have a `type` property'
        );
    }

    if (!('id' in entity)) {
        throw new Error('JSON API resource objects must have an `id` property');
    }
};

/**
 * Insert an ResourceObject into the state and
 * add it as a relationship to another ResourceObject
 *
 * @param initialState
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 * @param relationshipObject  Can be either a valid JSON API object or a string ID
 */
export const addRelationshipToResourceObject = (
    initialState: JasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): JasonApiState => {
    const unwrappedRelationshipObject = unwrapDataProp(relationshipObject);
    const newState = insertOrUpdateResourceObjects(
        initialState,
        unwrappedRelationshipObject
    );

    const pluralResourceObjectKey = pluralize(resourceType);
    const simplifiedResourceObjects = mapOrOnce(
        simplifyResourceObject,
        unwrappedRelationshipObject
    );

    return R.over(
        R.lensPath([
            pluralResourceObjectKey,
            'byId',
            resourceId,
            'relationships',
            relationshipKey,
            'data',
        ]),
        appendOrConcat(simplifiedResourceObjects),
        newState
    );
};

/**
 * Remove a relationship an ResourceObject
 *
 * @param  initialState
 * @param  resourceType  Type of entity on which to set relationship
 * @param  resourceId  ID of entity on which to set relationship
 * @param  relationshipKey  Name of the relationship
 * @param  relationshipId  Id of the relationship object
 */
export const removeRelationshipFromResourceObject = (
    initialState: JasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipId: string
): JasonApiState => {
    const pluralResourceObjectKey = pluralize(resourceType);

    return R.over(
        R.lensPath([
            pluralResourceObjectKey,
            'byId',
            resourceId,
            'relationships',
            relationshipKey,
            'data',
        ]),
        R.reject(R.propEq('id', relationshipId)),
        initialState
    );
};

/**
 * Set a relationship on an ResourceObject to another ResourceObject or ResourceObjects
 *
 * @param initialState
 * @param resourceType  Type of entity on which to set relationship
 * @param resourceId  ID of entity on which to set relationship
 * @param relationshipKey  Name of the relationship
 * @param relationshipObject  Can be a JsonApResponse, a Resource Object, or an array of Resource Objects
 */
export const setRelationshipOnResourceObject = (
    initialState: JasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): JasonApiState => {
    const unwrappedRelationshipObject = unwrapDataProp(relationshipObject);
    const newState = insertOrUpdateResourceObjects(
        initialState,
        unwrappedRelationshipObject
    );
    const pluralResourceObjectKey = pluralize(resourceType);

    return R.set(
        R.lensPath([
            pluralResourceObjectKey,
            'byId',
            resourceId,
            'relationships',
            relationshipKey,
            'data',
        ]),
        mapOrOnce(simplifyResourceObject, unwrappedRelationshipObject),
        newState
    );
};

/**
 * Completely clear a relationship type on an entity
 *
 * @param initialState
 * @param resourceType Type of entity who owns the relationship
 * @param resourceId  Id of entity who owns the relationship
 * @param relationshipKey Name of relationship to clear
 */
export const clearRelationshipOnResourceObject = (
    initialState: JasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string
): JasonApiState => {
    const pluralResourceObjectKey = pluralize(resourceType);

    return R.dissocPath(
        [
            pluralResourceObjectKey,
            'byId',
            resourceId,
            'relationships',
            relationshipKey,
        ],
        initialState
    );
};

/**
 * Update an ResourceObject's attributes
 *
 * @param  state
 * @param  resourceType
 * @param  resourceId
 * @param  data
 */
export const updateResourceObject = (
    state: JasonApiState,
    resourceTypeOrResourceObject: string | JsonApi.ResourceObject,
    resourceId?: string,
    data?: JsonApi.ResourceObject | JsonApi.Attributes
) => {
    if (
        R.has('type', resourceTypeOrResourceObject) &&
        R.has('id', resourceTypeOrResourceObject)
    ) {
        return insertOrUpdateResourceObject(
            state,
            <JsonApi.ResourceObject>resourceTypeOrResourceObject
        );
    }

    if(!resourceId) {
        throw new Error('`resourceId` must be defined.');
    }

    if (!data) {
        throw new Error('`data` must be defined.');
    }

    return R.over(
        R.lensPath([
            pluralize(<string>resourceTypeOrResourceObject),
            'byId',
            resourceId,
            'attributes',
        ]),
        reverseMergeDeepLeft(data),
        state
    );
};

/**
 * Update the meta data for an ResourceObject group
 *
 * @param  state
 * @param  resourceType
 * @param  metaKey
 * @param  value
 */
export const updateResourceObjectsMeta = (
    state: JasonApiState,
    resourceType: string,
    metaKey: string,
    value: any
): JasonApiState => {
    const pluralKey = pluralize(resourceType);
    return metaKey
        ? R.assocPath([pluralKey, 'meta', metaKey], value, state)
        : R.assocPath([pluralKey, 'meta'], value, state);
};

/**
 * Update the meta data for an ResourceObject
 *
 * @param  state
 * @param  resourceType
 * @param  resourceId
 * @param  metaKey
 * @param  value
 */
export const updateResourceObjectMeta = (
    state: JasonApiState,
    resourceType: string,
    resourceId: string,
    metaKey: string | undefined,
    value: any
): JasonApiState => {
    const pluralKey = pluralize(resourceType);
    return metaKey
        ? R.assocPath(
              [pluralKey, 'byId', resourceId, 'meta', metaKey],
              value,
              state
          )
        : R.assocPath([pluralKey, 'byId', resourceId, 'meta'], value, state);
};

/**
 * Remove a single ResourceObject
 *
 * @param  state
 * @param  resourceType
 * @param  resourceId
 */
export const removeResourceObject = (
    state: JasonApiState,
    resourceType: string,
    resourceId: string
): JasonApiState => {
    const pluralKey = pluralize(resourceType);
    return R.dissocPath([pluralKey, 'byId', resourceId], state);
};

/**
 * Clear all of the ResourceObjects out of an ResourceObject type
 *
 * @param  state
 * @param  resourceType
 */
export const clearResourceObjectType = (
    state: JasonApiState,
    resourceType: string
): JasonApiState => {
    const pluralKey = pluralize(resourceType);
    return R.dissoc(pluralKey, state);
};

/**
 * Cache a simplified API response
 *
 * @param state
 * @param url
 * @param response
 */
export const cacheQuery = (
    state: JasonApiState,
    key: string,
    response: JsonApi.Response
): JasonApiState => {
    return R.set(
        R.lensPath(['_cachedQueries', key]),
        simplifyJsonApi(response),
        state
    );
};
