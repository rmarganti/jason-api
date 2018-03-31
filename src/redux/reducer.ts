import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';

import { iJasonApiState } from '../common-types/state';
import * as actions from '../redux/actions';
import { ActionWithPayload } from '../utils/createAction';
import * as actionTypes from './actionTypes';
import JasonApiAction from './JsonApiAction';

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
} from '../state-transformer';

export default (state: iJasonApiState = {}, action?: JasonApiAction) => {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case actionTypes.LOAD_DATA:
            return insertOrUpdateResourceObjects(state, action.payload);

        case actionTypes.ADD_RELATIONSHIP:
            return addRelationshipToResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.relationshipKey,
                action.payload.relationshipObject
            );

        case actionTypes.REMOVE_RELATIONSHIP:
            return removeRelationshipFromResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.relationshipKey,
                action.payload.relationshipId
            );

        case actionTypes.SET_RELATIONSHIP:
            return setRelationshipOnResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.relationshipKey,
                action.payload.relationshipObject
            );

        case actionTypes.CLEAR_RELATIONSHIP:
            return clearRelationshipOnResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.relationshipKey
            );

        case actionTypes.UPDATE_RESOURCE_OBJECTS_META:
            return updateResourceObjectsMeta(
                state,
                action.payload.resourceType,
                action.payload.metaKey,
                action.payload.value
            );


        case actionTypes.UPDATE_RESOURCE_OBJECT_META:
            return updateResourceObjectMeta(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.metaKey,
                action.payload.value
            );

        case actionTypes.UPDATE_RESOURCE_OBJECT:
            return updateResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId,
                action.payload.data
            );

        case actionTypes.REMOVE_RESOURCE_OBJECT:
            return removeResourceObject(
                state,
                action.payload.resourceType,
                action.payload.resourceId
            );

        case actionTypes.CLEAR_RESOURCE_OBJECT_TYPE:
            return clearResourceObjectType(state, action.payload.resourceType);

        case actionTypes.CACHE_QUERY:
            return cacheQuery(
                state,
                action.payload.key,
                action.payload.response
            );

        default:
            return state;
    }
};
