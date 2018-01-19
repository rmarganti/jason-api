"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const selectors_1 = require("../selectors");
const utils_1 = require("../utils");
const expandResourceObjects = (shouldExpand = false, resourceObjects = []) => shouldExpand ? resourceObjects : utils_1.simplifyResourceObjects(resourceObjects);
const withCollection = ({ resourceType, resourceIds, shouldExpand = false, }) => react_redux_1.connect((state, { ids }) => ({
    data: expandResourceObjects(shouldExpand, selectors_1.getResourceObjects(state.resourceObjects, resourceType, ids || resourceIds)),
}));
exports.default = withCollection;
//# sourceMappingURL=withCollection.js.map