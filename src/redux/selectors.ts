import pluralize from 'pluralize';
import { lensProp, over, path, pathOr, props, reject, values } from 'ramda';
import { ResourceObject, Response, pipe } from 'ts-json-api';

import { StateWithJasonAPI } from '../types/state';
import { mapOrOnce, simplifyResourceObjects } from '../utils/data';
import { isUndefined } from '../utils';

/**
 * Grab an Resource Object from the state
 *
 * @param state
 * @param key
 * @param id
 */
export const getResourceObject = <T extends ResourceObject = ResourceObject>(
    key: string,
    id: string
) => (state: StateWithJasonAPI): T | undefined => {
    const pluralKey = pluralize(key);
    return path([pluralKey, 'byId', id], state.jasonApi.resourceObjects);
};

/**
 * Get an array of Resource Objects from the state
 *
 * @param state
 * @param key
 * @param ids
 * @param expand
 */
export const getResourceObjects = <T extends ResourceObject = ResourceObject>(
    key: string,
    ids: string[] | null = null,
    expand: boolean = true
) => (state: StateWithJasonAPI): T[] => {
    const pluralKey = pluralize(key);

    const resourceObjects =
        ids === null
            ? pathOr({}, [pluralKey, 'byId'], state.jasonApi.resourceObjects)
            : pipe(
                  pathOr({}, [key, 'byId']),
                  props(ids),
                  reject(isUndefined)
              )(state.jasonApi.resourceObjects);

    const resourceObjectsArray = values(resourceObjects);

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
    resourceType: string,
    metaKey: string | null = null
) => (state: StateWithJasonAPI) =>
    metaKey === null
        ? path([resourceType, 'meta'], state.jasonApi.resourceObjects)
        : path([resourceType, 'meta', metaKey], state.jasonApi.resourceObjects);

/**
 * Grab an Resource Object's meta data from the state
 *
 * @param state
 * @param resourceType
 * @param resourceId
 * @param metaKey
 */
export const getResourceObjectMeta = (
    resourceType: string,
    resourceId: string,
    metaKey: string | null = null
) => (state: StateWithJasonAPI) =>
    metaKey === null
        ? path(
              [resourceType, 'byId', resourceId, 'meta'],
              state.jasonApi.resourceObjects
          )
        : path(
              [resourceType, 'byId', resourceId, 'meta', metaKey],
              state.jasonApi.resourceObjects
          );

/**
 * Get a cached Query
 *
 * @param state
 * @param key
 * @param expandResourceObjects
 */
export const getCachedQuery = (
    key: string,
    expandResourceObjects: boolean = false
) => (state: StateWithJasonAPI): Response | undefined => {
    const cachedQuery = state.jasonApi.queries[key];

    if (!expandResourceObjects || !cachedQuery || !cachedQuery.data) {
        return cachedQuery;
    }

    const expandResourceObject = (state: StateWithJasonAPI) => (
        resourceObject: ResourceObject
    ) => getResourceObject(resourceObject.type, resourceObject.id)(state);

    const expandAll = mapOrOnce(expandResourceObject(state));

    return over(lensProp('data'), expandAll, cachedQuery);
};
