import { Middleware, Action } from 'redux';
import { ResponseWithData } from 'ts-json-api';

import * as actions from '../redux/actions/actions';
import { JasonApiRequestAction } from '../redux/actions/jasonApiRequest';
import { ActionsUnion } from './other';

export type JasonApiAction = ActionsUnion<typeof actions>;

export interface JasonApiDispatch {
    <A extends Action>(action: A): A;
    <A extends JasonApiRequestAction>(metaAction: A): Promise<ResponseWithData>;
}

export type JasonApiMiddleware = Middleware<JasonApiDispatch>;
