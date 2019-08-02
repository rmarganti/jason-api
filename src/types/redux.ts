import { Action as BaseAction, Middleware, MiddlewareAPI } from 'redux';
import { ResourceObjectOrObjects, Response } from 'ts-json-api';

import * as actions from '../redux/actions/actions';
import { JasonAPIRequestAction } from '../redux/actions/jasonApiRequest';
import { ActionsUnion } from './other';
import { StateWithJasonAPI } from './state';

export type JasonAPIAction = ActionsUnion<typeof actions>;

export interface JasonAPIDispatch {
    <Action extends BaseAction>(action: Action): Action;
    <Data extends ResourceObjectOrObjects>(
        metaAction: JasonAPIRequestAction<Data>
    ): Promise<Response<Data>>;
}

export type JasonAPIMiddleware = Middleware<JasonAPIDispatch>;

export type JasonAPIGetState<State extends StateWithJasonAPI> = () => State;

export type JasonAPIMiddlewareApi<
    Dispatch extends JasonAPIDispatch = JasonAPIDispatch,
    State extends StateWithJasonAPI = StateWithJasonAPI
> = MiddlewareAPI<Dispatch, State>;
