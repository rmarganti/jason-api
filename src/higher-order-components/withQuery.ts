import { equals, omit } from 'ramda';
import { connect } from 'react-redux';
import {
    compose,
    lifecycle,
    withHandlers,
    withState,
    mapProps,
} from 'recompose';
import { ActionCreator, Action } from 'redux';

import { iJsonApiActionConfig } from '../interfaces/Middleware';
import { getCachedQuery } from '../selectors';
import { iState } from '../interfaces/state';

interface iWithQueryOptions {
    actionCreator: (props: object) => iJsonApiActionConfig;
    propsToWatch: string[];
    stateBranch?: string;
}

interface iFlexibleState {
    [index: string]: any;
}

const withQuery = ({
    actionCreator,
    propsToWatch = [],
    stateBranch = 'resourceObjects',
}: iWithQueryOptions) =>
    compose(
        connect(
            (state: iFlexibleState, ownProps) => {
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
            refetch: ({
                fetchData,
                setLoadingState,
            }: {
                fetchData: () => Promise<any>;
                setLoadingState: (status: boolean) => any;
            }) => () => {
                setLoadingState(true);
                fetchData().then(() => setLoadingState(false));
            },
        }),

        lifecycle({
            componentDidMount() {
                (<any>this.props).refetch();
            },

            componentWillReceiveProps(nextProps) {
                const hasChanged = propsToWatch.find(
                    propToWatch =>
                        !equals(
                            (<any>this.props)[propToWatch],
                            (<any>nextProps)[propToWatch]
                        )
                );

                if (!hasChanged) {
                    return;
                }

                (<any>nextProps).refetch();
            },
        }),

        mapProps(omit(['fetchData', 'setLoadingState']))
    );
