import { ActionCreator, Dispatch, Middleware, Store } from 'redux';
import {
    iAttributes,
    iJsonApiResponse,
    iJsonApiResponseWithData,
    iResourceObject,
    JsonApiResponse,
} from 'ts-json-api';

import ResourceObject from 'ts-json-api/dist/ResourceObject';

import {
    addRelationshipToResourceObject,
    loadJsonApiResourceObjectData,
    removeRelationshipFromResourceObject,
    removeResourceObject,
    setRelationshipOnResourceObject,
    updateResourceObject,
    updateResourceObjectsMeta,
    updateResourceObjectMeta,
} from './actions';

import { JASON_API_REQUEST } from '../constants';
import * as network from '../utils/fetch';
import {
    iTransformer,
    iSuccessCallback,
    iJsonApiActionConfig,
} from '../interfaces/Middleware';

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

    private action: iJsonApiActionConfig;

    private resourceType: string;

    private resourceId: string;

    private store: Store<any>;

    constructor(config: MiddlewareConfig = {}) {
        this.config = config;
    }

    /**
     * Intercept `JASON_API_REQUEST` type actions
     * and let others bubble through
     */
    public middleware(
        store: Store<any>,
        next: Dispatch<any>,
        action: iJsonApiActionConfig
    ) {
        if (action.type !== JASON_API_REQUEST) {
            return next(<any>action);
        }

        this.action = Object.assign(
            {},
            {
                method: 'get',
                disableStartLoadingActionCreator: false,
                displayNotificationOnError: false,
            },
            action
        );

        this.store = store;

        if (
            !this.action.disableStartLoadingActionCreator &&
            this.config.startLoadingActionCreator
        ) {
            store.dispatch(this.config.startLoadingActionCreator());
        }

        const payload: Payload =
            this.action.payload instanceof ResourceObject
                ? { data: <ResourceObject>this.action.payload.toJSON() }
                : this.action.payload;

        this.resourceType =
            this.action.resourceType ||
            (payload && payload.data && payload.data.type);
        this.resourceId =
            this.action.resourceId ||
            (payload && payload.data && payload.data.id);

        this.setLoadingMeta();
        this.clearError();

        return this.executeRequest(payload);
    }

    /**
     * Make the request and handle the response
     *
     * @param payload
     */
    private async executeRequest(payload: Payload) {
        const method = this.action.method || 'get';
        const networkCall = network.request(
            method,
            this.action.url,
            payload,
            this.action.additionalHeaders
        );

        try {
            const response = await networkCall;
            const transformedResponse = this.action.transformer
                ? this.action.transformer.call(null, response)
                : response;

            if (
                !this.action.disableStartLoadingActionCreator &&
                this.config.stopLoadingActionCreator
            ) {
                this.store.dispatch(this.config.stopLoadingActionCreator());
            }

            this.clearLoadingMeta();
            this.finishLoading(transformedResponse);
            this.executeOnSuccessActions(transformedResponse);

            if (this.action.onSuccess) {
                this.action.onSuccess(transformedResponse);
            }

            return transformedResponse;
        } catch (error) {
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
                this.handleError(error);
                if (
                    this.action.displayNotificationOnError &&
                    this.config.displayErrorActionCreator
                ) {
                    this.store.dispatch(
                        this.config.displayErrorActionCreator(error.message)
                    );
                }
            }

            throw error;
        }
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
    private finishLoading(response: iJsonApiResponse) {
        if (!response || !(<iJsonApiResponseWithData>response).data) {
            return;
        }

        this.store.dispatch(
            loadJsonApiResourceObjectData(<iJsonApiResponseWithData>response)
        );
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
    private executeOnSuccessActions(response: iJsonApiResponseWithData) {
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
    private handleError(error: any) {
        if (this.resourceId) {
            this.store.dispatch(
                updateResourceObjectMeta(
                    this.resourceType,
                    this.resourceId,
                    'errors',
                    error.errors
                )
            );
            return;
        }

        this.store.dispatch(
            updateResourceObjectsMeta(this.resourceType, 'errors', error)
        );
    }

    /**
     * Check to see if the provide error is an Authentication expired error
     *
     * @param possibleError
     */
    private checkForAuthenticationError(possibleErrors: any): boolean {
        if (!Array.isArray(possibleErrors)) {
            return false;
        }

        return !!possibleErrors.find(error => error.status === 401);
    }
}

/**
 * Handle JASON_API_REQUEST actions
 *
 * @param dispatch
 */
export const middlewareFactory = (config: MiddlewareConfig = {}): any => {
    return <Middleware>(store: Store<any>) => (next: Dispatch<any>) => (
        action: iJsonApiActionConfig
    ) => {
        const jsonApiMiddleware = new JsonApiMiddleware(config);
        return jsonApiMiddleware.middleware(store, next, action);
    };
};

export default middlewareFactory();
