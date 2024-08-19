"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneGraph = cloneGraph;
var Graph_js_1 = require("../Graph.js");
/**
 * Clone the graph data structures.
 * Nodes references are preserves.
 */
function cloneGraph(graph) {
    var clone = new Graph_js_1.Graph();
    var _loop_1 = function (source, targets) {
        targets.forEach(function (target) {
            var _a;
            clone.addEdge.apply(clone, [source, target]);
            var edgeWeight = (_a = graph.edgeWeights.get(source)) === null || _a === void 0 ? void 0 : _a.get(target);
            if (edgeWeight) {
                clone.setEdgeWeight(source, target, edgeWeight);
            }
            var edgeProperties = graph.getEdgeProperties(source, target);
            if (edgeProperties) {
                clone.setEdgeProperties(source, target, edgeProperties);
            }
        });
    };
    for (var _i = 0, _a = graph.edges.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], source = _b[0], targets = _b[1];
        _loop_1(source, targets);
    }
    return clone;
}
