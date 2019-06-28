import { ResourceObjectOrObjects, ResponseWithData } from 'ts-json-api';

/**
 * Remove from object T any properties with key of K.
 *
 * ```ts
 * type Input = { one: 'string', two: 'string', three: 'string'};
 * type Result = Omit<Input, 'two' | 'three'>;
 * // Result = { one: 'string' };
 * ```
 */
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type FlexiblePayload = ResourceObjectOrObjects | ResponseWithData;

export type FunctionType = (...args: any[]) => any;

export type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
    A[keyof A]
>;
