"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const selectors_1 = require("../redux/selectors");
const withItem = ({ resourceType, resourceId } = {}) => react_redux_1.connect((state, { data, id }) => {
    const resolvedType = data ? data.type : resourceType;
    const resolvedId = data ? data.id : id || resourceId;
    if (!resolvedType || !resolvedId) {
        return { data: {} };
    }
    return {
        data: selectors_1.getResourceObject(state.resourceObjects, resolvedType, resolvedId),
    };
});
exports.default = withItem;
//# sourceMappingURL=withItem.js.map