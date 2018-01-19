import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { iResourceObject } from 'ts-json-api';

import { iState } from '../interfaces/state';
import { getResourceObjects } from '../selectors';
import { simplifyResourceObjects } from '../utils';

export interface iWithCollectionOptions {
    resourceType: string;
    resourceIds?: string[];
    shouldExpand?: boolean;
}

export interface iWithCollectionProps {
    ids: string[];
}

export interface iWithCollectionPassedProps extends DispatchProp<any> {
    data: iResourceObject[];
}

const expandResourceObjects = (
    shouldExpand = false,
    resourceObjects: iResourceObject[] = []
) =>
    shouldExpand ? resourceObjects : simplifyResourceObjects(resourceObjects);

const withCollection = ({
    resourceType,
    resourceIds,
    shouldExpand = false,
}: iWithCollectionOptions) =>
    connect(
        (
            state: { resourceObjects: iState },
            { ids }: iWithCollectionProps
        ) => ({
            data: expandResourceObjects(
                shouldExpand,
                getResourceObjects(
                    state.resourceObjects,
                    resourceType,
                    ids || resourceIds
                )
            ),
        })
    );

export default withCollection;
