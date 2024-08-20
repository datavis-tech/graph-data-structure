"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNodes = findNodes;
/**
 * Returns all the nodes matching your function.
 */
function findNodes(graph, fn) {
    var nodes = [];
    graph.nodes.forEach(function (node) {
        if (fn(node)) {
            nodes.push(node);
        }
    });
    return nodes;
}
