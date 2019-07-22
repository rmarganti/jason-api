import { Action, Middleware, MiddlewareAPI } from 'redux';
import { ResourceObjectOrObjects, Response } from 'ts-json-api';

import * as actions from '../redux/actions/actions';
import { JasonApiRequestAction } from '../redux/actions/jasonApiRequest';
import { ActionsUnion } from './other';
import { StateWithJasonApi } from './state';

export type JasonApiAction = ActionsUnion<typeof actions>;

export interface JasonApiDispatch {
    <A extends Action>(action: A): A;
    <D extends ResourceObjectOrObjects>(
        metaAction: JasonApiRequestAction<D>
    ): Promise<Response<D>>;
}

export type JasonApiMiddleware = Middleware<JasonApiDispatch>;

export type JasonApiMiddlewareApi = MiddlewareAPI<
    JasonApiDispatch,
    StateWithJasonApi
>;
