import actionNames from './action-names';
import * as actions from './interfaces/actions';
import { iReducer, iJasonApiState } from './interfaces/state';
import {
    addRelationshipToResourceObject,
    clearResourceObjectType,
    insertOrUpdateResourceObjects,
    removeResourceObject,
    removeRelationshipFromResourceObject,
    setRelationshipOnResourceObject,
    updateResourceObject,
    updateResourceObjectsMeta,
    updateResourceObjectMeta,
    clearRelationshipOnResourceObject,
    cacheQuery,
} from './state-transformer';

const reducerMap = {
    [actionNames.LOAD_JSON_API_ENTITY_DATA]: (
        state: iJasonApiState,
        action: actions.iLoadAction
    ) => insertOrUpdateResourceObjects(state, action.data),

    [actionNames.ADD_RELATIONSHIP_TO_ENTITY]: (
        state: iJasonApiState,
        action: actions.iAddRelationshipAction
    ) =>
        addRelationshipToResourceObject(
            state,
            action.resourceType,
            action.resourceId,
            action.relationshipKey,
            action.relationshipObject
        ),

    [actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY]: (
        state: iJasonApiState,
        action: actions.iRemoveRelationshipAction
    ) =>
        removeRelationshipFromResourceObject(
            state,
            action.resourceType,
            action.resourceId,
            action.relationshipKey,
            action.relationshipId
        ),

    [actionNames.SET_RELATIONSHIP_ON_ENTITY]: (
        state: iJasonApiState,
        action: actions.iSetRelationshipAction
    ) =>
        setRelationshipOnResourceObject(
            state,
            action.resourceType,
            action.resourceId,
            action.relationshipKey,
            action.relationshipObject
        ),

    [actionNames.CLEAR_RELATIONSHIP_ON_ENTITY]: (
        state: iJasonApiState,
        action: actions.iClearRelationshipAction
    ) =>
        clearRelationshipOnResourceObject(
            state,
            action.resourceType,
            action.resourceId,
            action.relationshipKey
        ),

    [actionNames.UPDATE_ENTITIES_META]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectsMetaAction
    ) =>
        updateResourceObjectsMeta(
            state,
            action.resourceType,
            action.metaKey,
            action.value
        ),

    [actionNames.UPDATE_ENTITY_META]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectMetaAction
    ) =>
        updateResourceObjectMeta(
            state,
            action.resourceType,
            action.resourceId,
            action.metaKey,
            action.value
        ),

    [actionNames.UPDATE_ENTITY]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectAction
    ) =>
        updateResourceObject(
            state,
            action.resourceType,
            action.resourceId,
            action.data
        ),

    [actionNames.REMOVE_ENTITY]: (
        state: iJasonApiState,
        action: actions.iRemoveResourceObjectAction
    ) => removeResourceObject(state, action.resourceType, action.resourceId),

    [actionNames.CLEAR_ENTITY_TYPE]: (
        state: iJasonApiState,
        action: actions.iClearResourceObjectTypeAction
    ) => clearResourceObjectType(state, action.resourceType),

    [actionNames.CACHE_QUERY]: (
        state: iJasonApiState,
        action: actions.iCacheQueryAction
    ) => cacheQuery(state, action.url, action.response),

    default: (state: iJasonApiState) => state,
};

/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default (state: iJasonApiState = {}, action?: actions.Action) => {
    const actionKey =
        action &&
        Object.keys(reducerMap).find(
            key =>
                action.type &&
                !!action.type.match(new RegExp(`^${key}(_[_A-Z]+)?$`))
        );

    if (actionKey) {
        return (<iReducer>reducerMap[actionKey])(state, action);
    }

    return reducerMap.default(state);
};
