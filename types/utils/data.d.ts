/// <reference types="ramda" />
/**
 * Ensure the given value is an array. If not, return it as a single-item array
 *
 * @param value
 */
export declare const ensureArray: (value: any) => any[];
/**
 * Ramda's mergeDeepRight with paramater order flipped
 */
export declare const reverseMergeDeepLeft: (arg1: {}, arg0?: any) => <B>(b: B) => any;
/**
 * Remove an object's wrapping `data` prop, if it exists
 */
export declare const unwrapDataProp: (a: any) => any;
/**
 * Apply a function in a map if the given data is an array.
 * Otherwise, simply apply it once to the data
 *
 * @param func Function to perform
 */
export declare const mapOrOnce: (...a: any[]) => any;
/**
 * If the given data is an array, concat it.
 * If it is a single item, append it.
 */
export declare const appendOrConcat: (a: any) => any;
/**
 * Simplify a single Resource Object
 * to only its type and ID
 *
 * Object -> Object
 */
export declare const simplifyResourceObject: (a: any) => any;
/**
 * Simplifiy a single Resource Object or array of
 * Resource Objects to only its/their ID/ID's
 *
 * a -> a
 */
export declare const simplifyResourceObjects: any;
/**
 * Give a JSON API Response, simplify the Resource Objects
 * and strip any additional `included` Resource Objects
 *
 * Object -> Object
 */
export declare const simplifyJsonApi: (x0: {}) => {};
/**
 * Generate a unique hash from any javascript object
 *
 * @param object
 */
export declare const hashObject: (object: any) => string;
