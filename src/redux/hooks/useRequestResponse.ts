import { DependencyList, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceObjectOrObjects, Response } from 'ts-json-api/types';

import { JasonApiDispatch } from '../../types';
import { cacheKeyForRequestAction } from '../../utils';
import { JasonApiRequest, JASON_API } from '../actions';
import { getCachedQuery } from '../selectors';

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
    { action, cacheScheme, expandResourceObjects }: UseQueryOptions,
    deps: DependencyList = []
) => {
    const dispatch = useDispatch<JasonApiDispatch>();
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response<D>>({});

    // Preform the fetch and keep track of loading states.
    const fetch = useCallback(async () => {
        if (cacheScheme === 'cacheOnly') {
            return;
        }

        // Start loading.
        setLoading(true);

        // Get the response.
        const mostRecentResponse = (await dispatch(action)) as Response<D>;

        // Stop Loading.
        setLoading(false);

        // Store the response.
        setResponse(mostRecentResponse);
    }, [action]);

    // Get cached response.
    const cacheKey = cacheKeyForRequestAction(action[JASON_API]);
    const cachedResponse = useSelector(
        getCachedQuery(cacheKey, expandResourceObjects)
    ) as Response<D>;

    // Determine correct response to return.
    const providedResponse =
        cacheScheme === 'noCache' ? response : response || cachedResponse;

    // Make the request
    useEffect(() => {
        fetch();
    }, deps);

    return {
        ...providedResponse,
        isLoading,
        refetch: fetch,
    };
};
