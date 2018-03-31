"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAction(type, payload) {
    return payload === undefined ? { type } : { type, payload };
}
exports.createAction = createAction;
exports.default = createAction;
//# sourceMappingURL=createAction.js.map