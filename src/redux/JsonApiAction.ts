import * as actions from './actions';
import { ActionsUnion } from '../common-types/other';
import { AnyAction } from 'redux';

export type JasonApiAction = ActionsUnion<typeof actions>;

export default JasonApiAction;
