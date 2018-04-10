import { Action, Dispatch, MiddlewareAPI } from 'redux';
import { Attributes, Response } from 'ts-json-api';
import { JASON_API_REQUEST } from '../redux/actionTypes';
import { FlexiblePayload } from './other';

export interface AdditionalHeaders {
    [index: string]: string;
}

export interface ErrorCallback {
    (error: Error): void;
}

export interface SuccessCallback {
    (response?: Response): void;
}

export interface Transformer {
    (response: Response): Response;
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
export type UpdateResourceObjectOnSuccess = [string, string, Attributes];

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
    <A extends Action>(action: A): Promise<Response>;
}

export interface JasonApiMiddleware {
    <S>(store: MiddlewareAPI<S>): (next: Dispatch<S>) => any;
}
