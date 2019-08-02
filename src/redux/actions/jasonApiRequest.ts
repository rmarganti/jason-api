import { ResourceObjectOrObjects } from 'ts-json-api';

import { JasonAPIDispatch } from '../../types/redux';
import { RequestConfig } from '../../types/request';
import { StateWithJasonAPI } from '../../types/state';
import { JASON_API } from './actionTypes';

const defaultRequestConfig: Partial<RequestConfig> = {
    method: 'get',
};

export interface JasonAPIRequestAction<
    Data extends ResourceObjectOrObjects = ResourceObjectOrObjects,
    Dispatch extends JasonAPIDispatch = JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
> {
    [JASON_API]: RequestConfig<Data, Dispatch, State>;
}

/**
 * Initialize a Request to be handled by the middleware.
 */
export const jasonApiRequest = <
    Data extends ResourceObjectOrObjects = ResourceObjectOrObjects,
    Dispatch extends JasonAPIDispatch = JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
>(
    config: RequestConfig<Data, Dispatch, State>
): JasonAPIRequestAction<Data, Dispatch, State> => ({
    [JASON_API]: Object.assign({}, defaultRequestConfig, config),
});
