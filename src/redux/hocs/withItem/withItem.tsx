import * as React from 'react';
import { ResourceObject, ResourceIdentifier } from 'ts-json-api';

import { Omit } from '../../../types/other';
import { useItem } from '../../hooks';

interface WithItemOptions {
    resourceType?: string;
    resourceId?: string;
}

export interface WithItemInjectedProps<
    Data extends ResourceObject = ResourceObject
> {
    data: Data;
}

export const withItem = <Data extends ResourceObject = ResourceObject>({
    resourceType,
    resourceId,
}: WithItemOptions = {}) => <OriginalProps extends WithItemInjectedProps<Data>>(
    BaseComponent: React.ComponentType<OriginalProps>
) => {
    type ExternalProps = Omit<OriginalProps, 'data'> & {
        data?: ResourceIdentifier<Data>;
        id?: string;
    };

    const WithItem: React.FunctionComponent<ExternalProps> = externalProps => {
        const { data, id } = externalProps;

        const resolvedType = data ? data.type : resourceType;
        const resolvedId = data ? data.id : id || resourceId;

        const item =
            resolvedType && resolvedId
                ? useItem<Data>(resolvedType, resolvedId)
                : undefined;

        // @ts-ignore
        return <BaseComponent {...externalProps} data={item} />;
    };

    return WithItem;
};
