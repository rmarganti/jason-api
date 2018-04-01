import * as pluralize from 'pluralize';
import * as R from 'ramda';
import {
    iAttributes,
    iResourceObject,
    iResponseWithData,
    JsonApiResponse,
    iResponse,
    iMeta,
} from 'ts-json-api';

import { iJasonApiState } from '../common-types/state';
import { mapOrOnce, simplifyResourceObjects } from '../utils/data';

/**
 * Grab an Resource Object from the state
 *
 * @param state
 * @param key
 * @param id
 */
export const getResourceObject = (
    state: iJasonApiState,
    key: string,
    id: string
): iResourceObject | undefined => {
    const pluralKey = pluralize(key);
    return R.path([pluralKey, 'byId', id], state) as iResourceObject;
};

/**
 * Get an array of Resource Objects from the state
 *
 * @param state
 * @param key
 * @param ids
 * @param expand
 */
export const getResourceObjects = (
    state: iJasonApiState,
    key: string,
    ids: string[] | null = null,
    expand: boolean = true
): iResourceObject[] | undefined => {
    const pluralKey = pluralize(key);
    const isUndefined = (value: any) => typeof value === 'undefined';

    const resourceObjects =
        ids === null
            ? R.pathOr({}, [pluralKey, 'byId'], state)
            : R.pipe(
                  R.pathOr({}, [key, 'byId']),
                  R.props(ids),
                  R.reject(isUndefined),
              )(state);

    const resourceObjectsArray = R.values(resourceObjects);

    return expand
        ? resourceObjectsArray
        : simplifyResourceObjects(resourceObjectsArray);
};

/**
 * Grab an Resource Object group's meta data from the state
 *
 * @param state
 * @param resourceType
 * @param metaKey
 */
export const getResourceObjectsMeta = (
    state: iJasonApiState,
    resourceType: string,
    metaKey: string | null = null
) =>
    metaKey === null
        ? R.path<iMeta>([resourceType, 'meta'], state)
        : R.path([resourceType, 'meta', metaKey], state);

/**
 * Grab an Resource Object's meta data from the state
 *
 * @param state
 * @param resourceType
 * @param resourceId
 * @param metaKey
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
 * @param key
 * @param expandResourceObjects
 */
export const getCachedQuery = (
    state: iJasonApiState,
    key: string,
    expandResourceObjects: boolean = false
): iResponse | undefined => {
    const cachedQuery = R.path(['_cachedQueries', key], state);

    if (!expandResourceObjects) {
        return cachedQuery;
    }

    const expandResourceObject = (state: iJasonApiState) => (
        resourceObject: iResourceObject
    ) => getResourceObject(state, resourceObject.type, resourceObject.id!);

    const expandAll = mapOrOnce(expandResourceObject(state));

    return R.over(R.lensProp('data'), expandAll, cachedQuery);
};
