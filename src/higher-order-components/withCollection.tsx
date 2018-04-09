import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import * as JsonApi from 'ts-json-api/types/structure';

import { JasonApiState } from '../common-types/state';
import { getResourceObjects } from '../redux/selectors';
import { simplifyResourceObjects } from '../utils/data';

export interface WithCollectionOptions {
    resourceType: string;
    ids?: string[];
    expandResourceObjects?: boolean;
}

export interface WithCollectionProps {
    ids?: string[];
}

export interface WithCollectionPassedProps extends DispatchProp<any> {
    data: JsonApi.ResourceObjects | undefined;
}

const withCollection = ({
    resourceType,
    ids: resourceIds,
    expandResourceObjects = false,
}: WithCollectionOptions) =>
    connect(
        (
            state: { resourceObjects: JasonApiState },
            { ids }: WithCollectionProps
        ) => ({
            data: getResourceObjects(
                state.resourceObjects,
                resourceType,
                ids || resourceIds,
                expandResourceObjects
            ),
        })
    );

export default withCollection;
