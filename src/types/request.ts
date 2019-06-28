import { Attributes, Response, ResponseWithData } from 'ts-json-api';

import { FlexiblePayload } from './other';

interface AdditionalHeaders {
    [index: string]: string;
}

interface ErrorCallback {
    (error: Error): void;
}

interface SuccessCallback {
    (response?: Response): void;
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

export interface RequestConfig {
    url: string;
    method?: Method;
    payload?: any;
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
    cacheKey?: string;
}
