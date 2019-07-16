import * as React from 'react';
import { ResourceObject, ResourceIdentifier } from 'ts-json-api';

import { Omit } from '../../../types';
import { useItem } from '../../hooks';

interface WithItemOptions {
    resourceType?: string;
    resourceId?: string;
}

export interface WithItemInjectedProps<
    D extends ResourceObject = ResourceObject
> {
    data: D;
}

export const withItem = <D extends ResourceObject = ResourceObject>({
    resourceType,
    resourceId,
}: WithItemOptions = {}) => <OriginalProps extends WithItemInjectedProps<D>>(
    BaseComponent: React.ComponentType<OriginalProps>
) => {
    type ExternalProps = Omit<OriginalProps, 'data'> & {
        data?: ResourceIdentifier<D>;
        id?: string;
    };

    const WithItem: React.FunctionComponent<ExternalProps> = externalProps => {
        const { data, id } = externalProps;

        const resolvedType = data ? data.type : resourceType;
        const resolvedId = data ? data.id : id || resourceId;

        const item =
            resolvedType && resolvedId
                ? useItem<D>(resolvedType, resolvedId)
                : undefined;

        // @ts-ignore
        return <BaseComponent {...externalProps} data={item} />;
    };

    return WithItem;
};
