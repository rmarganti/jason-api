import * as pluralize from 'pluralize';
import { Attributes, Links, Relationships, Response } from 'ts-json-api';

import { FlexiblePayload } from '../common-types/other';
import { Action, ActionWithPayload, createAction } from '../utils/createAction';
import * as actionTypes from './actionTypes';

const singularCase = (input: string) => pluralize(input, 1).toUpperCase();
const pluralCase = (input: string) => pluralize(input).toUpperCase();

/**
 * Load a JSON API response into the state
 *
 * @param data
 */
export const loadJsonApiResourceObjectData = (data: FlexiblePayload) =>
    createAction(actionTypes.LOAD_DATA, data);

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
) =>
    createAction(actionTypes.ADD_RELATIONSHIP, {
        resourceType,
        resourceId,
        relationshipKey,
        relationshipObject,
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
) =>
    createAction(actionTypes.SET_RELATIONSHIP, {
        resourceType,
        resourceId,
        relationshipKey,
        relationshipObject,
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
) =>
    createAction(actionTypes.REMOVE_RELATIONSHIP, {
        resourceType,
        resourceId,
        relationshipKey,
        relationshipId,
    });

/**
 * Completely remove a relationship from a ResourceObject
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 */
export const clearRelationshipOnResourceObject = (
    resourceType: string,
    resourceId: string,
    relationshipKey: string
) =>
    createAction(actionTypes.CLEAR_RELATIONSHIP, {
        resourceType,
        resourceId,
        relationshipKey,
    });

/**
 * Update an ResourceObject's attributes
 *
 * @param  resourceType
 * @param  resourceId
 * @param  data
 */
export const updateResourceObject = (
    resourceType: string,
    resourceId: string,
    data: Attributes
) =>
    createAction(actionTypes.UPDATE_RESOURCE_OBJECT, {
        resourceType,
        resourceId,
        data,
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
) =>
    createAction(actionTypes.UPDATE_RESOURCE_OBJECTS_META, {
        resourceType,
        metaKey,
        value,
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
) =>
    createAction(actionTypes.UPDATE_RESOURCE_OBJECT_META, {
        resourceType,
        resourceId,
        metaKey,
        value,
    });

/**
 * Remove a single ResourceObject

 * @param  resourceType
 * @param  resourceId
 */
export const removeResourceObject = (
    resourceType: string,
    resourceId: string
) =>
    createAction(actionTypes.REMOVE_RESOURCE_OBJECT, {
        resourceType,
        resourceId,
    });

/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
export const clearResourceObjectType = (resourceType: string) =>
    createAction(actionTypes.CLEAR_RESOURCE_OBJECT_TYPE, {
        resourceType,
    });

/**
 * Cache a simplified version of a JSON API query response
 *
 * @param url
 * @param response
 */
export const cacheQuery = (key: string, response: Response) =>
    createAction(actionTypes.CACHE_QUERY, { key, response });
