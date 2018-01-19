"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const selectors_1 = require("../selectors");
const withItem = ({ resourceType, resourceId }) => react_redux_1.connect((state, { data, id }) => ({
    data: selectors_1.getResourceObject(state.resourceObjects, data ? data.type : resourceType, data ? data.id : id || resourceId),
}));
exports.default = withItem;
//# sourceMappingURL=withItem.js.map