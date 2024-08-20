"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indegree = indegree;
/**
 * Computes the indegree for the given node.
 * Not very efficient, costs O(E) where E = number of edges.
 */
function indegree(graph, node) {
    var degree = 0;
    for (var _i = 0, _a = graph.edges.values(); _i < _a.length; _i++) {
        var adjacentNodes = _a[_i];
        for (var _b = 0, adjacentNodes_1 = adjacentNodes; _b < adjacentNodes_1.length; _b++) {
            var adjacentNode = adjacentNodes_1[_b];
            if (adjacentNode === node) {
                degree++;
            }
        }
    }
    return degree;
}
