import {
    connect,
    DispatchProp,
    InferableComponentEnhancerWithProps,
} from 'react-redux';
import { iResourceObject } from 'ts-json-api';

import { iJasonApiState } from '../interfaces/state';
import { getResourceObjects } from '../redux/selectors';
import { simplifyResourceObjects } from '../utils/data';

export interface iWithCollectionOptions {
    resourceType: string;
    ids?: string[];
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
    ids: resourceIds,
    shouldExpand = false,
}: iWithCollectionOptions) =>
    connect(
        (
            state: { resourceObjects: iJasonApiState },
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
