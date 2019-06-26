import { DependencyList, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { JasonApiDispatch } from '../../types';
import { cacheKeyForRequestAction } from '../../utils';
import { JasonApiRequest, JASON_API } from '../actions';
import { getCachedQuery } from '../selectors';
import { ResourceObjectOrObjects, Response } from 'ts-json-api/types';

/**
 * useRequestResponse()
 * --------------------------------
 * Automatically dispatch a JasonApi Request and return the response.
 *
 * ```ts
 * import React from 'react';
 * import { useRequestResponse } from 'jason-api';
 * import { useDispatch } from 'react-redux';
 *
 * import { fetchUser } from './actions';
 *
 * const SomeComponent: React.FunctionComponent<{ id: string }> = ({ id }) => {
 *     const action = fetchUser(id);
 *     const { data, errors, isLoading } = useRequestResponse(
 *          { action },
 *         [id]
 *     );
 *
 *     // Do stuff!
 * };
 *
 * ```
 */

interface UseQueryOptions {
    action: JasonApiRequest;
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
}

export const useRequestResponse = <
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
>(
    { action, expandResourceObjects }: UseQueryOptions,
    deps: DependencyList = []
) => {
    const dispatch = useDispatch<JasonApiDispatch>();
    const refetch = useCallback(() => dispatch(action), [action]);

    useEffect(() => {
        refetch();
    }, deps);

    const cacheKey = cacheKeyForRequestAction(action[JASON_API]);

    const response = useSelector(
        getCachedQuery(cacheKey, expandResourceObjects)
    ) as Response<D>;

    return {
        ...response,
        refetch,
    };
};
