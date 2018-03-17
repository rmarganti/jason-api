import {
    append,
    compose,
    concat,
    curry,
    curryN,
    evolve,
    ifElse,
    flip,
    has,
    identity,
    lensProp,
    map,
    mergeDeepRight,
    omit,
    over,
    pick,
    pipe,
    prop,
} from 'ramda';
import { isUndefined } from 'util';

/**
 * Ensure the given value is an array. If not, return it as a single-item array
 *
 * @param value
 */
export const ensureArray = (value: any) =>
    Array.isArray(value) ? value : [value];

/**
 * Ramda's mergeDeepRight with paramater order flipped
 */
export const reverseMergeDeepLeft = flip(mergeDeepRight);

/**
 * Remove an object's wrapping `data` prop, if it exists
 */
export const unwrapDataProp = ifElse(has('data'), prop('data'), identity);

/**
 * Apply a function in a map if the given data is an array.
 * Otherwise, simply apply it once to the data
 *
 * @param func Function to perform
 */
export const mapOrOnce = curryN(2, (func: (input: any) => any, value: any) =>
    ifElse(Array.isArray, map(func), func)(value)
);

/**
 * If the given data is an array, concat it.
 * If it is a single item, append it.
 */
export const appendOrConcat = ifElse(Array.isArray, concat, append);

/**
 * Simplify a single Resource Object
 * to only its type and ID
 *
 * Object -> Object
 */
export const simplifyResourceObject = ifElse(
    isUndefined,
    identity,
    pick(['type', 'id'])
);

/**
 * Simplifiy a single Resource Object or array of
 * Resource Objects to only its/their ID/ID's
 *
 * a -> a
 */
export const simplifyResourceObjects = mapOrOnce(simplifyResourceObject);

/**
 * Give a JSON API Response, simplify the Resource Objects
 * and strip any additional `included` Resource Objects
 *
 * Object -> Object
 */
export const simplifyJsonApi = pipe(
    over(lensProp('data'), simplifyResourceObjects),
    omit(['included'])
);

/**
 * Generate a unique hash from any javascript object
 *
 * @param object
 */
export const hashObject = (object: any): string => {
    const stringified = JSON.stringify(
        object,
        (key, value) => (typeof value === 'function' ? value.toString() : value)
    );

    var hash = 0,
        i,
        chr;

    if (stringified.length === 0) return hash.toString();

    for (i = 0; i < stringified.length; i++) {
        chr = stringified.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash.toString();
};
