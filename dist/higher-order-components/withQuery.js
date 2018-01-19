"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const selectors_1 = require("../selectors");
const withQuery = ({ actionCreator, propsToWatch = [], stateBranch = 'resourceObjects', }) => recompose_1.compose(react_redux_1.connect((state, ownProps) => {
    const url = actionCreator(ownProps).url;
    const cachedQuery = selectors_1.getCachedQuery(state[stateBranch], url);
    return Object.assign({}, cachedQuery);
}, (dispatch, ownProps) => ({
    fetchData: () => dispatch(actionCreator(ownProps)),
})), recompose_1.withState('isLoading', 'setLoadingState', false), recompose_1.withHandlers({
    refetch: ({ fetchData, setLoadingState, }) => () => {
        setLoadingState(true);
        fetchData().then(() => setLoadingState(false));
    },
}), recompose_1.lifecycle({
    componentDidMount() {
        this.props.refetch();
    },
    componentWillReceiveProps(nextProps) {
        const hasChanged = propsToWatch.find(propToWatch => !ramda_1.equals(this.props[propToWatch], nextProps[propToWatch]));
        if (!hasChanged) {
            return;
        }
        nextProps.refetch();
    },
}), recompose_1.mapProps(ramda_1.omit(['fetchData', 'setLoadingState'])));
//# sourceMappingURL=withQuery.js.map