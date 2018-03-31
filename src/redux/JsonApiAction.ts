import * as actions from './actions';

export type FunctionType = (...args: any[]) => any;

export type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
    A[keyof A]
>;

export type JasonApiAction = ActionsUnion<typeof actions>;

export default JasonApiAction;
