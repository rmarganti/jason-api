// External dependencies
import * as React from 'react';
import { ResourceObject } from 'ts-json-api';

// Internal dependencies
import { Omit } from '../../../types/other';
import { useCollection } from '../../hooks';

interface WithCollectionOptions {
    resourceType: string;
    resourceIds?: string[];
}

export interface WithCollectionInjectedProps<
    D extends ResourceObject = ResourceObject
> {
    data: D[];
}

export const withCollection = <D extends ResourceObject = ResourceObject>({
    resourceType,
    resourceIds,
}: WithCollectionOptions) => <
    OriginalProps extends WithCollectionInjectedProps<D>
>(
    BaseComponent: React.ComponentType<OriginalProps>
) => {
    type ExternalProps = Omit<OriginalProps, 'data'> & {
        ids?: string[];
    };

    const WithCollection: React.FunctionComponent<
        ExternalProps
    > = externalProps => {
        const { ids } = externalProps;
        const resolvedIds = ids || resourceIds;

        const collection = useCollection<D>(resourceType, resolvedIds) || [];

        // @ts-ignore
        return <BaseComponent {...externalProps} data={collection} />;
    };

    return WithCollection;
};
