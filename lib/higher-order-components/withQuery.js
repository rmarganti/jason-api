"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const React = require("react");
const react_redux_1 = require("react-redux");
const actions_1 = require("../redux/actions");
const selectors_1 = require("../redux/selectors");
const data_1 = require("../utils/data");
const initialState = { isLoading: false, queryResult: undefined };
const withQuery = ({ cacheScheme = 'cacheFirst', queryFactory, propsToWatch = [], stateBranch = 'resourceObjects', }) => (BaseComponent) => {
    class WithQuery extends React.Component {
        constructor(props) {
            super(props);
            this.state = initialState;
            /**
             * Execute `queryFactory`, keep track of loading state,
             * and cache queries appropriately.
             */
            this.refetch = () => {
                this.setState({ isLoading: true });
                const { fetchData, cacheQueryResult } = this.props;
                this.props
                    .fetchData()
                    .then(response => {
                    this.setState({
                        isLoading: false,
                        queryResult: data_1.simplifyJsonApi(response),
                    });
                    cacheQueryResult(response);
                })
                    .catch(errors => {
                    this.setState(({ queryResult }) => ({
                        isLoading: false,
                        queryResult: Object.assign({}, queryResult, errors),
                    }));
                });
            };
            this.state = {
                isLoading: false,
                queryResult: props.cachedQuery,
            };
        }
        /**
         * Execute initial query. A cache scheme of `noCache` will
         * never trigger this. A cache scheme of `cacheOnly` will
         * only trigger it if there is not already a cached query.
         */
        componentDidMount() {
            if (cacheScheme === 'noCache' ||
                (cacheScheme === 'cacheOnly' && this.state.queryResult)) {
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
        componentDidUpdate(prevProps) {
            const hasChanged = !ramda_1.equals(ramda_1.pickAll(propsToWatch, prevProps), ramda_1.pickAll(propsToWatch, this.props));
            if (!hasChanged) {
                return;
            }
            this.refetch();
        }
        /**
         * @inheritDoc
         */
        render() {
            const passedProps = ramda_1.omit(['cachedQuery', 'fetchData'], this.props);
            const { isLoading, queryResult } = this.state;
            return (React.createElement(BaseComponent, Object.assign({ isLoading: isLoading, refetch: this.refetch }, passedProps, queryResult)));
        }
    }
    WithQuery.displayName = `WithQuery(${BaseComponent.displayName ||
        BaseComponent.name})`;
    const mapStateToProps = (state, ownProps) => ({
        cachedQuery: cacheScheme !== 'noCache' &&
            selectors_1.getCachedQuery(state[stateBranch], hashQuery(queryFactory, ownProps)),
    });
    const mapDispatchToProps = (dispatch, ownProps) => ({
        fetchData: () => queryFactory(dispatch, ownProps),
        cacheQueryResult: (result) => {
            dispatch(actions_1.cacheQuery(hashQuery(queryFactory, ownProps), result));
        },
    });
    return react_redux_1.connect(mapStateToProps, mapDispatchToProps)(WithQuery);
};
/**
 * Generate a unique id for a `queryFactory`
 * called with a specific set of props.
 *
 * @param queryFactory
 * @param props
 */
const hashQuery = (queryFactory, props) => data_1.hashObject({
    queryFactory,
    props,
});
exports.default = withQuery;
//# sourceMappingURL=withQuery.js.map