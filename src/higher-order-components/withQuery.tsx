import { equals, omit, pickAll } from 'ramda';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as JsonApi from 'ts-json-api';
import { iAttributes, iResourceObject, iResponse } from 'ts-json-api';

import { iStateWithJasonApi } from '../common-types/state';
import { cacheQuery } from '../redux/actions';
import { getCachedQuery } from '../redux/selectors';
import { hashObject, simplifyJsonApi } from '../utils/data';

export type TQueryFactory = (
    dispatch: Dispatch<iStateWithJasonApi>,
    props: object
) => Promise<JsonApi.iResponse>;

export interface iWithQueryOptions {
    cacheScheme: 'cacheFirst' | 'cacheOnly' | 'noCache';
    expandResourceObjects: boolean;
    propsToWatch: string[];
    queryFactory: TQueryFactory;
    stateBranch?: string;
}

type TConnectedProps = {
    cachedQuery: JsonApi.iResponse;
    cacheQueryResult: (response: JsonApi.iResponse) => void;
    fetchData: () => Promise<JsonApi.iResponse>;
};

type TInjectedProps = {
    isLoading: boolean;
    refetch: () => void;
} & Partial<JsonApi.iResponse>;

const initialState = { isLoading: false, queryResult: undefined };

type TState = {
    isLoading: boolean;
    queryResult?: JsonApi.iResponse;
};

const withQuery = ({
    cacheScheme = 'cacheFirst',
    expandResourceObjects = false,
    queryFactory,
    propsToWatch = [],
    stateBranch = 'resourceObjects',
}: iWithQueryOptions) => <TPassedProps extends TInjectedProps>(
    BaseComponent: React.ComponentType<TPassedProps>
) => {
    type TInternalProps = TPassedProps & TConnectedProps;

    class WithQuery extends React.Component<TInternalProps, TState> {
        static displayName = `WithQuery(${BaseComponent.displayName ||
            BaseComponent.name})`;

        readonly state: TState = initialState;

        constructor(props: TInternalProps) {
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

            this.props
                .fetchData()
                .then(response => {
                    this.setState({
                        isLoading: false,
                        queryResult: expandResourceObjects
                            ? response
                            : simplifyJsonApi(response),
                    });

                    cacheQueryResult(response);
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
        componentDidUpdate(prevProps: Readonly<TInternalProps>) {
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

    const mapStateToProps = (state: iStateWithJasonApi, ownProps: object) => ({
        cachedQuery:
            cacheScheme !== 'noCache' &&
            getCachedQuery(
                state[stateBranch],
                hashQuery(queryFactory, ownProps),
                expandResourceObjects
            ),
    });

    const mapDispatchToProps = (
        dispatch: Dispatch<iStateWithJasonApi>,
        ownProps: object
    ) => ({
        fetchData: () => queryFactory(dispatch, ownProps),
        cacheQueryResult: (result: JsonApi.iResponse) => {
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
const hashQuery = (queryFactory: TQueryFactory, props: object): string =>
    hashObject({
        queryFactory,
        props,
    });

export default withQuery;
