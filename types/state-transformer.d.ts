import { iAttributes, iJsonApiResponse, iResourceObject } from 'ts-json-api';
import { iJasonApiState } from './interfaces/state';
import { FlexiblePayload } from './interfaces/other';
/**
 * Insert an ResourceObject or group of ResourceObjects
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export declare const insertOrUpdateResourceObjects: (state: iJasonApiState, payload: FlexiblePayload) => iJasonApiState;
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
export declare const addRelationshipToResourceObject: (initialState: iJasonApiState, resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iJasonApiState;
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
export declare const removeRelationshipFromResourceObject: (initialState: iJasonApiState, resourceType: string, resourceId: string, relationshipKey: string, relationshipId: string) => iJasonApiState;
/**
 * Set a relationship on an ResourceObject to another ResourceObject or ResourceObjects
 *
 * @param initialState
 * @param resourceType  Type of entity on which to set relationship
 * @param resourceId  ID of entity on which to set relationship
 * @param relationshipKey  Name of the relationship
 * @param relationshipObject  Can be a JsonApiResponse, a Resource Object, or an array of Resource Objects
 */
export declare const setRelationshipOnResourceObject: (initialState: iJasonApiState, resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iJasonApiState;
/**
 * Completely clear a relationship type on an entity
 *
 * @param initialState
 * @param resourceType Type of entity who owns the relationship
 * @param resourceId  Id of entity who owns the relationship
 * @param relationshipKey Name of relationship to clear
 */
export declare const clearRelationshipOnResourceObject: (initialState: iJasonApiState, resourceType: string, resourceId: string, relationshipKey: string) => iJasonApiState;
/**
 * Update an ResourceObject's attributes
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {Object} data
 * @return {Object}
 */
export declare const updateResourceObject: (state: iJasonApiState, resourceTypeOrResourceObject: string | iResourceObject, resourceId?: string | undefined, data?: iAttributes | iResourceObject | undefined) => iJasonApiState;
/**
 * Update the meta data for an ResourceObject group
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export declare const updateResourceObjectsMeta: (state: iJasonApiState, resourceType: string, metaKey: string, value: any) => iJasonApiState;
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
export declare const updateResourceObjectMeta: (state: iJasonApiState, resourceType: string, resourceId: string, metaKey: string | undefined, value: any) => iJasonApiState;
/**
 * Remove a single ResourceObject
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @return {Object}
 */
export declare const removeResourceObject: (state: iJasonApiState, resourceType: string, resourceId: string) => iJasonApiState;
/**
 * Clear all of the ResourceObjects out of an ResourceObject type
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @return {Object}
 */
export declare const clearResourceObjectType: (state: iJasonApiState, resourceType: string) => iJasonApiState;
/**
 * Cache a simplified API response
 *
 * @param state
 * @param url
 * @param response
 */
export declare const cacheQuery: (state: iJasonApiState, key: string, response: iJsonApiResponse) => iJasonApiState;
