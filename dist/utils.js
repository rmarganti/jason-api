"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
/**
 * Ensure the given value is an array. If not, return it as a single-item array
 *
 * @param value
 */
exports.ensureArray = (value) => Array.isArray(value) ? value : [value];
/**
 * Ramda's mergeDeepRight with paramater order flipped
 */
exports.reverseMergeDeepLeft = ramda_1.flip(ramda_1.mergeDeepRight);
/**
 * Remove an object's wrapping `data` prop, if it exists
 */
exports.unwrapDataProp = ramda_1.ifElse(ramda_1.has('data'), ramda_1.prop('data'), ramda_1.identity);
/**
 * Apply a function in a map if the given data is an array.
 * Otherwise, simply apply it once to the data
 *
 * @param func Function to perform
 */
exports.mapOrOnce = ramda_1.curryN(2, (func, value) => ramda_1.ifElse(Array.isArray, ramda_1.map(func), func)(value));
/**
 * If the given data is an array, concat it.
 * If it is a single item, append it.
 */
exports.appendOrConcat = ramda_1.ifElse(Array.isArray, ramda_1.concat, ramda_1.append);
/**
 * Simplify a single Resource Object
 * to only its type and ID
 *
 * Object -> Object
 */
exports.simplifyResourceObject = ramda_1.pick(['type', 'id']);
/**
 * Simplifiy a single Resource Object or array of
 * Resource Objects to only its/their ID/ID's
 *
 * a -> a
 */
exports.simplifyResourceObjects = exports.mapOrOnce(exports.simplifyResourceObject);
/**
 * Give a JSON API Response, simplify the Resource Objects
 * and strip any additional `included` Resource Objects
 *
 * Object -> Object
 */
exports.simplifyJsonApi = ramda_1.pipe(ramda_1.over(ramda_1.lensProp('data'), exports.simplifyResourceObjects), ramda_1.omit(['included']));
//# sourceMappingURL=utils.js.map