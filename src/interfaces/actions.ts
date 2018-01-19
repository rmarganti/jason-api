import {
    iAttributes,
    iJsonApiResponse,
    iJsonApiResponseWithData,
    iResourceObject,
} from 'ts-json-api';

import { FlexiblePayload } from './other';

export interface iLoadAction {
    type: string;
    data: FlexiblePayload;
}

export interface iAddRelationshipAction {
    type: string;
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: FlexiblePayload;
}

export interface iRemoveRelationshipAction {
    type: string;
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipId: string;
}

export interface iSetRelationshipAction {
    type: string;
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: FlexiblePayload;
}

export interface iClearRelationshipAction {
    type: string;
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
}

export interface iUpdateResourceObjectsMetaAction {
    type: string;
    resourceType: string;
    metaKey: string;
    value: any;
}

export interface iUpdateResourceObjectMetaAction {
    type: string;
    resourceType: string;
    resourceId: string;
    metaKey: string;
    value: any;
}

export interface iUpdateResourceObjectAction {
    type: string;
    resourceType: string;
    resourceId: string;
    data: iAttributes;
}

export interface iRemoveResourceObjectAction {
    type: string;
    resourceType: string;
    resourceId: string;
}

export interface iClearResourceObjectTypeAction {
    type: string;
    resourceType: string;
}

export interface iCacheQueryAction {
    type: string;
    response: iJsonApiResponse;
    url: string;
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
