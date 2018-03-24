import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';
import { iLoadAction, iAddRelationshipAction, iRemoveRelationshipAction, iSetRelationshipAction, iClearRelationshipAction, iUpdateResourceObjectsMetaAction, iUpdateResourceObjectMetaAction, iUpdateResourceObjectAction, iRemoveResourceObjectAction, iClearResourceObjectTypeAction, iCacheQueryAction } from '../interfaces/actions';
import { FlexiblePayload } from '../interfaces/other';
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export declare const loadJsonApiResourceObjectData: (data: FlexiblePayload) => iLoadAction;
/**
 * Add a relationship to an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipObject
 */
export declare const addRelationshipToResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iAddRelationshipAction;
/**
 * Set a relationship on an ResourceObject
 *
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 * @param relationshipId
 */
export declare const setRelationshipOnResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iSetRelationshipAction;
/**
 * Remove a relationship from an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipId
 */
export declare const removeRelationshipFromResourceObject: (resourceType: string, resourceId: string, relationshipKey: string, relationshipId: string) => iRemoveRelationshipAction;
/**
 * Completely remove a relationship from a ResourceObject
 * @param resourceType
 * @param resourceId
 * @param relationshipKey
 */
export declare const clearRelationshipOnResourceObject: (resourceType: string, resourceId: string, relationshipKey: string) => iClearRelationshipAction;
/**
 * Update an ResourceObject's attributes
 *
 * @param  resourceType
 * @param  resourceId
 * @param  {Object} data
 */
export declare const updateResourceObject: (resourceType: string, resourceId: string, data: iAttributes) => iUpdateResourceObjectAction;
/**
 * Update an ResourceObject group's meta data
 *
 * @param  resourceType
 * @param  metaKey
 * @param  value
 */
export declare const updateResourceObjectsMeta: (resourceType: string, metaKey: string, value: any) => iUpdateResourceObjectsMetaAction;
/**
 * Update an ResourceObject's meta data
 *
 * @param  resourceType
 * @param  resourceId
 * @param  metaKey
 * @param  value
 */
export declare const updateResourceObjectMeta: (resourceType: string, resourceId: string, metaKey: string, value: any) => iUpdateResourceObjectMetaAction;
/**
 * Remove a single ResourceObject

 * @param  resourceType
 * @param  resourceId
 */
export declare const removeResourceObject: (resourceType: string, resourceId: string) => iRemoveResourceObjectAction;
/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
export declare const clearResourceObjectType: (resourceType: string) => iClearResourceObjectTypeAction;
/**
 * Cache a simplified version of a JSON API query response
 *
 * @param url
 * @param response
 */
export declare const cacheQuery: (key: string, response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>) => iCacheQueryAction;
