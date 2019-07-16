/**
 * useRequest()
 * --------------------------------
 * Provide a method to dispatch an JasonAPI action,
 * while keeping track of loading status and responses.
 *
 * ```ts
 * import React from 'react';
 * import { useRequest } from 'jason-api';
 * import { useDispatch } from 'react-redux';
 *
 * import { acceptYourHookOverlords } from './actions';
 *
 * const SomeComponent: React.FunctionComponent = () => {
 *     const action = acceptYourHookOverlords();
 *
 *     const { data, errors, fetch, isLoading } = useRequest(
 *          { action },
 *         [id]
 *     );
 *
 *     return (
 *         <button onClick={acceptYourHookOverlords.fetch}>
 *             {isLoading ? 'Please wait…' : 'Comb Dan Abramov\'s Hair'}
 *         </button>
 *     );
 * };
 *
 * ```
 */

// External dependencies
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceObjectOrObjects, Response } from 'ts-json-api';

// Internal dependencies
import { JasonApiDispatch } from '../../types';
import { cacheKeyForRequestAction } from '../../utils';
import { JasonApiRequestAction, JASON_API } from '../actions';
import { getCachedQuery } from '../selectors';
import { ResponseWithData, ResponseWithErrors } from 'ts-json-api';

export interface UseRequestOptions<D extends ResourceObjectOrObjects> {
    action: JasonApiRequestAction;
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
    onError?: (response: ResponseWithErrors) => void;
    onSuccess?: (response: ResponseWithData<D>) => void;
}

export type UseRequestResult<D extends ResourceObjectOrObjects> = Response<
    D
> & {
    fetch: () => Promise<void>;
    isLoading: boolean;
};

export const useRequest = <
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
>({
    action,
    cacheScheme,
    expandResourceObjects,
    onError,
    onSuccess,
}: UseRequestOptions<D>) => {
    const dispatch = useDispatch<JasonApiDispatch>();
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response<D>>();

    // Preform the fetch and keep track of loading states.
    const fetch = useCallback(async () => {
        if (cacheScheme === 'cacheOnly') {
            return;
        }

        // Start loading.
        setLoading(true);

        // Get the response.
        try {
            const successResponse = (await dispatch(
                action
            )) as ResponseWithData<D>;

            // Store the success response.
            setResponse(successResponse);

            // Trigger optional success callback.
            if (onSuccess) {
                onSuccess(successResponse);
            }
        } catch (e) {
            // The middleware always throws errors
            // as a valid JsonAPI error response.
            const errorResponse = e as ResponseWithErrors<D>;

            // Store error response.
            setResponse(errorResponse);

            // Trigger optional error callback.
            if (onError) {
                onError(errorResponse);
            }
        }

        // Stop Loading.
        setLoading(false);
    }, [action]);

    // Get cached response.
    const cacheKey = cacheKeyForRequestAction(action[JASON_API]);
    const cachedResponse = useSelector(
        getCachedQuery(cacheKey, expandResourceObjects)
    ) as Response<D>;

    // Determine correct response to return.
    const providedResponse =
        cacheScheme === 'noCache' ? response : response || cachedResponse;

    return {
        ...providedResponse,
        fetch,
        isLoading,
    } as UseRequestResult<D>;
};
