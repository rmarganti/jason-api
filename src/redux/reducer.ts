import * as JsonApi from 'ts-json-api/types/structure';
import { AnyAction } from 'redux';
import { JasonApiState } from '../common-types/state';
import {
    addRelationshipToResourceObject,
    cacheQuery,
    clearRelationshipOnResourceObject,
    clearResourceObjectType,
    insertOrUpdateResourceObjects,
    removeRelationshipFromResourceObject,
    removeResourceObject,
    setRelationshipOnResourceObject,
    updateResourceObject,
    updateResourceObjectMeta,
    updateResourceObjectsMeta,
} from '../state-transformer';
import { ActionWithPayload } from '../utils/createAction';
import JasonApiAction from './JsonApiAction';
import * as actionTypes from './actionTypes';

export default (state: JasonApiState = {}, action?: AnyAction) => {
    if (!action) {
        return state;
    }

    const jAction = action as JasonApiAction;

    switch (jAction.type) {
        case actionTypes.LOAD_DATA:
            return insertOrUpdateResourceObjects(state, jAction.payload);

        case actionTypes.ADD_RELATIONSHIP:
            return addRelationshipToResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.relationshipKey,
                jAction.payload.relationshipObject
            );

        case actionTypes.REMOVE_RELATIONSHIP:
            return removeRelationshipFromResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.relationshipKey,
                jAction.payload.relationshipId
            );

        case actionTypes.SET_RELATIONSHIP:
            return setRelationshipOnResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.relationshipKey,
                jAction.payload.relationshipObject
            );

        case actionTypes.CLEAR_RELATIONSHIP:
            return clearRelationshipOnResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.relationshipKey
            );

        case actionTypes.UPDATE_RESOURCE_OBJECTS_META:
            return updateResourceObjectsMeta(
                state,
                jAction.payload.resourceType,
                jAction.payload.metaKey,
                jAction.payload.value
            );

        case actionTypes.UPDATE_RESOURCE_OBJECT_META:
            return updateResourceObjectMeta(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.metaKey,
                jAction.payload.value
            );

        case actionTypes.UPDATE_RESOURCE_OBJECT:
            return updateResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId,
                jAction.payload.data
            );

        case actionTypes.REMOVE_RESOURCE_OBJECT:
            return removeResourceObject(
                state,
                jAction.payload.resourceType,
                jAction.payload.resourceId
            );

        case actionTypes.CLEAR_RESOURCE_OBJECT_TYPE:
            return clearResourceObjectType(state, jAction.payload.resourceType);

        case actionTypes.CACHE_QUERY:
            return cacheQuery(
                state,
                jAction.payload.key,
                jAction.payload.response
            );

        default:
            return state;
    }
};
