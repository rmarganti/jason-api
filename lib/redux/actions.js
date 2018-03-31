"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const createAction_1 = require("../utils/createAction");
const actionTypes = require("./actionTypes");
const singularCase = (input) => pluralize(input, 1).toUpperCase();
const pluralCase = (input) => pluralize(input).toUpperCase();
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
exports.loadJsonApiResourceObjectData = (data) => createAction_1.createAction(actionTypes.LOAD_DATA, data);
/**
 * Add a relationship to an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipObject
 */
exports.addRelationshipToResourceObject = (resourceType, resourceId, relationshipKey, relationshipObject) => createAction_1.createAction(actionTypes.ADD_RELATIONSHIP, {
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
exports.setRelationshipOnResourceObject = (resourceType, resourceId, relationshipKey, relationshipObject) => createAction_1.createAction(actionTypes.SET_RELATIONSHIP, {
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
exports.removeRelationshipFromResourceObject = (resourceType, resourceId, relationshipKey, relationshipId) => createAction_1.createAction(actionTypes.REMOVE_RELATIONSHIP, {
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
exports.clearRelationshipOnResourceObject = (resourceType, resourceId, relationshipKey) => createAction_1.createAction(actionTypes.CLEAR_RELATIONSHIP, {
    resourceType,
    resourceId,
    relationshipKey,
});
/**
 * Update an ResourceObject's attributes
 *
 * @param  resourceType
 * @param  resourceId
 * @param  {Object} data
 */
exports.updateResourceObject = (resourceType, resourceId, data) => createAction_1.createAction(actionTypes.UPDATE_RESOURCE_OBJECT, {
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
exports.updateResourceObjectsMeta = (resourceType, metaKey, value) => createAction_1.createAction(actionTypes.UPDATE_RESOURCE_OBJECTS_META, {
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
exports.updateResourceObjectMeta = (resourceType, resourceId, metaKey, value) => createAction_1.createAction(actionTypes.UPDATE_RESOURCE_OBJECT_META, {
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
exports.removeResourceObject = (resourceType, resourceId) => createAction_1.createAction(actionTypes.REMOVE_RESOURCE_OBJECT, {
    resourceType,
    resourceId,
});
/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
exports.clearResourceObjectType = (resourceType) => createAction_1.createAction(actionTypes.CLEAR_RESOURCE_OBJECT_TYPE, {
    resourceType,
});
/**
 * Cache a simplified version of a JSON API query response
 *
 * @param url
 * @param response
 */
exports.cacheQuery = (key, response) => createAction_1.createAction(actionTypes.CACHE_QUERY, { key, response });
//# sourceMappingURL=actions.js.map