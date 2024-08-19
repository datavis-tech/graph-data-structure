"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depthFirstSearch = depthFirstSearch;
var depthFirstVisit_js_1 = require("./depthFirstVisit.js");
/**
 * Depth First Search algorithm, inspired by
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
 */
function depthFirstSearch(graph, opts) {
    var _a;
    if (opts === void 0) { opts = {}; }
    var _b = opts.sourceNodes, sourceNodes = _b === void 0 ? Array.from(graph.nodes) : _b, _c = opts.includeSourceNodes, includeSourceNodes = _c === void 0 ? true : _c;
    var visited = new Set();
    var visiting = new Set();
    var nodeList = [];
    if (includeSourceNodes) {
        for (var i = 0; i < sourceNodes.length; i++) {
            var sourceNode = sourceNodes[i];
            if (!sourceNode)
                continue;
            (0, depthFirstVisit_js_1.depthFirstVisit)(graph, nodeList, visited, visiting, sourceNode, opts);
        }
        return nodeList;
    }
    for (var i = 0; i < sourceNodes.length; i++) {
        var sourceNode = sourceNodes[i];
        if (!sourceNode)
            continue;
        visited.add(sourceNode);
    }
    for (var i = 0; i < sourceNodes.length; i++) {
        var sourceNode = sourceNodes[i];
        if (!sourceNode)
            continue;
        (_a = graph
            .adjacent(sourceNode)) === null || _a === void 0 ? void 0 : _a.forEach(function (n) { return (0, depthFirstVisit_js_1.depthFirstVisit)(graph, nodeList, visited, visiting, n, opts); });
    }
    return nodeList;
}
