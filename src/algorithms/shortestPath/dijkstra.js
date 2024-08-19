"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dijkstra = dijkstra;
var extractMin_js_1 = require("./extractMin.js");
var relax_js_1 = require("./relax.js");
function dijkstra(graph, tracks, source, destination) {
    var _a;
    var nodes = graph.nodes;
    var q = tracks.q;
    initializeSingleSource(nodes, tracks, source, destination);
    initializePriorityQueue(nodes, tracks);
    var _loop_1 = function () {
        var u = (0, extractMin_js_1.extractMin)(tracks);
        if (u === null)
            return { value: void 0 };
        (_a = graph.adjacent(u)) === null || _a === void 0 ? void 0 : _a.forEach(function (v) {
            (0, relax_js_1.relax)(graph, tracks, u, v);
        });
    };
    while (q.size !== 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
function initializeSingleSource(nodes, _a, source, destination) {
    var d = _a.d;
    nodes.forEach(function (node) {
        d.set(node, Infinity);
    });
    if (d.get(source) !== Infinity) {
        throw new Error('Source node is not in the graph');
    }
    if (d.get(destination) !== Infinity) {
        throw new Error('Destination node is not in the graph');
    }
    d.set(source, 0);
}
function initializePriorityQueue(nodes, _a) {
    var q = _a.q;
    nodes.forEach(function (node) {
        q.add(node);
    });
}
