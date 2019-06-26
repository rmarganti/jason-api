import { useDispatch } from 'react-redux';
import { Response } from 'ts-json-api';

import { JasonApiRequest } from '../actions';
import { JasonApiDispatch } from '../../types';

type RequestFactory = (...args: any[]) => JasonApiRequest;

/**
 * useRequest()
 * --------------------------------
 * Create a function that dispatches an JasonAPI request action.
 */
export const useRequest = <F extends RequestFactory>(fn: F) => {
    const dispatch = useDispatch<JasonApiDispatch>();

    return (...args: Parameters<F>): Promise<Response> => {
        return dispatch(fn(...args));
    };
};
