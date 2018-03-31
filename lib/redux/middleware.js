"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const ramda_1 = require("ramda");
const ts_json_api_1 = require("ts-json-api");
const actions_1 = require("./actions");
const actionTypes_1 = require("./actionTypes");
const async_1 = require("../utils/async");
class JsonApiMiddleware {
    constructor(config = {}, store, next, action) {
        this.config = config;
        this.store = store;
        this.action = Object.assign({}, {
            method: 'get',
            disableStartLoadingActionCreator: false,
            displayNotificationOnError: false,
        }, action);
    }
    /**
     * Intercept `JASON_API_REQUEST` type actions
     * and let others bubble through
     */
    executeMiddleware() {
        if (!this.action.disableStartLoadingActionCreator &&
            this.config.startLoadingActionCreator) {
            this.store.dispatch(this.config.startLoadingActionCreator());
        }
        const payload = this.action.payload instanceof ts_json_api_1.ResourceObject
            ? this.action.payload && { data: this.action.payload.toJSON() }
            : this.action.payload;
        this.resourceType =
            this.action.resourceType || ramda_1.path(['data', 'type'], payload);
        this.resourceId =
            this.action.resourceId || ramda_1.path(['data', 'id'], payload);
        this.setLoadingMeta();
        this.clearError();
        return this.executeRequest(payload);
    }
    /**
     * Make the request and handle the response
     *
     * @param payload
     */
    executeRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkCall = this.buildNetworkCall(payload);
            try {
                const response = yield networkCall;
                const data = response.data;
                const transformedData = this.action.transformer
                    ? this.action.transformer.call(null, data)
                    : data;
                if (!this.action.disableStartLoadingActionCreator &&
                    this.config.stopLoadingActionCreator) {
                    this.store.dispatch(this.config.stopLoadingActionCreator());
                }
                this.clearLoadingMeta();
                this.finishLoading(transformedData);
                this.executeOnSuccessActions(transformedData);
                if (this.action.onSuccess) {
                    this.action.onSuccess(transformedData);
                }
                return transformedData;
            }
            catch (error) {
                const errorJson = async_1.extractJsonApiErrorFromAxios(error);
                if (!this.action.disableStartLoadingActionCreator &&
                    this.config.stopLoadingActionCreator) {
                    this.store.dispatch(this.config.stopLoadingActionCreator());
                }
                this.clearLoadingMeta();
                if (this.config.authenticationExpiredActionCreator &&
                    this.checkForAuthenticationError(error)) {
                    this.store.dispatch(this.config.authenticationExpiredActionCreator(error));
                }
                else {
                    this.handleError(errorJson);
                    if (this.action.displayNotificationOnError &&
                        this.config.displayErrorActionCreator) {
                        this.store.dispatch(this.config.displayErrorActionCreator(async_1.stringifyJsonApiErrors(errorJson)));
                    }
                }
                throw errorJson;
            }
        });
    }
    buildNetworkCall(payload) {
        return axios_1.default.request({
            data: payload,
            headers: Object.assign({ Accept: 'application/vnd.api+json', ContentType: !(payload instanceof FormData) &&
                    'application/vnd.api+json' }, this.action.additionalHeaders),
            method: this.action.method,
            url: this.action.url,
        });
    }
    /**
     * Set global loading state, as well as ResourceObject-specific loading state
     */
    setLoadingMeta() {
        if (!this.resourceType)
            return;
        if (this.resourceId) {
            this.store.dispatch(actions_1.updateResourceObjectMeta(this.resourceType, this.resourceId, 'loading', true));
            return;
        }
        this.store.dispatch(actions_1.updateResourceObjectsMeta(this.resourceType, 'loading', true));
    }
    /**
     * Handle a successful API call, and update the entities store
     *
     * @param response
     */
    finishLoading(response) {
        if (!response || !response.data) {
            return;
        }
        this.store.dispatch(actions_1.loadJsonApiResourceObjectData(response));
    }
    /**
     * Set global loading state, as well as ResourceObject-specific loading state
     */
    clearLoadingMeta() {
        if (!this.resourceType)
            return;
        if (this.resourceId) {
            this.store.dispatch(actions_1.updateResourceObjectMeta(this.resourceType, this.resourceId, 'loading', false));
            return;
        }
        this.store.dispatch(actions_1.updateResourceObjectsMeta(this.resourceType, 'loading', false));
    }
    /**
     * Execute optional onSuccess actions
     *
     * @param response
     */
    executeOnSuccessActions(response) {
        this.action.setRelationshipOnSuccess &&
            this.action.setRelationshipOnSuccess.forEach(action => {
                const [resourceType, resourceId, relationshipType, relationshipObject,] = action;
                this.store.dispatch(actions_1.setRelationshipOnResourceObject(resourceType, resourceId, relationshipType, relationshipObject || response));
            });
        this.action.addRelationshipOnSuccess &&
            this.action.addRelationshipOnSuccess.forEach(action => {
                const [resourceType, resourceId, relationshipType, relationshipObject,] = action;
                this.store.dispatch(actions_1.addRelationshipToResourceObject(resourceType, resourceId, relationshipType, relationshipObject || response));
            });
        this.action.removeRelationshipOnSuccess &&
            this.action.removeRelationshipOnSuccess.forEach(action => {
                const [resourceType, resourceId, relationshipType, relationshipId,] = action;
                this.store.dispatch(actions_1.removeRelationshipFromResourceObject(resourceType, resourceId, relationshipType, relationshipId));
            });
        this.action.removeResourceObjectOnSuccess &&
            this.action.removeResourceObjectOnSuccess.forEach(action => {
                const [resourceType, resourceId] = action;
                this.store.dispatch(actions_1.removeResourceObject(resourceType, resourceId));
            });
        this.action.updateResourceObjectOnSuccess &&
            this.action.updateResourceObjectOnSuccess.forEach(action => {
                const [resourceType, resourceId, payload] = action;
                this.store.dispatch(actions_1.updateResourceObject(resourceType, resourceId, payload));
            });
    }
    /**
     * Clears error metadata
     */
    clearError() {
        if (!this.resourceType)
            return;
        if (this.resourceId) {
            this.store.dispatch(actions_1.updateResourceObjectMeta(this.resourceType, this.resourceId, 'errors', null));
            return;
        }
        this.store.dispatch(actions_1.updateResourceObjectsMeta(this.resourceType, 'errors', null));
    }
    /**
     * Handle a failed API call, and update the entities store
     *
     * @param error
     */
    handleError(errorBody) {
        if (!this.resourceType) {
            return;
        }
        if (this.resourceId) {
            this.store.dispatch(actions_1.updateResourceObjectMeta(this.resourceType, this.resourceId, 'errors', errorBody.errors));
            return;
        }
        this.store.dispatch(actions_1.updateResourceObjectsMeta(this.resourceType, 'errors', errorBody));
    }
    /**
     * Check to see if the provide error is an Authentication expired error
     *
     * @param error
     */
    checkForAuthenticationError(error) {
        return (error.response && error.response.status === 401) || false;
    }
}
/**
 * Handle JASON_API_REQUEST actions
 *
 * @param dispatch
 */
exports.middlewareFactory = (config = {}) => {
    return (store) => (next) => (action) => {
        if (action.type !== actionTypes_1.JASON_API_REQUEST) {
            return next(action);
        }
        const jsonApiMiddleware = new JsonApiMiddleware(config, store, next, action);
        return jsonApiMiddleware.executeMiddleware();
    };
};
exports.default = exports.middlewareFactory();
//# sourceMappingURL=middleware.js.map