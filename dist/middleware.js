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
const actions_1 = require("./actions");
const ts_json_api_1 = require("ts-json-api");
const constants_1 = require("./constants");
const network = require("./fetch");
class JsonApiMiddleware {
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Intercept `JASON_API_REQUEST` type actions
     * and let others bubble through
     */
    middleware(store, next, action) {
        if (action.type !== constants_1.JASON_API_REQUEST) {
            return next(action);
        }
        this.action = Object.assign({}, {
            method: 'get',
            disableStartLoadingActionCreator: false,
            displayNotificationOnError: false,
        }, action);
        this.store = store;
        if (!this.action.disableStartLoadingActionCreator &&
            this.config.startLoadingActionCreator) {
            store.dispatch(this.config.startLoadingActionCreator());
        }
        const payload = this.action.payload instanceof ts_json_api_1.ResourceObject
            ? { data: this.action.payload.toJSON() }
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
    executeRequest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = this.action.method || 'get';
            const networkCall = network.request(method, this.action.url, payload, this.action.additionalHeaders);
            try {
                const response = yield networkCall;
                const transformedResponse = this.action.transformer
                    ? this.action.transformer.call(null, response)
                    : response;
                if (!this.action.disableStartLoadingActionCreator &&
                    this.config.stopLoadingActionCreator) {
                    this.store.dispatch(this.config.stopLoadingActionCreator());
                }
                this.clearLoadingMeta();
                this.finishLoading(transformedResponse);
                this.executeOnSuccessActions(transformedResponse);
                if (this.action.onSuccess) {
                    this.action.onSuccess(response);
                }
                return transformedResponse;
            }
            catch (error) {
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
                    this.handleError(error);
                    if (this.action.displayNotificationOnError &&
                        this.config.displayErrorActionCreator) {
                        this.store.dispatch(this.config.displayErrorActionCreator(error.message));
                    }
                }
                throw error;
            }
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
    handleError(error) {
        if (this.resourceId) {
            this.store.dispatch(actions_1.updateResourceObjectMeta(this.resourceType, this.resourceId, 'errors', error.errors));
            return;
        }
        this.store.dispatch(actions_1.updateResourceObjectsMeta(this.resourceType, 'errors', error));
    }
    /**
     * Check to see if the provide error is an Authentication expired error
     *
     * @param possibleError
     */
    checkForAuthenticationError(possibleErrors) {
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
exports.middlewareFactory = (config = {}) => {
    return (store) => (next) => (action) => {
        const jsonApiMiddleware = new JsonApiMiddleware(config);
        return jsonApiMiddleware.middleware(store, next, action);
    };
};
exports.default = exports.middlewareFactory();
//# sourceMappingURL=middleware.js.map