import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';
import { FlexiblePayload } from '../common-types/other';
import { ActionWithPayload } from '../utils/createAction';
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export declare const loadJsonApiResourceObjectData: (data: FlexiblePayload) => ActionWithPayload<"[JASON API] Load Data", FlexiblePayload>;
/**
 * Add a relationship to an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipObject
 */
export declare const addRelationshipToResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => ActionWithPayload<"[JASON API] Add Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: FlexiblePayload;
}>;
/**
 * Set a relationship on an ResourceObject
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 * @param relationshipId
 */
export declare const setRelationshipOnResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => ActionWithPayload<"[JASON API] Set Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: FlexiblePayload;
}>;
/**
 * Remove a relationship from an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipId
 */
export declare const removeRelationshipFromResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipId: string) => ActionWithPayload<"[JASON API] Remove Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipId: string;
}>;
/**
 * Completely remove a relationship from a ResourceObject
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 */
export declare const clearRelationshipOnResourceObject: (resourceType: string, resourceId: string, relationshipKey: string) => ActionWithPayload<"[JASON API] Clear Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
}>;
/**
 * Update an ResourceObject's attributes
 *
 * @param  resourceType
 * @param  resourceId
 * @param  {Object} data
 */
export declare const updateResourceObject: (resourceType: string, resourceId: string, data: iAttributes) => ActionWithPayload<"[JASON API] Update Resource Object", {
    resourceType: string;
    resourceId: string;
    data: iAttributes;
}>;
/**
 * Update an ResourceObject group's meta data
 *
 * @param  resourceType
 * @param  metaKey
 * @param  value
 */
export declare const updateResourceObjectsMeta: (resourceType: string, metaKey: string, value: any) => ActionWithPayload<"[JASON API] Update Resource Objects Meta", {
    resourceType: string;
    metaKey: string;
    value: any;
}>;
/**
 * Update an ResourceObject's meta data
 *
 * @param  resourceType
 * @param  resourceId
 * @param  metaKey
 * @param  value
 */
export declare const updateResourceObjectMeta: (resourceType: string, resourceId: string, metaKey: string, value: any) => ActionWithPayload<"[JASON API] Update Resource Object Meta", {
    resourceType: string;
    resourceId: string;
    metaKey: string;
    value: any;
}>;
/**
 * Remove a single ResourceObject

 * @param  resourceType
 * @param  resourceId
 */
export declare const removeResourceObject: (resourceType: string, resourceId: string) => ActionWithPayload<"[JASON API] Remove Resource Object", {
    resourceType: string;
    resourceId: string;
}>;
/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
export declare const clearResourceObjectType: (resourceType: string) => ActionWithPayload<"[JASON API] Clear Resource Object Type", {
    resourceType: string;
}>;
/**
 * Cache a simplified version of a JSON API query response
 *
 * @param url
 * @param response
 */
export declare const cacheQuery: (key: string, response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => ActionWithPayload<"[JASON API] Cache Query", {
    key: string;
    response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
}>;
