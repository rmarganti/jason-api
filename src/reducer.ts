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
    ) => insertOrUpdateResourceObjects(state, action.payload.data),

    [actionNames.ADD_RELATIONSHIP_TO_ENTITY]: (
        state: iJasonApiState,
        action: actions.iAddRelationshipAction
    ) =>
        addRelationshipToResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.relationshipKey,
            action.payload.relationshipObject
        ),

    [actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY]: (
        state: iJasonApiState,
        action: actions.iRemoveRelationshipAction
    ) =>
        removeRelationshipFromResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.relationshipKey,
            action.payload.relationshipId
        ),

    [actionNames.SET_RELATIONSHIP_ON_ENTITY]: (
        state: iJasonApiState,
        action: actions.iSetRelationshipAction
    ) =>
        setRelationshipOnResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.relationshipKey,
            action.payload.relationshipObject
        ),

    [actionNames.CLEAR_RELATIONSHIP_ON_ENTITY]: (
        state: iJasonApiState,
        action: actions.iClearRelationshipAction
    ) =>
        clearRelationshipOnResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.relationshipKey
        ),

    [actionNames.UPDATE_ENTITIES_META]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectsMetaAction
    ) =>
        updateResourceObjectsMeta(
            state,
            action.payload.resourceType,
            action.payload.metaKey,
            action.payload.value
        ),

    [actionNames.UPDATE_ENTITY_META]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectMetaAction
    ) =>
        updateResourceObjectMeta(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.metaKey,
            action.payload.value
        ),

    [actionNames.UPDATE_ENTITY]: (
        state: iJasonApiState,
        action: actions.iUpdateResourceObjectAction
    ) =>
        updateResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId,
            action.payload.data
        ),

    [actionNames.REMOVE_ENTITY]: (
        state: iJasonApiState,
        action: actions.iRemoveResourceObjectAction
    ) =>
        removeResourceObject(
            state,
            action.payload.resourceType,
            action.payload.resourceId
        ),

    [actionNames.CLEAR_ENTITY_TYPE]: (
        state: iJasonApiState,
        action: actions.iClearResourceObjectTypeAction
    ) => clearResourceObjectType(state, action.payload.resourceType),

    [actionNames.CACHE_QUERY]: (
        state: iJasonApiState,
        action: actions.iCacheQueryAction
    ) => cacheQuery(state, action.payload.url, action.payload.response),
};

/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default (
    state: iJasonApiState = {},
    action?: actions.Action
): iJasonApiState => {
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

    return state;
};
