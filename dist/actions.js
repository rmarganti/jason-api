"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const action_names_1 = require("./action-names");
const singularize = (input) => pluralize(input, 1);
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
exports.loadJsonApiResourceObjectData = (data) => ({
    type: action_names_1.default.LOAD_JSON_API_ENTITY_DATA,
    data,
});
/**
 * Add a relationship to an ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 * @param  relationshipKey
 * @param  relationshipObject
 */
exports.addRelationshipToResourceObject = (resourceType, resourceId, relationshipKey, relationshipObject) => ({
    type: `${action_names_1.default.ADD_RELATIONSHIP_TO_ENTITY}_${singularize(resourceType).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
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
exports.setRelationshipOnResourceObject = (resourceType, resourceId, relationshipKey, relationshipObject) => ({
    type: `${action_names_1.default.SET_RELATIONSHIP_ON_ENTITY}_${singularize(resourceType).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
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
exports.removeRelationshipFromResourceObject = (resourceType, resourceId, relationshipKey, relationshipId) => ({
    type: `${action_names_1.default.REMOVE_RELATIONSHIP_FROM_ENTITY}_${singularize(resourceType).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    resourceType,
    resourceId,
    relationshipKey,
    relationshipId,
});
exports.clearRelationshipOnResourceObject = (resourceType, resourceId, relationshipKey) => ({
    type: `${action_names_1.default.CLEAR_RELATIONSHIP_ON_ENTITY}_${singularize(resourceType).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
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
exports.updateResourceObject = (resourceType, resourceId, data) => ({
    type: `${action_names_1.default.UPDATE_ENTITY}_${singularize(resourceType).toUpperCase()}`,
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
exports.updateResourceObjectsMeta = (resourceType, metaKey, value) => ({
    type: `${action_names_1.default.UPDATE_ENTITIES_META}_${pluralize(resourceType).toUpperCase()}`,
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
exports.updateResourceObjectMeta = (resourceType, resourceId, metaKey, value) => ({
    type: `${action_names_1.default.UPDATE_ENTITY_META}_${singularize(resourceType).toUpperCase()}`,
    resourceType,
    resourceId,
    metaKey,
    value,
});
/**
 * Remove a single ResourceObject
 *
 * @param  resourceType
 * @param  resourceId
 */
exports.removeResourceObject = (resourceType, resourceId) => ({
    type: `${action_names_1.default.REMOVE_ENTITY}_${singularize(resourceType).toUpperCase()}`,
    resourceType,
    resourceId,
});
/**
 * Clear all the ResourceObjects from an ResourceObject type
 *
 * @param  resourceType
 */
exports.clearResourceObjectType = (resourceType) => ({
    type: `${action_names_1.default.CLEAR_ENTITY_TYPE}_${pluralize(resourceType).toUpperCase()}`,
    resourceType,
});
//# sourceMappingURL=actions.js.map