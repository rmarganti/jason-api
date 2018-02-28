import { equals, omit, pick } from 'ramda';
import { connect } from 'react-redux';
import {
    compose,
    ComponentEnhancer,
    lifecycle,
    withHandlers,
    withState,
    mapProps,
} from 'recompose';
import { ActionCreator, Action } from 'redux';
import { iJsonApiResponse } from 'ts-json-api';

import { iJsonApiActionConfig } from '../interfaces/Middleware';
import { iStateWithJasonApi } from '../interfaces/state';
import { getCachedQuery } from '../redux/selectors';

export interface iWithQueryOptions {
    actionCreator: (props: object) => iJsonApiActionConfig;
    propsToWatch: string[];
    stateBranch?: string;
}

interface iRefetchParams {
    fetchData: () => Promise<any>;
    setLoadingState: (status: boolean) => any;
}

const withQuery = ({
    actionCreator,
    propsToWatch = [],
    stateBranch = 'resourceObjects',
}: iWithQueryOptions) =>
    compose(
        connect(
            (state: iStateWithJasonApi, ownProps) => {
                const url = actionCreator(ownProps).url;
                const cachedQuery = getCachedQuery(state[stateBranch], url);
                return { ...cachedQuery };
            },
            (dispatch, ownProps) => ({
                fetchData: () => dispatch(actionCreator(ownProps)),
            })
        ),

        withState('isLoading', 'setLoadingState', false),

        withHandlers({
            refetch: ({ fetchData, setLoadingState }: iRefetchParams) => (
                newProps = {}
            ) => {
                setLoadingState(true);

                fetchData()
                    .then(() => setLoadingState(false))
                    .catch(() => setLoadingState(false));
            },
        }),

        lifecycle({
            componentDidMount() {
                (<any>this.props).refetch();
            },

            componentWillReceiveProps(nextProps) {
                const hasChanged = !equals(
                    pick(propsToWatch, this.props),
                    pick(propsToWatch, nextProps)
                );

                if (!hasChanged) {
                    return;
                }

                (<any>nextProps).refetch();
            },
        }),

        mapProps(omit(['fetchData', 'setLoadingState']))
    );

export default withQuery;
