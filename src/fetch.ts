import {} from 'isomorphic-fetch';
import { iJsonApiResponse } from 'ts-json-api';

interface iRequest {
    method: string;
    body?: any;
    credentials?: RequestCredentials;
    headers: {
        [index: string]: string;
    };
}

interface iError extends Error {
    response?: Response;
}

const isFunction = (fn: (...args: any[]) => any) =>
    fn && Object.prototype.toString.call(fn) === '[object Function]';

/**
 * Make a GET request
 *
 * @param  {String} url
 * @param  {Object} request
 * @param  {Object} additionalHeaders
 */
export const get = (url: string, additionalHeaders = {}) =>
    goFetch(url, { method: 'GET', headers: additionalHeaders });

/**
 * Make a POST request
 *
 * @param  url
 * @param  request
 * @param  additionalHeaders
 */
export const post = (
    url: string,
    body: FormData | object,
    additionalHeaders = {}
) =>
    goFetch(url, {
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
export const patch = (
    url: string,
    body: FormData | object,
    additionalHeaders = {}
) =>
    goFetch(url, {
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
export const destroy = (
    url: string,
    body: FormData | object,
    additionalHeaders = {}
) =>
    goFetch(url, {
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
const goFetch = async (url: string, request: iRequest) => {
    const headers = {
        Accept: 'application/vnd.api+json',
        ...request.headers,
    };

    const updatedRequest = {
        ...request,
        method: request.method || 'GET',
        credentials: request.credentials || 'include',
        headers:
            request.body && request.body instanceof FormData
                ? headers
                : { ...headers, 'Content-Type': 'application/json' },
    };

    try {
        const response = await fetch(url, updatedRequest);
        checkStatus(response);
        return parseResponse(response);
    } catch (e) {
        handleError(e);
    }
};

/**
 * Check the Response for server errors
 *
 * @param  {Response} response
 * @return {Response}
 * @throws {Error}
 */
const checkStatus = (response: Response) => {
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
const parseResponse = (response: Response) => {
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
const handleError = (error: Response | TypeError) => {
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

const methodMap: {
    [index: string]: (...args: any[]) => Promise<any>;
} = {
    get,
    post,
    patch,
    destroy,
};

export const request = (
    method: 'get' | 'post' | 'patch' | 'destroy',
    url: string,
    body: FormData | object,
    additionalHeaders = {}
) => {
    return method === 'get'
        ? methodMap['get'].call(this, url, additionalHeaders)
        : methodMap[method].call(this, url, body, additionalHeaders);
};
