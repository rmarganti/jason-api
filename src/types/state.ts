import { Meta, ResourceObject, Response } from 'ts-json-api';

export interface ResourceObjectCollection {
    meta: Meta;
    byId: {
        [index: string]: ResourceObject;
    };
}

export interface StateWithJasonAPI {
    jasonApi: JasonAPIState;
}

export interface JasonAPIState {
    resourceObjects: ResourceObjectsState;
    queries: QueriesState;
}

export interface ResourceObjectsState {
    [index: string]: ResourceObjectCollection;
}

export interface QueriesState {
    [index: string]: Response;
}
