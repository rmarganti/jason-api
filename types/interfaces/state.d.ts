import { iMeta, iResourceObject } from 'ts-json-api';
import { Action } from './actions';
export interface iResourceObjectCollection {
    meta: iMeta;
    byId: {
        [index: string]: iResourceObject;
    };
}
export interface iState {
    [index: string]: iResourceObjectCollection;
}
export interface iReducer {
    (state: iState, action: Action): iState;
}
