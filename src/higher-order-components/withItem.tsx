import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { iResourceObject } from 'ts-json-api';

import { getResourceObject } from '../selectors';
import { iState } from '../interfaces/state';

export interface iWithItemOptions {
    resourceType: string;
    resourceId?: string;
}

export interface iWithItemProps {
    data?: iResourceObject;
    id?: string;
}

const withItem = ({ resourceType, resourceId }: iWithItemOptions) =>
    connect(
        (state: { resourceObjects: iState }, { data, id }: iWithItemProps) => ({
            data: getResourceObject(
                state.resourceObjects,
                data ? data.type : resourceType,
                data ? data.id : id || resourceId
            ),
        })
    );

export default withItem;
