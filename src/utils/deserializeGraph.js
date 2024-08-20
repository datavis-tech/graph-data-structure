"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeGraph = deserializeGraph;
var Graph_js_1 = require("../Graph.js");
function deserializeGraph() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var data = args[0], identityFn = args[1];
    var g = new Graph_js_1.Graph();
    var nodeIdentityMap = new Map();
    data.nodes.forEach(function (node) {
        g.addNode(node);
        if (identityFn) {
            nodeIdentityMap.set(identityFn(node), node);
        }
    });
    data.links.forEach(function (link) {
        var _a, _b;
        if (!identityFn) {
            g.addEdge.apply(g, [link.source, link.target, link.weight, link.props]);
            return;
        }
        var source = (_a = nodeIdentityMap.get(identityFn(link.source))) !== null && _a !== void 0 ? _a : link.source;
        var target = (_b = nodeIdentityMap.get(identityFn(link.target))) !== null && _b !== void 0 ? _b : link.target;
        g.addEdge.apply(g, [source, target, link.weight, link.props]);
    });
    return g;
}
