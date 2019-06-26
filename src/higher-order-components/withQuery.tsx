import { equals, pathOr, pickAll } from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Response, ResourceObjectOrObjects } from 'ts-json-api';

import { getCachedQuery } from '../redux/selectors';
import { Omit } from '../types/other';
import { StateWithJasonApi } from '../types/state';
import { hashObject } from '../utils/data';

export type QueryFactory = (dispatch: Dispatch, props: any) => any;

export interface WithQueryOptions {
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
    propsToWatch?: string[];
    queryFactory: QueryFactory;
}

export interface ConnectedProps {
    cachedQuery: Response | undefined;
    fetchData: () => any;
}

export interface WithQueryInjectedProps<
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
> extends Response<D> {
    isLoading?: boolean;
    refetch?: () => void;
}

const withQuery = ({
    cacheScheme = 'cacheFirst',
    expandResourceObjects = false,
    queryFactory,
    propsToWatch = [],
}: WithQueryOptions) => <OriginalProps extends {}>(
    BaseComponent: React.ComponentType<OriginalProps & WithQueryInjectedProps>
) => {
    type ExternalProps = Omit<OriginalProps, keyof WithQueryInjectedProps>;
    type InternalProps = ExternalProps & ConnectedProps;

    class WithQuery extends React.Component<InternalProps> {
        static displayName = `WithQuery(${BaseComponent.displayName ||
            BaseComponent.name})`;

        constructor(props: InternalProps) {
            super(props);

            this.state = {
                isLoading: false,
                queryResult: props.cachedQuery,
            };
        }

        /**
         * Execute `queryFactory`, keep track of loading state,
         * and cache queries appropriately.
         */
        refetch = () => {
            const { fetchData } = this.props;
            fetchData();
        };

        /**
         * Execute initial query. A cache scheme of `noCache` will
         * never trigger this. A cache scheme of `cacheOnly` will
         * only trigger it if there is not already a cached query.
         */
        componentDidMount() {
            if (
                cacheScheme === 'noCache' ||
                (cacheScheme === 'cacheOnly' && this.props.cachedQuery)
            ) {
                return;
            }

            this.refetch();
        }

        /**
         * Execute a refetch of the query if any
         * of the `propsToWatch` has changed.
         *
         * @param prevProps
         */
        componentDidUpdate(prevProps: InternalProps) {
            const hasChanged = !equals(
                pickAll(propsToWatch, prevProps),
                pickAll(propsToWatch, this.props)
            );

            if (!hasChanged) {
                return;
            }

            this.refetch();
        }

        /**
         * @inheritDoc
         */
        render() {
            const { cachedQuery, fetchData, ...rest } = this.props;
            const isLoading = pathOr(false, ['meta', 'isLoading'], cachedQuery);

            return (
                <BaseComponent
                    isLoading={isLoading}
                    refetch={this.refetch}
                    {...cachedQuery}
                    {...rest}
                />
            );
        }
    }

    const mapStateToProps = (
        state: StateWithJasonApi,
        ownProps: ExternalProps
    ) => ({
        cachedQuery:
            cacheScheme !== 'noCache'
                ? getCachedQuery(
                      state.jasonApi,
                      hashQuery(queryFactory, ownProps),
                      expandResourceObjects
                  )
                : undefined,
    });

    const mapDispatchToProps = (dispatch: any, ownProps: ExternalProps) => ({
        fetchData: () => queryFactory(dispatch as JasonApiDispatch, ownProps),
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(WithQuery);
};

/**
 * Generate a unique id for a `queryFactory`
 * called with a specific set of props.
 *
 * @param queryFactory
 * @param props
 */
const hashQuery = (queryFactory: QueryFactory, props: object): string =>
    hashObject({
        queryFactory,
        props,
    });

export default withQuery;
