import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { iResourceObject } from 'ts-json-api';

import { iJasonApiState } from '../interfaces/state';
import { getResourceObject } from '../redux/selectors';

export interface iWithItemOptions {
    resourceType?: string;
    resourceId?: string;
}

export interface iWithItemProps {
    data?: iResourceObject;
    id?: string;
}

const withItem = ({ resourceType, resourceId }: iWithItemOptions = {}) =>
    connect(
        (
            state: { resourceObjects: iJasonApiState },
            { data, id }: iWithItemProps
        ) => {
            const resolvedType = data ? data.type : resourceType;
            const resolvedId = data ? data.id : id || resourceId;

            if (!resolvedType || !resolvedId) {
                return { data: {} };
            }

            return {
                data: getResourceObject(
                    state.resourceObjects,
                    resolvedType,
                    resolvedId
                ),
            };
        }
    );

export default withItem;
