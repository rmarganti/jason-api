import { equals, omit, pickAll } from 'ramda';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import {
    iJsonApiResponse,
    iJsonApiResponseWithData,
    iJsonApiResponseWithError,
    iJsonApiResponseWithMetaData,
} from 'ts-json-api';

import { iStateWithJasonApi } from '../interfaces/state';
import { cacheQuery } from '../redux/actions';
import { getCachedQuery } from '../redux/selectors';
import { hashObject, simplifyJsonApi } from '../utils/data';

export type TQueryFactory = (
    dispatch: Dispatch<iStateWithJasonApi>,
    props: object
) => Promise<iJsonApiResponse>;

export interface iWithQueryOptions {
    cacheScheme: "cacheFirst" | "cacheOnly" | "noCache";
    propsToWatch: string[];
    queryFactory: TQueryFactory;
    stateBranch?: string;
}

type TConnectedProps = {
    cachedQuery: iJsonApiResponse;
    cacheQueryResult: (response: iJsonApiResponse) => void;
    fetchData: () => Promise<iJsonApiResponse>;
};

type TInjectedProps = {
    isLoading: boolean;
    refetch: () => void;
} & Partial<iJsonApiResponse>;

const initialState = { isLoading: false, queryResult: {} };

type TState = {
    isLoading: boolean;
    queryResult: Partial<iJsonApiResponse>;
};

const withQuery = ({
    cacheScheme = 'cacheFirst',
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

        constructor(props: TInternalProps) {
            super(props);

            this.state = {
                isLoading: false,
                queryResult: props.cachedQuery,
            };
        }

        refetch = () => {
            this.setState({ isLoading: true });

            const { fetchData, cacheQueryResult } = this.props;

            this.props
                .fetchData()
                .then(response => {
                    this.setState({
                        isLoading: false,
                        queryResult: simplifyJsonApi(response),
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

                    return errors;
                });
        };

        componentDidMount() {
            if (cacheScheme === 'noCache') {
                return;
            }

            this.refetch();
        }

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
        cachedQuery: cacheScheme !== 'noCache' && getCachedQuery(
            state[stateBranch],
            hashQuery(queryFactory, ownProps)
        ),
    });

    const mapDispatchToProps = (
        dispatch: Dispatch<iStateWithJasonApi>,
        ownProps: object
    ) => ({
        fetchData: () => queryFactory(dispatch, ownProps),
        cacheQueryResult: (result: iJsonApiResponse) => {
            dispatch(cacheQuery(hashQuery(queryFactory, ownProps), result));
        },
    });

    return connect(mapStateToProps, mapDispatchToProps)(WithQuery);
};

const hashQuery = (queryFactory: any, props: object) =>
    hashObject({
        queryFactory,
        props,
    });

export default withQuery;
