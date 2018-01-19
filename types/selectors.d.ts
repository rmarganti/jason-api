import { iResourceObject } from 'ts-json-api';
import { iState } from './interfaces/state';
/**
 * Grab an Resource Object from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export declare const getResourceObject: (state: iState, key: string, id: string) => iResourceObject;
/**
 * Get an array of Resource Objects from the state
 */
export declare const getResourceObjects: (state: iState, key: string, ids?: string[]) => iResourceObject[];
/**
 * Grab an Resource Object group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getResourceObjectsMeta: (state: iState, resourceType: string, metaKey?: string) => {};
/**
 * Grab an Resource Object's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} resourceId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getResourceObjectMeta: (state: iState, resourceType: string, resourceId: string, metaKey?: string) => {};
/**
 * Get a cached Query
 *
 * @param state
 * @param url
 */
export declare const getCachedQuery: (state: iState, url: string) => {};
