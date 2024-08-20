"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMin = extractMin;
/**
 * Remove the node with the minimum weight from the priority queue.
 *
 * Performs linear search.
 */
function extractMin(tracks) {
    var min = Infinity;
    var minNode;
    var d = tracks.d, q = tracks.q;
    q.forEach(function (node) {
        var _a;
        var nodeWeight = (_a = d.get(node)) !== null && _a !== void 0 ? _a : Infinity;
        if (nodeWeight < min) {
            min = nodeWeight;
            minNode = node;
        }
    });
    if (minNode === undefined) {
        // If we reach here, there's a disconnected subgraph, and we're done.
        q.clear();
        return null;
    }
    q.delete(minNode);
    return minNode;
}
