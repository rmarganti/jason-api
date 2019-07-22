import { ResourceObjectOrObjects } from 'ts-json-api';

import { RequestConfig } from '../../types/request';
import { JASON_API } from './actionTypes';

const defaultRequestConfig: Partial<RequestConfig> = {
    method: 'get',
};

export interface JasonApiRequestAction<
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
> {
    [JASON_API]: RequestConfig<D>;
}

/**
 * Initialize a Request to be handled by the middleware.
 */
export const jasonApiRequest = <
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
>(
    config: RequestConfig<D>
): JasonApiRequestAction<D> => ({
    [JASON_API]: Object.assign({}, defaultRequestConfig, config),
});
