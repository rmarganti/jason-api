"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_names_1 = require("./action-names");
const state_transformer_1 = require("./state-transformer");
const reducerMap = {
    [action_names_1.default.LOAD_JSON_API_ENTITY_DATA]: (state, action) => state_transformer_1.insertOrUpdateResourceObjects(state, action.data),
    [action_names_1.default.ADD_RELATIONSHIP_TO_ENTITY]: (state, action) => state_transformer_1.addRelationshipToResourceObject(state, action.resourceType, action.resourceId, action.relationshipKey, action.relationshipObject),
    [action_names_1.default.REMOVE_RELATIONSHIP_FROM_ENTITY]: (state, action) => state_transformer_1.removeRelationshipFromResourceObject(state, action.resourceType, action.resourceId, action.relationshipKey, action.relationshipId),
    [action_names_1.default.SET_RELATIONSHIP_ON_ENTITY]: (state, action) => state_transformer_1.setRelationshipOnResourceObject(state, action.resourceType, action.resourceId, action.relationshipKey, action.relationshipObject),
    [action_names_1.default.CLEAR_RELATIONSHIP_ON_ENTITY]: (state, action) => state_transformer_1.clearRelationshipOnResourceObject(state, action.resourceType, action.resourceId, action.relationshipKey),
    [action_names_1.default.UPDATE_ENTITIES_META]: (state, action) => state_transformer_1.updateResourceObjectsMeta(state, action.resourceType, action.metaKey, action.value),
    [action_names_1.default.UPDATE_ENTITY_META]: (state, action) => state_transformer_1.updateResourceObjectMeta(state, action.resourceType, action.resourceId, action.metaKey, action.value),
    [action_names_1.default.UPDATE_ENTITY]: (state, action) => state_transformer_1.updateResourceObject(state, action.resourceType, action.resourceId, action.data),
    [action_names_1.default.REMOVE_ENTITY]: (state, action) => state_transformer_1.removeResourceObject(state, action.resourceType, action.resourceId),
    [action_names_1.default.CLEAR_ENTITY_TYPE]: (state, action) => state_transformer_1.clearResourceObjectType(state, action.resourceType),
    default: (state) => state,
};
/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
exports.default = (state = {}, action) => {
    const actionKey = action &&
        Object.keys(reducerMap).find(key => action.type &&
            !!action.type.match(new RegExp(`^${key}(_[_A-Z]+)?$`)));
    if (actionKey) {
        return reducerMap[actionKey](state, action);
    }
    return reducerMap.default(state);
};
//# sourceMappingURL=reducer.js.map