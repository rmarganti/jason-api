import { equals, omit } from 'ramda';
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

import { iJsonApiActionConfig } from '../interfaces/Middleware';
import { getCachedQuery } from '../selectors';
import { iStateWithJasonApi } from '../interfaces/state';

export interface iWithQueryOptions {
    actionCreator: (props: object) => iJsonApiActionConfig;
    propsToWatch: string[];
    stateBranch?: string;
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
            refetch: ({
                fetchData,
                setLoadingState,
            }: {
                fetchData: () => Promise<any>;
                setLoadingState: (status: boolean) => any;
            }) => () => {
                setLoadingState(true);
                fetchData()
                    .then(() => setLoadingState(false))
                    .catch(response => {
                        setLoadingState(false);
                        console.log(response);
                    });
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
export default withQuery;
