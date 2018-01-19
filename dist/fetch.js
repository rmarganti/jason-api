"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const isFunction = (fn) => fn && Object.prototype.toString.call(fn) === '[object Function]';
/**
 * Make a GET request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
exports.get = (url, additionalHeaders = {}) => goFetch(url, { method: 'GET', headers: additionalHeaders });
/**
 * Make a POST request
 *
 * @param  url
 * @param  request
 * @param  additionalHeaders
 */
exports.post = (url, body, additionalHeaders = {}) => goFetch(url, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
    headers: additionalHeaders,
});
/**
 * Make a PATCH request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
exports.patch = (url, body, additionalHeaders = {}) => goFetch(url, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body),
    headers: additionalHeaders,
});
/**
 * Make a DELETE request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
exports.destroy = (url, body, additionalHeaders = {}) => goFetch(url, {
    method: 'DELETE',
    body: body instanceof FormData ? body : JSON.stringify(body),
    headers: additionalHeaders,
});
/**
 * Make an API request
 *
 * @param  {String} url
 * @param  {Object} request
 */
const goFetch = (url, request) => __awaiter(this, void 0, void 0, function* () {
    const headers = Object.assign({ Accept: 'application/vnd.api+json' }, request.headers);
    const updatedRequest = Object.assign({}, request, { method: request.method || 'GET', credentials: request.credentials || 'include', headers: request.body && request.body instanceof FormData
            ? headers
            : Object.assign({}, headers, { 'Content-Type': 'application/json' }) });
    try {
        const response = yield fetch(url, updatedRequest);
        checkStatus(response);
        return parseResponse(response);
    }
    catch (e) {
        handleError(e);
    }
});
/**
 * Check the Response for server errors
 *
 * @param  {Response} response
 * @return {Response}
 * @throws {Error}
 */
const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return;
    }
    throw response;
};
/**
 * Parse the reponse into JSON
 *
 * @param  {Response} response
 * @return {Object|null}
 */
const parseResponse = (response) => {
    if (response.status === 204) {
        return null;
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.match(/json/i)) {
        return response.json();
    }
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition && contentDisposition.match(/attachment/i)) {
        return response.blob();
    }
    return response.text();
};
/**
 * Handle any Error that gets thrown, parsing JSON as necessary
 *
 * @param error
 */
const handleError = (error) => {
    if (error instanceof TypeError) {
        throw [
            {
                status: 500,
                details: error.message,
            },
        ];
    }
    error.json().then(json => {
        throw json;
    });
};
const methodMap = {
    get: exports.get,
    post: exports.post,
    patch: exports.patch,
    destroy: exports.destroy,
};
exports.request = (method, url, body, additionalHeaders = {}) => {
    return method === 'get'
        ? methodMap['get'].call(this, url, additionalHeaders)
        : methodMap[method].call(this, url, body, additionalHeaders);
};
//# sourceMappingURL=fetch.js.map