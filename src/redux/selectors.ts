import * as pluralize from 'pluralize';
import * as R from 'ramda';
import * as JsonApi from 'ts-json-api/types/structure';
import { JasonApiState } from '../common-types/state';
import { mapOrOnce, simplifyResourceObjects } from '../utils/data';

/**
 * Grab an Resource Object from the state
 *
 * @param state
 * @param key
 * @param id
 */
export const getResourceObject = (
    state: JasonApiState,
    key: string,
    id: string
): JsonApi.ResourceObject | undefined => {
    const pluralKey = pluralize(key);
    return R.path([pluralKey, 'byId', id], state);
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
    state: JasonApiState,
    key: string,
    ids: string[] | null = null,
    expand: boolean = true
): JsonApi.ResourceObject[] | undefined => {
    const pluralKey = pluralize(key);
    const isUndefined = (value: any) => typeof value === 'undefined';

    const resourceObjects =
        ids === null
            ? R.pathOr({}, [pluralKey, 'byId'], state)
            : R.pipe(
                  R.pathOr({}, [key, 'byId']),
                  R.props(ids),
                  R.reject(isUndefined)
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
    state: JasonApiState,
    resourceType: string,
    metaKey: string | null = null
) =>
    metaKey === null
        ? R.path([resourceType, 'meta'], state)
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
    state: JasonApiState,
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
    state: JasonApiState,
    key: string,
    expandResourceObjects: boolean = false
): JsonApi.Response | undefined => {
    const cachedQuery = R.path(['_cachedQueries', key], state);

    if (!expandResourceObjects || !cachedQuery) {
        return cachedQuery;
    }

    const expandResourceObject = (state: JasonApiState) => (
        resourceObject: JsonApi.ResourceObject
    ) => getResourceObject(state, resourceObject.type, resourceObject.id!);

    const expandAll = mapOrOnce(expandResourceObject(state));

    return R.over(R.lensProp('data'), expandAll, cachedQuery);
};
