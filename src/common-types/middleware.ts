import { FlexiblePayload } from './other';
import {
    ResourceObject,
    iAttributes,
    iResponse,
    iResponseWithData,
} from 'ts-json-api';

export interface iAdditionalHeaders {
    [index: string]: string;
}

export interface iErrorCallback {
    (error: Error): void;
}

export interface iSuccessCallback {
    (response?: iResponse): void;
}

export interface iTransformer {
    (response: iResponseWithData): iResponseWithData;
}

export type iSetRelationshipOnSuccess = [
    string,
    string,
    string,
    FlexiblePayload
];

export type iAddRelationshipOnSuccess = [
    string,
    string,
    string,
    FlexiblePayload
];

export type iRemoveRelationshipOnSuccess = [string, string, string, string];
export type iRemoveResourceObjectOnSuccess = [string, string];
export type iUpdateResourceObjectOnSuccess = [string, string, iAttributes];

export type Method = 'get' | 'post' | 'patch' | 'delete';

/**
 * Jason API Redux action
 */
export interface iJsonApiActionConfig {
    type: string;
    url: string;
    method?: Method;
    payload?: FlexiblePayload;
    resourceId?: string;
    resourceType?: string;
    additionalHeaders?: iAdditionalHeaders;
    disableStartLoadingActionCreator?: boolean;
    displayNotificationOnError?: boolean;
    onError?: iErrorCallback;
    onSuccess?: iSuccessCallback;
    transformer?: iTransformer;
    setRelationshipOnSuccess?: iSetRelationshipOnSuccess[];
    addRelationshipOnSuccess?: iAddRelationshipOnSuccess[];
    removeRelationshipOnSuccess?: iRemoveRelationshipOnSuccess[];
    removeResourceObjectOnSuccess?: iRemoveResourceObjectOnSuccess[];
    updateResourceObjectOnSuccess?: iUpdateResourceObjectOnSuccess[];
}
