import { ResourceObjectOrObjects } from 'ts-json-api';

import { RequestConfig } from '../../types/request';
import { JASON_API } from './actionTypes';

const defaultRequestConfig: Partial<RequestConfig> = {
    method: 'get',
};

export interface JasonApiRequestAction<
    Data extends ResourceObjectOrObjects = ResourceObjectOrObjects
> {
    [JASON_API]: RequestConfig<Data>;
}

/**
 * Initialize a Request to be handled by the middleware.
 */
export const jasonApiRequest = <
    Data extends ResourceObjectOrObjects = ResourceObjectOrObjects
>(
    config: RequestConfig<Data>
): JasonApiRequestAction<Data> => ({
    [JASON_API]: Object.assign({}, defaultRequestConfig, config),
});
