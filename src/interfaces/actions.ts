import {
    iAttributes,
    iJsonApiResponse,
    iJsonApiResponseWithData,
    iResourceObject,
} from 'ts-json-api';

import { FlexiblePayload } from './other';

export interface iLoadAction {
    type: string;
    payload: {
        data: FlexiblePayload;
    };
}

export interface iAddRelationshipAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        relationshipKey: string;
        relationshipObject: FlexiblePayload;
    };
}

export interface iRemoveRelationshipAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        relationshipKey: string;
        relationshipId: string;
    };
}

export interface iSetRelationshipAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        relationshipKey: string;
        relationshipObject: FlexiblePayload;
    };
}

export interface iClearRelationshipAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        relationshipKey: string;
    };
}

export interface iUpdateResourceObjectsMetaAction {
    type: string;
    payload: {
        resourceType: string;
        metaKey: string;
        value: any;
    };
}

export interface iUpdateResourceObjectMetaAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        metaKey: string;
        value: any;
    };
}

export interface iUpdateResourceObjectAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
        data: iAttributes;
    };
}

export interface iRemoveResourceObjectAction {
    type: string;
    payload: {
        resourceType: string;
        resourceId: string;
    };
}

export interface iClearResourceObjectTypeAction {
    type: string;
    payload: {
        resourceType: string;
    };
}

export interface iCacheQueryAction {
    type: string;
    payload: {
        key: string;
        response: iJsonApiResponse;
    };
}

export type Action =
    | iLoadAction
    | iAddRelationshipAction
    | iRemoveRelationshipAction
    | iSetRelationshipAction
    | iUpdateResourceObjectsMetaAction
    | iUpdateResourceObjectMetaAction
    | iUpdateResourceObjectAction
    | iRemoveResourceObjectAction
    | iClearResourceObjectTypeAction;
