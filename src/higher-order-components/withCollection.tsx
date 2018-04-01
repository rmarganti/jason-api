import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { iAttributes, iResourceObject } from 'ts-json-api';

import { iJasonApiState } from '../common-types/state';
import { getResourceObjects } from '../redux/selectors';
import { simplifyResourceObjects } from '../utils/data';

export interface iWithCollectionOptions {
    resourceType: string;
    ids?: string[];
    expandResourceObjects?: boolean;
}

export interface iWithCollectionProps {
    ids?: string[];
}

export interface iWithCollectionPassedProps extends DispatchProp<any> {
    data: iResourceObject[];
}

const withCollection = ({
    resourceType,
    ids: resourceIds,
    expandResourceObjects = false,
}: iWithCollectionOptions) =>
    connect(
        (
            state: { resourceObjects: iJasonApiState },
            { ids }: iWithCollectionProps
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
