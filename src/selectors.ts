import * as pluralize from 'pluralize';
import * as R from 'ramda';
import {
    iAttributes,
    iResourceObject,
    JsonApiResponse,
    iJsonApiResponseWithData,
} from 'ts-json-api';

import { iJasonApiState } from './interfaces/state';

/**
 * Grab an Resource Object from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export const getResourceObject = (
    state: iJasonApiState,
    key: string,
    id: string
) => {
    const pluralKey = pluralize(key);
    return R.path([pluralKey, 'byId', id], state) as iResourceObject;
};

/**
 * Get an array of Resource Objects from the state
 */
export const getResourceObjects = (
    state: iJasonApiState,
    key: string,
    ids: string[] | null = null
): iResourceObject[] => {
    const pluralKey = pluralize(key);

    if (ids === null) {
        return R.pipe(R.pathOr({}, [pluralKey, 'byId']), R.values)(state);
    }

    const isUndefined = (value: any) => typeof value === 'undefined';

    return R.pipe(
        R.pathOr({}, [key, 'byId']),
        R.props(ids),
        R.reject(isUndefined)
    )(state) as iResourceObject[];
};

/**
 * Grab an Resource Object group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} resourceType
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getResourceObjectsMeta = (
    state: iJasonApiState,
    resourceType: string,
    metaKey: string | null = null
) =>
    metaKey === null
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
export const getResourceObjectMeta = (
    state: iJasonApiState,
    resourceType: string,
    resourceId: string,
    metaKey: string | null = null
) =>
    metaKey === null
        ? R.path([resourceType, 'byId', resourceId, 'meta'], state)
        : R.path([resourceType, 'byId', resourceId, 'meta', metaKey], state);

/**
 * Get a cached Query
 *
 * @param state
 * @param url
 */
export const getCachedQuery = (state: iJasonApiState, url: string) =>
    R.path(['_cachedQueries', url], state);
