import { iAttributes, iResourceObject } from 'ts-json-api';
import { iJasonApiState } from '../interfaces/state';
/**
 * Grab an Resource Object from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export declare const getResourceObject: (state: iJasonApiState, key: string, id: string) => iResourceObject<string, iAttributes>;
/**
 * Get an array of Resource Objects from the state
 */
export declare const getResourceObjects: (state: iJasonApiState, key: string, ids?: string[] | null) => iResourceObject<string, iAttributes>[];
/**
 * Grab an Resource Object group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getResourceObjectsMeta: (state: iJasonApiState, resourceType: string, metaKey?: string | null) => {};
/**
 * Grab an Resource Object's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getResourceObjectMeta: (state: iJasonApiState, resourceType: string, resourceId: string, metaKey?: string | null) => {};
/**
 * Get a cached Query
 *
 * @param state
 * @param url
 */
export declare const getCachedQuery: (state: iJasonApiState, key: string) => {};
