import { iMeta, iResourceObject } from 'ts-json-api';
import { Action } from './actions';
export interface iResourceObjectCollection {
    meta: iMeta;
    byId: {
        [index: string]: iResourceObject;
    };
}
export interface iStateWithJasonApi {
    [index: string]: iJasonApiState;
}
export interface iJasonApiState {
    [index: string]: iResourceObjectCollection;
}
export interface iReducer {
    (state: iJasonApiState, action: Action): iJasonApiState;
}
