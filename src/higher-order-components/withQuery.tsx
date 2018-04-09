import { equals, omit, pickAll } from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import * as JsonApi from 'ts-json-api/types/structure';
import { JasonApiDispatch } from '../common-types/middleware';
import { StateWithJasonApi } from '../common-types/state';
import { cacheQuery } from '../redux/actions';
import { getCachedQuery } from '../redux/selectors';
import { hashObject, simplifyJsonApi } from '../utils/data';

type Diff<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];

type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type QueryFactory = (
    dispatch: JasonApiDispatch,
    props: any
) => Promise<JsonApi.Response>;

export interface WithQueryOptions {
    cacheScheme?: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects?: boolean;
    propsToWatch?: string[];
    queryFactory: QueryFactory;
    stateBranch?: string;
}

export interface MapStateProps {
    cachedQuery: JsonApi.Response | undefined;
}

export interface MapDispatchProps {
    cacheQueryResult: (response: JsonApi.Response) => any;
    fetchData: () => Promise<JsonApi.Response>;
}

export type ConnectedProps = MapStateProps & MapDispatchProps;

export interface InjectedProps extends JsonApi.Response {
    isLoading?: boolean;
    refetch?: () => void;
}

type State = {
    isLoading: boolean;
    queryResult?: JsonApi.Response;
};

const withQuery = ({
    cacheScheme = 'cacheFirst',
    expandResourceObjects = false,
    queryFactory,
    propsToWatch = [],
    stateBranch = 'resourceObjects',
}: WithQueryOptions) => <OriginalProps extends InjectedProps>(
    BaseComponent: React.ComponentType<OriginalProps & InjectedProps>
) => {
    type ExternalProps = Omit<OriginalProps, keyof InjectedProps>;
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

            const { fetchData, cacheQueryResult } = this.props as InternalProps;

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
        cacheQueryResult: (result: JsonApi.Response) => {
            dispatch(cacheQuery(hashQuery(queryFactory, ownProps), result));
        },
    });

    return connect<
        MapStateProps,
        MapDispatchProps,
        ExternalProps,
        StateWithJasonApi
    >(mapStateToProps, mapDispatchToProps)(WithQuery);
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
