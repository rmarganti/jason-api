import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { ResourceObject } from 'ts-json-api';

import { JasonApiState } from '../common-types/state';
import { getResourceObject } from '../redux/selectors';

export interface WithItemOptions {
    resourceType?: string;
    resourceId?: string;
}

export interface WithItemProps {
    data?: ResourceObject;
    id?: string;
}

const withItem = ({ resourceType, resourceId }: WithItemOptions = {}) =>
    connect(
        (
            state: { resourceObjects: JasonApiState },
            { data, id }: WithItemProps
        ) => {
            const resolvedType = data ? data.type : resourceType;
            const resolvedId = data ? data.id : id || resourceId;

            if (!resolvedType || !resolvedId) {
                return {};
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
