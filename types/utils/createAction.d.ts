export interface Action<T extends string> {
    type: T;
}
export interface ActionWithPayload<T extends string, P> extends Action<T> {
    payload: P;
}
/**
 * Create an action whose strong typing is inferred
 * from it's redux action type and optional payload.
 *
 * @param type
 * @param payload
 */
export declare function createAction<T extends string>(type: T): Action<T>;
export declare function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
export default createAction;
