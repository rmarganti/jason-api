import { RequestConfig } from '../../types';
import { JASON_API } from './actionTypes';

const defaultRequestConfig: Partial<RequestConfig> = {
    method: 'get',
};

/**
 * Initialize a Request to be handled by the middleware.
 */
export const jasonApiRequest = (
    config: RequestConfig
): { [JASON_API]: RequestConfig } => ({
    [JASON_API]: Object.assign({}, defaultRequestConfig, config),
});
export type JasonApiRequestAction = ReturnType<typeof jasonApiRequest>;
