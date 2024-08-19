"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstNode = getFirstNode;
/**
 * Return the first node matching your function and throws if none is found.
 */
function getFirstNode(graph, fn) {
    for (var _i = 0, _a = graph.nodes; _i < _a.length; _i++) {
        var node = _a[_i];
        if (fn(node)) {
            return node;
        }
    }
    throw new Error('Node not found.');
}
