import * as JsonApi from 'ts-json-api/types/structure';

export interface ResourceObjectCollection {
    meta: JsonApi.Meta;
    byId: {
        [index: string]: JsonApi.ResourceObject;
    };
}

export interface StateWithJasonApi {
    [index: string]: JasonApiState;
}

export interface JasonApiState {
    [index: string]: ResourceObjectCollection;
}
