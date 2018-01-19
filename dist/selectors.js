"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const R = require("ramda");
/**
 * Grab an Resource Object from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
exports.getResourceObject = (state, key, id) => {
    const pluralKey = pluralize(key);
    return R.path([pluralKey, 'byId', id], state);
};
/**
 * Get an array of Resource Objects from the state
 */
exports.getResourceObjects = (state, key, ids = null) => {
    const pluralKey = pluralize(key);
    if (ids === null) {
        return R.pipe(R.pathOr({}, [pluralKey, 'byId']), R.values)(state);
    }
    const isUndefined = (value) => typeof value === 'undefined';
    return R.pipe(R.pathOr({}, [key, 'byId']), R.props(ids), R.reject(isUndefined))(state);
};
/**
 * Grab an Resource Object group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @return {Mixed}
 */
exports.getResourceObjectsMeta = (state, resourceType, metaKey = null) => metaKey === null
    ? R.path([resourceType, 'meta'], state)
    : R.path([resourceType, 'meta', metaKey], state);
/**
 * Grab an Resource Object's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} metaKey
 * @return {Mixed}
 */
exports.getResourceObjectMeta = (state, resourceType, resourceId, metaKey = null) => metaKey === null
    ? R.path([resourceType, 'byId', resourceId, 'meta'], state)
    : R.path([resourceType, 'byId', resourceId, 'meta', metaKey], state);
/**
 * Get a cached Query
 *
 * @param state
 * @param url
 */
exports.getCachedQuery = (state, url) => R.path(['_cachedQueries', url], state);
//# sourceMappingURL=selectors.js.map