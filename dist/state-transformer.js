"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const R = require("ramda");
const utils_1 = require("./utils");
/**
 * Insert an ResourceObject or group of ResourceObjects
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
exports.insertOrUpdateResourceObjects = (state, payload) => {
    const included = R.propOr([], 'included', payload);
    return R.pipe(utils_1.unwrapDataProp, utils_1.ensureArray, R.concat(included), R.reduce(insertOrUpdateResourceObject, state))(payload);
};
/**
 * Insert a single ResourceObject into the state
 *
 * @param state
 * @param entity
 */
const insertOrUpdateResourceObject = (state = {}, entity) => {
    validateResourceObject(entity);
    return R.over(R.lensPath([pluralize(entity.type), 'byId', entity.id]), utils_1.reverseMergeDeepLeft(entity), state);
};
/**
 * Ensure that an ResourceObject is well-formed
 *
 * @param  {Object} entity
 */
const validateResourceObject = (entity) => {
    if (!('type' in entity)) {
        throw new Error('JSON API resource objects must have a `type` property');
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
exports.addRelationshipToResourceObject = (initialState, resourceType, resourceId, relationshipKey, relationshipObject) => {
    const unwrappedRelationshipObject = utils_1.unwrapDataProp(relationshipObject);
    const newState = exports.insertOrUpdateResourceObjects(initialState, unwrappedRelationshipObject);
    const pluralResourceObjectKey = pluralize(resourceType);
    const simplifiedResourceObjects = utils_1.mapOrOnce(utils_1.simplifyResourceObject, unwrappedRelationshipObject);
    return R.over(R.lensPath([
        pluralResourceObjectKey,
        'byId',
        resourceId,
        'relationships',
        relationshipKey,
        'data',
    ]), utils_1.appendOrConcat(simplifiedResourceObjects), newState);
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
exports.removeRelationshipFromResourceObject = (initialState, resourceType, resourceId, relationshipKey, relationshipId) => {
    const pluralResourceObjectKey = pluralize(resourceType);
    return R.over(R.lensPath([
        pluralResourceObjectKey,
        'byId',
        resourceId,
        'relationships',
        relationshipKey,
        'data',
    ]), R.reject(R.propEq('id', relationshipId)), initialState);
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
exports.setRelationshipOnResourceObject = (initialState, resourceType, resourceId, relationshipKey, relationshipObject) => {
    const unwrappedRelationshipObject = utils_1.unwrapDataProp(relationshipObject);
    const newState = exports.insertOrUpdateResourceObjects(initialState, unwrappedRelationshipObject);
    const pluralResourceObjectKey = pluralize(resourceType);
    return R.set(R.lensPath([
        pluralResourceObjectKey,
        'byId',
        resourceId,
        'relationships',
        relationshipKey,
        'data',
    ]), utils_1.mapOrOnce(utils_1.simplifyResourceObject, unwrappedRelationshipObject), newState);
};
/**
 * Completely clear a relationship type on an entity
 *
 * @param initialState
 * @param resourceType Type of entity who owns the relationship
 * @param resourceId  Id of entity who owns the relationship
 * @param relationshipKey Name of relationship to clear
 */
exports.clearRelationshipOnResourceObject = (initialState, resourceType, resourceId, relationshipKey) => {
    const pluralResourceObjectKey = pluralize(resourceType);
    return R.dissocPath([
        pluralResourceObjectKey,
        'byId',
        resourceId,
        'relationships',
        relationshipKey,
    ], initialState);
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
exports.updateResourceObject = (state, resourceTypeOrResourceObject, resourceId, data) => {
    if (R.has('type', resourceTypeOrResourceObject) &&
        R.has('id', resourceTypeOrResourceObject)) {
        return insertOrUpdateResourceObject(state, resourceTypeOrResourceObject);
    }
    return R.over(R.lensPath([
        pluralize(resourceTypeOrResourceObject),
        'byId',
        resourceId,
        'attributes',
    ]), utils_1.reverseMergeDeepLeft(data), state);
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
exports.updateResourceObjectsMeta = (state, resourceType, metaKey, value) => {
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
exports.updateResourceObjectMeta = (state, resourceType, resourceId, metaKey, value) => {
    const pluralKey = pluralize(resourceType);
    return metaKey
        ? R.assocPath([pluralKey, 'byId', resourceId, 'meta', metaKey], value, state)
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
exports.removeResourceObject = (state, resourceType, resourceId) => {
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
exports.clearResourceObjectType = (state, resourceType) => {
    const pluralKey = pluralize(resourceType);
    return R.dissoc(pluralKey, state);
};
//# sourceMappingURL=state-transformer.js.map