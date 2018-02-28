import { ActionCreator } from 'redux';
export interface MiddlewareConfig {
    startLoadingActionCreator?: ActionCreator<any>;
    stopLoadingActionCreator?: ActionCreator<any>;
    displayErrorActionCreator?: ActionCreator<any>;
    authenticationExpiredActionCreator?: ActionCreator<any>;
}
export interface Payload {
    [index: string]: any;
}
/**
 * Handle JASON_API_REQUEST actions
 *
 * @param dispatch
 */
export declare const middlewareFactory: (config?: MiddlewareConfig) => any;
declare const _default: any;
export default _default;
