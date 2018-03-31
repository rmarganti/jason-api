import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';
import { iJasonApiState } from '../common-types/state';
import { ActionWithPayload } from '../utils/createAction';
declare const _default: (state?: iJasonApiState, action?: ActionWithPayload<"[JASON API] Load Data", iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[] | iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>> | ActionWithPayload<"[JASON API] Add Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[] | iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
}> | ActionWithPayload<"[JASON API] Set Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipObject: iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[] | iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
}> | ActionWithPayload<"[JASON API] Remove Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
    relationshipId: string;
}> | ActionWithPayload<"[JASON API] Clear Relationship", {
    resourceType: string;
    resourceId: string;
    relationshipKey: string;
}> | ActionWithPayload<"[JASON API] Update Resource Object", {
    resourceType: string;
    resourceId: string;
    data: iAttributes;
}> | ActionWithPayload<"[JASON API] Update Resource Objects Meta", {
    resourceType: string;
    metaKey: string;
    value: any;
}> | ActionWithPayload<"[JASON API] Update Resource Object Meta", {
    resourceType: string;
    resourceId: string;
    metaKey: string;
    value: any;
}> | ActionWithPayload<"[JASON API] Remove Resource Object", {
    resourceType: string;
    resourceId: string;
}> | ActionWithPayload<"[JASON API] Clear Resource Object Type", {
    resourceType: string;
}> | ActionWithPayload<"[JASON API] Cache Query", {
    key: string;
    response: iResponse<iResourceObject<string, iAttributes> | iResourceObject<string, iAttributes>[]>;
}> | undefined) => iJasonApiState;
export default _default;
