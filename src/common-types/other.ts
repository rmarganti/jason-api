import * as JsonApi from 'ts-json-api/types/structure';
import { AnyAction } from 'redux';

export type FlexiblePayload =
    | JsonApi.ResourceObject
    | JsonApi.ResourceObject[]
    | JsonApi.Response;

export type FunctionType = (...args: any[]) => any;

export type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
    A[keyof A]
>;
