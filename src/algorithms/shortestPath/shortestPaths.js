"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortestPaths = shortestPaths;
var shortestPath_js_1 = require("./shortestPath.js");
function shortestPaths(graph, source, destination) {
    var path = (0, shortestPath_js_1.shortestPath)(graph, source, destination);
    var paths = [path];
    var pathWeight = path.weight;
    var removedEdges = [];
    while (path.weight) {
        var u = path.nodes[0];
        var v = path.nodes[1];
        if (graph.hasEdge(u, v)) {
            removedEdges.push({
                u: u,
                v: v,
                weight: graph.getEdgeWeight(u, v),
                props: graph.getEdgeProperties(u, v),
            });
            graph.removeEdge(u, v);
        }
        if (graph.hasEdge(v, u)) {
            removedEdges.push({
                u: v,
                v: u,
                weight: graph.getEdgeWeight(v, u),
                props: graph.getEdgeProperties(u, v),
            });
            graph.removeEdge(v, u);
        }
        try {
            path = (0, shortestPath_js_1.shortestPath)(graph, source, destination);
            if (!path.weight || pathWeight < path.weight)
                break;
            paths.push(path);
        }
        catch (e) {
            break;
        }
    }
    for (var _i = 0, removedEdges_1 = removedEdges; _i < removedEdges_1.length; _i++) {
        var _a = removedEdges_1[_i], u = _a.u, v = _a.v, weight = _a.weight, props = _a.props;
        graph.addEdge.apply(graph, __spreadArray([u, v], [weight, props], false));
    }
    return paths;
}
