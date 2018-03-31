"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes = require("./actionTypes");
const state_transformer_1 = require("../state-transformer");
exports.default = (state = {}, action) => {
    if (!action) {
        return state;
    }
    switch (action.type) {
        case actionTypes.LOAD_DATA:
            return state_transformer_1.insertOrUpdateResourceObjects(state, action.payload);
        case actionTypes.ADD_RELATIONSHIP:
            return state_transformer_1.addRelationshipToResourceObject(state, action.payload.resourceType, action.payload.resourceId, action.payload.relationshipKey, action.payload.relationshipObject);
        case actionTypes.REMOVE_RELATIONSHIP:
            return state_transformer_1.removeRelationshipFromResourceObject(state, action.payload.resourceType, action.payload.resourceId, action.payload.relationshipKey, action.payload.relationshipId);
        case actionTypes.SET_RELATIONSHIP:
            return state_transformer_1.setRelationshipOnResourceObject(state, action.payload.resourceType, action.payload.resourceId, action.payload.relationshipKey, action.payload.relationshipObject);
        case actionTypes.CLEAR_RELATIONSHIP:
            return state_transformer_1.clearRelationshipOnResourceObject(state, action.payload.resourceType, action.payload.resourceId, action.payload.relationshipKey);
        case actionTypes.UPDATE_RESOURCE_OBJECTS_META:
            return state_transformer_1.updateResourceObjectsMeta(state, action.payload.resourceType, action.payload.metaKey, action.payload.value);
        case actionTypes.UPDATE_RESOURCE_OBJECT_META:
            return state_transformer_1.updateResourceObjectMeta(state, action.payload.resourceType, action.payload.resourceId, action.payload.metaKey, action.payload.value);
        case actionTypes.UPDATE_RESOURCE_OBJECT:
            return state_transformer_1.updateResourceObject(state, action.payload.resourceType, action.payload.resourceId, action.payload.data);
        case actionTypes.REMOVE_RESOURCE_OBJECT:
            return state_transformer_1.removeResourceObject(state, action.payload.resourceType, action.payload.resourceId);
        case actionTypes.CLEAR_RESOURCE_OBJECT_TYPE:
            return state_transformer_1.clearResourceObjectType(state, action.payload.resourceType);
        case actionTypes.CACHE_QUERY:
            return state_transformer_1.cacheQuery(state, action.payload.key, action.payload.response);
        default:
            return state;
    }
};
//# sourceMappingURL=reducer.js.map