import { Action, MiddlewareAPI, Dispatch } from 'redux';
import * as JsonApi from 'ts-json-api/types/structure';
import { FlexiblePayload } from './other';
import { JASON_API_REQUEST } from '../redux/actionTypes';
import { StateWithJasonApi } from './state';

export interface AdditionalHeaders {
    [index: string]: string;
}

export interface ErrorCallback {
    (error: Error): void;
}

export interface SuccessCallback {
    (response?: JsonApi.Response): void;
}

export interface Transformer {
    (response: JsonApi.Response): JsonApi.Response;
}

export type SetRelationshipOnSuccess = [
    string,
    string,
    string,
    FlexiblePayload
];

export type AddRelationshipOnSuccess = [
    string,
    string,
    string,
    FlexiblePayload
];

export type RemoveRelationshipOnSuccess = [string, string, string, string];
export type RemoveResourceObjectOnSuccess = [string, string];
export type UpdateResourceObjectOnSuccess = [
    string,
    string,
    JsonApi.Attributes
];

export type Method = 'get' | 'post' | 'patch' | 'delete';

/**
 * Jason API Redux action
 */
export interface JasonApiRequestAction extends Action {
    type: typeof JASON_API_REQUEST;
    url: string;
    method?: Method;
    payload?: FlexiblePayload;
    resourceId?: string;
    resourceType?: string;
    additionalHeaders?: AdditionalHeaders;
    disableStartLoadingActionCreator?: boolean;
    displayNotificationOnError?: boolean;
    onError?: ErrorCallback;
    onSuccess?: SuccessCallback;
    transformer?: Transformer;
    setRelationshipOnSuccess?: SetRelationshipOnSuccess[];
    addRelationshipOnSuccess?: AddRelationshipOnSuccess[];
    removeRelationshipOnSuccess?: RemoveRelationshipOnSuccess[];
    removeResourceObjectOnSuccess?: RemoveResourceObjectOnSuccess[];
    updateResourceObjectOnSuccess?: UpdateResourceObjectOnSuccess[];
}

export interface JasonApiDispatch {
    <A extends Action>(action: A): Promise<JsonApi.Response>;
}

export interface JasonApiMiddleware {
    <S>(store: MiddlewareAPI<S>): (next: Dispatch<S>) => any;
}
