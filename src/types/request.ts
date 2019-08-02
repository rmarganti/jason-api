// External Dependencies
import {
    Attributes,
    ResourceObjectOrObjects,
    Response,
    ResponseWithData,
    ResponseWithErrors,
} from 'ts-json-api';

// Internal Dependencies
import { FlexiblePayload } from './other';
import { JasonAPIMiddlewareApi, JasonAPIDispatch } from './redux';
import { StateWithJasonAPI } from './state';

interface AdditionalHeaders {
    [index: string]: string;
}

interface ErrorCallback<
    Dispatch extends JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
> {
    (
        error: ResponseWithErrors,
        store: JasonAPIMiddlewareApi<Dispatch, State>
    ): void;
}

interface SuccessCallback<
    Data extends ResourceObjectOrObjects,
    Dispatch extends JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
> {
    (
        response: Response<Data>,
        store: JasonAPIMiddlewareApi<Dispatch, State>
    ): void;
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
    Data extends ResourceObjectOrObjects = ResourceObjectOrObjects,
    Dispatch extends JasonAPIDispatch = JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
> {
    url: string;
    method?: Method;
    payload?: any;
    resourceId?: string;
    resourceType?: string;
    additionalHeaders?: AdditionalHeaders;
    disableStartLoadingActionCreator?: boolean;
    displayNotificationOnError?: boolean;
    onError?: ErrorCallback<Dispatch, State>;
    onSuccess?: SuccessCallback<Data, Dispatch, State>;
    transformer?: Transformer;
    setRelationshipOnSuccess?: SetRelationshipOnSuccess[];
    addRelationshipOnSuccess?: AddRelationshipOnSuccess[];
    removeRelationshipOnSuccess?: RemoveRelationshipOnSuccess[];
    removeResourceObjectOnSuccess?: RemoveResourceObjectOnSuccess[];
    updateResourceObjectOnSuccess?: UpdateResourceObjectOnSuccess[];
    cacheKey?: string;
}
