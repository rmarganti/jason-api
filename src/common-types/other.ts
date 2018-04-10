import { Response, ResourceObjectOrObjects } from 'ts-json-api';
import { AnyAction } from 'redux';

export type FlexiblePayload = ResourceObjectOrObjects | Response;

export type FunctionType = (...args: any[]) => any;

export type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
    A[keyof A]
>;
