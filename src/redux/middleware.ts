import axios, { AxiosError } from 'axios';
import { path } from 'ramda';
import {
    Action,
    ActionCreator,
    Dispatch,
    MiddlewareAPI,
    AnyAction,
} from 'redux';
import { ResourceObject } from 'ts-json-api';
import * as JsonApi from 'ts-json-api/types/structure';
import {
    JasonApiRequestAction,
    JasonApiDispatch,
    JasonApiMiddleware,
} from '../common-types/middleware';
import { StateWithJasonApi } from '../common-types/state';
import {
    extractJsonApiErrorFromAxios,
    stringifyJsonApiErrors,
} from '../utils/async';
import { JASON_API_REQUEST } from './actionTypes';
import {
    addRelationshipToResourceObject,
    loadJsonApiResourceObjectData,
    removeRelationshipFromResourceObject,
    removeResourceObject,
    setRelationshipOnResourceObject,
    updateResourceObject,
    updateResourceObjectMeta,
    updateResourceObjectsMeta,
} from './actions';

export interface MiddlewareConfig {
    startLoadingActionCreator?: ActionCreator<any>;
    stopLoadingActionCreator?: ActionCreator<any>;
    displayErrorActionCreator?: ActionCreator<any>;
    authenticationExpiredActionCreator?: ActionCreator<any>;
}

export interface Payload {
    [index: string]: any;
}

class JsonApiMiddleware {
    private config: MiddlewareConfig;

    private action: JasonApiRequestAction;

    private resourceType?: string;

    private resourceId?: string;

    private store: MiddlewareAPI<any>;

    constructor(
        config: MiddlewareConfig = {},
        store: MiddlewareAPI<any>,
        action: AnyAction
    ) {
        this.config = config;
        this.store = store;

        this.action = Object.assign(
            {},
            {
                method: 'get',
                disableStartLoadingActionCreator: false,
                displayNotificationOnError: false,
            },
            action as JasonApiRequestAction
        );
    }

    /**
     * Intercept `JASON_API_REQUEST` type actions
     * and let others bubble through
     */
    public executeMiddleware() {
        if (
            !this.action.disableStartLoadingActionCreator &&
            this.config.startLoadingActionCreator
        ) {
            this.store.dispatch(this.config.startLoadingActionCreator());
        }

        const payload: Payload | undefined =
            this.action.payload instanceof ResourceObject
                ? this.action.payload && { data: this.action.payload.toJSON() }
                : this.action.payload;

        this.resourceType =
            this.action.resourceType || path(['data', 'type'], payload);

        this.resourceId =
            this.action.resourceId || path(['data', 'id'], payload);

        this.setLoadingMeta();
        this.clearError();

        return this.executeRequest(payload);
    }

    /**
     * Make the request and handle the response
     *
     * @param payload
     */
    private async executeRequest(payload?: Payload) {
        const networkCall = this.buildNetworkCall(payload);

        try {
            const response = await networkCall;
            const data = response.data;

            const transformedData = this.action.transformer
                ? this.action.transformer.call(null, data)
                : data;

            if (
                !this.action.disableStartLoadingActionCreator &&
                this.config.stopLoadingActionCreator
            ) {
                this.store.dispatch(this.config.stopLoadingActionCreator());
            }

            this.clearLoadingMeta();
            this.finishLoading(transformedData);
            this.executeOnSuccessActions(transformedData);

            if (this.action.onSuccess) {
                this.action.onSuccess(transformedData);
            }

            return transformedData;
        } catch (error) {
            const errorJson = extractJsonApiErrorFromAxios(error);

            if (
                !this.action.disableStartLoadingActionCreator &&
                this.config.stopLoadingActionCreator
            ) {
                this.store.dispatch(this.config.stopLoadingActionCreator());
            }

            this.clearLoadingMeta();

            if (
                this.config.authenticationExpiredActionCreator &&
                this.checkForAuthenticationError(error)
            ) {
                this.store.dispatch(
                    this.config.authenticationExpiredActionCreator(error)
                );
            } else {
                this.handleError(errorJson);
                if (
                    this.action.displayNotificationOnError &&
                    this.config.displayErrorActionCreator
                ) {
                    this.store.dispatch(
                        this.config.displayErrorActionCreator(
                            stringifyJsonApiErrors(errorJson)
                        )
                    );
                }
            }

            throw errorJson;
        }
    }

    private buildNetworkCall(payload?: Payload) {
        return axios.request({
            data: payload,
            headers: {
                Accept: 'application/vnd.api+json',
                ContentType:
                    !(payload instanceof FormData) &&
                    'application/vnd.api+json',
                ...this.action.additionalHeaders,
            },
            method: this.action.method,
            url: this.action.url,
        });
    }

    /**
     * Set global loading state, as well as ResourceObject-specific loading state
     */
    private setLoadingMeta() {
        if (!this.resourceType) return;

        if (this.resourceId) {
            this.store.dispatch(
                updateResourceObjectMeta(
                    this.resourceType,
                    this.resourceId,
                    'loading',
                    true
                )
            );
            return;
        }

        this.store.dispatch(
            updateResourceObjectsMeta(this.resourceType, 'loading', true)
        );
    }

    /**
     * Handle a successful API call, and update the entities store
     *
     * @param response
     */
    private finishLoading(response: JsonApi.Response) {
        if (!response || !response.data) {
            return;
        }

        this.store.dispatch(loadJsonApiResourceObjectData(response));
    }

    /**
     * Set global loading state, as well as ResourceObject-specific loading state
     */
    private clearLoadingMeta() {
        if (!this.resourceType) return;

        if (this.resourceId) {
            this.store.dispatch(
                updateResourceObjectMeta(
                    this.resourceType,
                    this.resourceId,
                    'loading',
                    false
                )
            );
            return;
        }

        this.store.dispatch(
            updateResourceObjectsMeta(this.resourceType, 'loading', false)
        );
    }

    /**
     * Execute optional onSuccess actions
     *
     * @param response
     */
    private executeOnSuccessActions(response: JsonApi.ResponseWithData) {
        this.action.setRelationshipOnSuccess &&
            this.action.setRelationshipOnSuccess.forEach(action => {
                const [
                    resourceType,
                    resourceId,
                    relationshipType,
                    relationshipObject,
                ] = action;
                this.store.dispatch(
                    setRelationshipOnResourceObject(
                        resourceType,
                        resourceId,
                        relationshipType,
                        relationshipObject || response
                    )
                );
            });

        this.action.addRelationshipOnSuccess &&
            this.action.addRelationshipOnSuccess.forEach(action => {
                const [
                    resourceType,
                    resourceId,
                    relationshipType,
                    relationshipObject,
                ] = action;
                this.store.dispatch(
                    addRelationshipToResourceObject(
                        resourceType,
                        resourceId,
                        relationshipType,
                        relationshipObject || response
                    )
                );
            });

        this.action.removeRelationshipOnSuccess &&
            this.action.removeRelationshipOnSuccess.forEach(action => {
                const [
                    resourceType,
                    resourceId,
                    relationshipType,
                    relationshipId,
                ] = action;
                this.store.dispatch(
                    removeRelationshipFromResourceObject(
                        resourceType,
                        resourceId,
                        relationshipType,
                        relationshipId
                    )
                );
            });

        this.action.removeResourceObjectOnSuccess &&
            this.action.removeResourceObjectOnSuccess.forEach(action => {
                const [resourceType, resourceId] = action;
                this.store.dispatch(
                    removeResourceObject(resourceType, resourceId)
                );
            });

        this.action.updateResourceObjectOnSuccess &&
            this.action.updateResourceObjectOnSuccess.forEach(action => {
                const [resourceType, resourceId, payload] = action;
                this.store.dispatch(
                    updateResourceObject(resourceType, resourceId, payload)
                );
            });
    }

    /**
     * Clears error metadata
     */
    private clearError() {
        if (!this.resourceType) return;

        if (this.resourceId) {
            this.store.dispatch(
                updateResourceObjectMeta(
                    this.resourceType,
                    this.resourceId,
                    'errors',
                    null
                )
            );
            return;
        }

        this.store.dispatch(
            updateResourceObjectsMeta(this.resourceType, 'errors', null)
        );
    }

    /**
     * Handle a failed API call, and update the entities store
     *
     * @param error
     */
    private handleError(errorBody: JsonApi.ResponseWithErrors) {
        if (!this.resourceType) {
            return;
        }

        if (this.resourceId) {
            this.store.dispatch(
                updateResourceObjectMeta(
                    this.resourceType,
                    this.resourceId,
                    'errors',
                    errorBody.errors
                )
            );
            return;
        }

        this.store.dispatch(
            updateResourceObjectsMeta(this.resourceType, 'errors', errorBody)
        );
    }

    /**
     * Check to see if the provide error is an Authentication expired error
     *
     * @param error
     */
    private checkForAuthenticationError(error: AxiosError): boolean {
        return (error.response && error.response.status === 401) || false;
    }
}

/**
 * Handle JASON_API_REQUEST actions
 *
 * @param dispatch
 */
export const middlewareFactory = (
    config: MiddlewareConfig = {}
): JasonApiMiddleware => store => next => <A extends Action>(action: A) => {
    if (action.type !== JASON_API_REQUEST) {
        return next(action);
    }

    const jsonApiMiddleware = new JsonApiMiddleware(config, store, action);

    return jsonApiMiddleware.executeMiddleware();
};

export default middlewareFactory();
