"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outdegree = outdegree;
function outdegree(graph, node) {
    var _a, _b;
    return (_b = (_a = graph.edges.get(node)) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
}
