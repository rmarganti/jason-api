import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { ResourceObject } from 'ts-json-api';

import { getResourceObjects } from '../redux/selectors';
import { StateWithJasonApi } from '../types/state';

export interface WithCollectionOptions {
    resourceType: string;
    ids?: string[];
    expandResourceObjects?: boolean;
}

export interface WithCollectionInjectedProps<
    D extends ResourceObject = ResourceObject
> {
    data?: D[];
    ids?: string[];
}

const withCollection = ({
    resourceType,
    ids: resourceIds,
    expandResourceObjects = false,
}: WithCollectionOptions) => <
    OriginalProps extends WithCollectionInjectedProps
>(
    UnwrappedComponent: ComponentType<OriginalProps>
) =>
    connect((state: StateWithJasonApi, { ids }: OriginalProps) => ({
        data: getResourceObjects(
            state.jasonApi,
            resourceType,
            ids || resourceIds,
            expandResourceObjects
        ),
    }))(UnwrappedComponent as any);

export default withCollection;
