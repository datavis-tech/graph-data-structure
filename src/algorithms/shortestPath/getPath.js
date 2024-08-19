"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = getPath;
/**
 * Assembles the shortest path by traversing the
 * predecessor subgraph from destination to source.
 */
function getPath(graph, tracks, source, destination) {
    var p = tracks.p;
    var nodeList = [];
    var totalWeight = 0;
    var node = destination;
    while (p.has(node)) {
        var currentNode = p.get(node);
        nodeList.push(node);
        totalWeight += graph.getEdgeWeight(currentNode, node);
        node = currentNode;
    }
    if (node !== source) {
        throw new Error('No path found');
    }
    nodeList.push(node);
    nodeList.reverse();
    return {
        nodes: nodeList,
        weight: totalWeight,
    };
}
