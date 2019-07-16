/**
 * useAutoRequest()
 * --------------------------------
 * Automatically dispatch a JasonApi Request and return the response.
 *
 * ```ts
 * import React from 'react';
 * import { useAutoResponse } from 'jason-api';
 * import { useDispatch } from 'react-redux';
 *
 * import { fetchUser } from './actions';
 *
 * const SomeComponent: React.FunctionComponent<{ id: string }> = ({ id }) => {
 *     const action = fetchUser(id);
 *     const { data, errors, isLoading } = useAutoRequest(
 *          { action },
 *         [id]
 *     );
 *
 *     // Do stuff!
 * };
 *
 * ```
 */

// External dependencies
import { useEffect, DependencyList } from 'react';
import { ResourceObjectOrObjects } from 'ts-json-api';

// Internal dependencies
import { useRequest, UseRequestOptions } from './useRequest';

export const useAutoRequest = <
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
>(
    options: UseRequestOptions<D>,
    deps: DependencyList = []
) => {
    const request = useRequest<D>(options);

    // Make the request
    useEffect(() => {
        request.fetch();
    }, deps);

    return request;
};
