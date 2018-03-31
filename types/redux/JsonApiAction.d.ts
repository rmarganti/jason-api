import * as actions from './actions';
export declare type FunctionType = (...args: any[]) => any;
export declare type ActionCreatorsMapObject = {
    [actionCreator: string]: FunctionType;
};
export declare type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
export declare type JasonApiAction = ActionsUnion<typeof actions>;
export default JasonApiAction;
