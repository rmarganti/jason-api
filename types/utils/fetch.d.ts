import 'isomorphic-fetch';
/**
 * Make a GET request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
export declare const get: (url: string, additionalHeaders?: {}) => Promise<any>;
/**
 * Make a POST request
 *
 * @param  url
 * @param  request
 * @param  additionalHeaders
 */
export declare const post: (url: string, body: object | FormData, additionalHeaders?: {}) => Promise<any>;
/**
 * Make a PATCH request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
export declare const patch: (url: string, body: object | FormData, additionalHeaders?: {}) => Promise<any>;
/**
 * Make a DELETE request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
export declare const destroy: (url: string, body: object | FormData, additionalHeaders?: {}) => Promise<any>;
export declare const request: (method: "get" | "post" | "patch" | "destroy", url: string, body: object | FormData, additionalHeaders?: {}) => any;
