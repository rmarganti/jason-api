import { Middleware } from 'redux';
import { ResponseWithData } from 'ts-json-api';

import * as actions from '../redux/actions/actions';
import { JasonApiRequest } from '../redux/actions/jsonApiRequest';
import { ActionsUnion } from './other';

export type JasonApiAction = ActionsUnion<typeof actions>;

export type JasonApiDispatch = <T extends JasonApiRequest>(
    metaAction: T
) => Promise<ResponseWithData>;

export type JasonApiMiddleware = Middleware<JasonApiDispatch>;
