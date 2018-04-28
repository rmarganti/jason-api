import { equals, omit, pickAll } from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { Response, ResourceObjectOrObjects } from 'ts-json-api';
import { JasonApiDispatch } from '../common-types/middleware';
import { StateWithJasonApi } from '../common-types/state';
import { cacheQuery } from '../redux/actions';
import { getCachedQuery } from '../redux/selectors';
import { hashObject, simplifyJsonApi } from '../utils/data';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type QueryFactory = (
    dispatch: JasonApiDispatch,
    props: any
) => Promise<Response>;

export interface WithQueryOptions {
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
    propsToWatch?: string[];
    queryFactory: QueryFactory;
    stateBranch?: string;
}

export interface ConnectedProps {
    cachedQuery: Response | undefined;
    cacheQueryResult: (response: Response) => void;
    fetchData: () => Promise<Response>;
}

export interface WithQueryInjectedProps<
    D extends ResourceObjectOrObjects = ResourceObjectOrObjects
> extends Response<D> {
    isLoading?: boolean;
    refetch?: () => void;
}

type State = {
    isLoading: boolean;
    queryResult?: Response;
};

const withQuery = ({
    cacheScheme = 'cacheFirst',
    expandResourceObjects = false,
    queryFactory,
    propsToWatch = [],
    stateBranch = 'resourceObjects',
}: WithQueryOptions) => <OriginalProps extends {}>(
    BaseComponent: React.ComponentType<OriginalProps & WithQueryInjectedProps>
) => {
    type ExternalProps = Omit<OriginalProps, keyof WithQueryInjectedProps>;
    type InternalProps = ExternalProps & ConnectedProps;

    class WithQuery extends React.Component<InternalProps, State> {
        static displayName = `WithQuery(${BaseComponent.displayName ||
            BaseComponent.name})`;

        readonly state: State;

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
            this.setState({ isLoading: true });

            const { fetchData, cacheQueryResult } = this.props;

            fetchData!()
                .then(response => {
                    this.setState({
                        isLoading: false,
                        queryResult: expandResourceObjects
                            ? response
                            : simplifyJsonApi(response),
                    });

                    cacheQueryResult!(response);
                })
                .catch(errors => {
                    this.setState(({ queryResult }) => ({
                        isLoading: false,
                        queryResult: {
                            ...queryResult,
                            ...errors,
                        },
                    }));
                });
        };

        /**
         * Execute initial query. A cache scheme of `noCache` will
         * never trigger this. A cache scheme of `cacheOnly` will
         * only trigger it if there is not already a cached query.
         */
        componentDidMount() {
            if (
                cacheScheme === 'noCache' ||
                (cacheScheme === 'cacheOnly' && this.state.queryResult)
            ) {
                return;
            }

            this.refetch();
        }

        /**
         * Execute a referch of the query if any
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
            const passedProps = omit(['cachedQuery', 'fetchData'], this.props);
            const { isLoading, queryResult } = this.state;

            return (
                <BaseComponent
                    isLoading={isLoading}
                    refetch={this.refetch}
                    {...passedProps}
                    {...queryResult}
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
                      state[stateBranch],
                      hashQuery(queryFactory, ownProps),
                      expandResourceObjects
                  )
                : undefined,
    });

    const mapDispatchToProps = (dispatch: any, ownProps: ExternalProps) => ({
        fetchData: () => queryFactory(dispatch as JasonApiDispatch, ownProps),
        cacheQueryResult: (result: Response) => {
            dispatch(cacheQuery(hashQuery(queryFactory, ownProps), result));
        },
    });

    return connect(mapStateToProps, mapDispatchToProps)(WithQuery);
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
