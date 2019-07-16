// External dependencies
import * as React from 'react';
import { ResourceObjectOrObjects } from 'ts-json-api';

// Internal dependencies
import { Omit } from '../../../types/other';
import { JasonApiRequestAction } from '../../actions/jasonApiRequest';
import { useAutoRequest } from '../../hooks/useAutoRequest';
import { UseRequestOptions, UseRequestResult } from '../../hooks/useRequest';

type QueryFactory = (props: any) => JasonApiRequestAction;

interface WithQueryOptions<R extends ResourceObjectOrObjects> {
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
    onError?: UseRequestOptions<R>['onError'];
    onSuccess?: UseRequestOptions<R>['onSuccess'];
    propsToWatch?: string[];
    queryFactory: QueryFactory;
}

export type WithQueryInjectedProps<
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
> = UseRequestResult<D>;

export const withQuery = <
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
>({
    cacheScheme = 'cacheFirst',
    expandResourceObjects = false,
    onError,
    onSuccess,
    propsToWatch = [],
    queryFactory,
}: WithQueryOptions<D>) => <OriginalProps extends WithQueryInjectedProps<D>>(
    BaseComponent: React.ComponentType<OriginalProps>
) => {
    type ExternalProps = Omit<OriginalProps, keyof WithQueryInjectedProps<D>>;

    const WithQuery: React.FunctionComponent<ExternalProps> = externalProps => {
        const action = queryFactory(externalProps);

        const request = useAutoRequest<D>(
            {
                action,
                cacheScheme,
                expandResourceObjects,
                onSuccess,
                onError,
            },
            propsToWatch
        );

        // @ts-ignore
        return <BaseComponent {...externalProps} {...request} />;
    };

    return WithQuery;
};
