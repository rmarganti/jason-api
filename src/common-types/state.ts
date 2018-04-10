import { Meta, ResourceObject } from 'ts-json-api';

export interface ResourceObjectCollection {
    meta: Meta;
    byId: {
        [index: string]: ResourceObject;
    };
}

export interface StateWithJasonApi {
    [index: string]: JasonApiState;
}

export interface JasonApiState {
    [index: string]: ResourceObjectCollection;
}
