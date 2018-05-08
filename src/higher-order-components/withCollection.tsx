import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { Attributes, Links, Relationships, ResourceObjects } from 'ts-json-api';

import { JasonApiState, StateWithJasonApi } from '../common-types/state';
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
    data: ResourceObjects | undefined;
}

const withCollection = ({
    resourceType,
    ids: resourceIds,
    expandResourceObjects = false,
}: WithCollectionOptions) =>
    connect((state: StateWithJasonApi, { ids }: WithCollectionProps) => ({
        data: getResourceObjects(
            state.resourceObjects,
            resourceType,
            ids || resourceIds,
            expandResourceObjects
        ),
    }));

export default withCollection;
