import * as pluralize from 'pluralize';
import * as R from 'ramda';

import { iAttributes, iResponse, iResourceObject } from 'ts-json-api';

import { iJasonApiState } from './interfaces/state';
import { FlexiblePayload } from './interfaces/other';

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
    state: iJasonApiState,
    payload: FlexiblePayload
): iJasonApiState => {
    const included: iResourceObject[] = R.propOr([], 'included', payload);

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
    state: iJasonApiState = {},
    entity: iResourceObject
): iJasonApiState => {
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
 * @param  {Object} entity
 */
const validateResourceObject = (entity: iResourceObject) => {
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
 * @param  {Object}         initialState
 * @param  {String}         resourceType
 * @param  {String}         resourceId
 * @param  {String}         relationshipKey
 * @param  {Object|String}  relationshipObject  Can be either a valid JSON API object or a string ID
 * @return {Object}
 */
export const addRelationshipToResourceObject = (
    initialState: iJasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iJasonApiState => {
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
 * @return {Object}
 */
export const removeRelationshipFromResourceObject = (
    initialState: iJasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipId: string
): iJasonApiState => {
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
 * @param relationshipObject  Can be a JsonApiResponse, a Resource Object, or an array of Resource Objects
 */
export const setRelationshipOnResourceObject = (
    initialState: iJasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iJasonApiState => {
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
    initialState: iJasonApiState,
    resourceType: string,
    resourceId: string,
    relationshipKey: string
): iJasonApiState => {
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
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {Object} data
 * @return {Object}
 */
export const updateResourceObject = (
    state: iJasonApiState,
    resourceTypeOrResourceObject: string | iResourceObject,
    resourceId?: string,
    data?: iResourceObject | iAttributes
) => {
    if (
        R.has('type', resourceTypeOrResourceObject) &&
        R.has('id', resourceTypeOrResourceObject)
    ) {
        return insertOrUpdateResourceObject(
            state,
            <iResourceObject>resourceTypeOrResourceObject
        );
    }

    if (!resourceId) {
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
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateResourceObjectsMeta = (
    state: iJasonApiState,
    resourceType: string,
    metaKey: string,
    value: any
): iJasonApiState => {
    const pluralKey = pluralize(resourceType);
    return metaKey
        ? R.assocPath([pluralKey, 'meta', metaKey], value, state)
        : R.assocPath([pluralKey, 'meta'], value, state);
};

/**
 * Update the meta data for an ResourceObject
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateResourceObjectMeta = (
    state: iJasonApiState,
    resourceType: string,
    resourceId: string,
    metaKey: string | undefined,
    value: any
): iJasonApiState => {
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
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @return {Object}
 */
export const removeResourceObject = (
    state: iJasonApiState,
    resourceType: string,
    resourceId: string
): iJasonApiState => {
    const pluralKey = pluralize(resourceType);
    return R.dissocPath([pluralKey, 'byId', resourceId], state);
};

/**
 * Clear all of the ResourceObjects out of an ResourceObject type
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @return {Object}
 */
export const clearResourceObjectType = (
    state: iJasonApiState,
    resourceType: string
): iJasonApiState => {
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
    state: iJasonApiState,
    key: string,
    response: iResponse
): iJasonApiState => {
    return R.set(
        R.lensPath(['_cachedQueries', key]),
        simplifyJsonApi(response),
        state
    );
};
