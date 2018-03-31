import { iMeta, iResourceObject } from 'ts-json-api';

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
