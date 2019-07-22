import {
    Attributes,
    ResourceObjectOrObjects,
    Response,
    ResponseWithData,
    ResponseWithErrors,
} from 'ts-json-api';

import { FlexiblePayload } from './other';
import { JasonApiMiddlewareApi } from './redux';

interface AdditionalHeaders {
    [index: string]: string;
}

interface ErrorCallback {
    (error: ResponseWithErrors, store: JasonApiMiddlewareApi): void;
}

interface SuccessCallback<D extends ResourceObjectOrObjects> {
    (response: Response<D>, store: JasonApiMiddlewareApi): void;
}

interface Transformer {
    (response: ResponseWithData): ResponseWithData;
}

type SetRelationshipOnSuccess = [string, string, string, FlexiblePayload];

type AddRelationshipOnSuccess = [string, string, string, FlexiblePayload];

type RemoveRelationshipOnSuccess = [string, string, string, string];
type RemoveResourceObjectOnSuccess = [string, string];
type UpdateResourceObjectOnSuccess = [string, string, Attributes];

type Method = 'get' | 'post' | 'patch' | 'delete';

export interface RequestConfig<
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
> {
    url: string;
    method?: Method;
    payload?: any;
    resourceId?: string;
    resourceType?: string;
    additionalHeaders?: AdditionalHeaders;
    disableStartLoadingActionCreator?: boolean;
    displayNotificationOnError?: boolean;
    onError?: ErrorCallback;
    onSuccess?: SuccessCallback<D>;
    transformer?: Transformer;
    setRelationshipOnSuccess?: SetRelationshipOnSuccess[];
    addRelationshipOnSuccess?: AddRelationshipOnSuccess[];
    removeRelationshipOnSuccess?: RemoveRelationshipOnSuccess[];
    removeResourceObjectOnSuccess?: RemoveResourceObjectOnSuccess[];
    updateResourceObjectOnSuccess?: UpdateResourceObjectOnSuccess[];
    cacheKey?: string;
}
