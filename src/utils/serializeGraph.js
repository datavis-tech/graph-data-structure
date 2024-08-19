"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeGraph = serializeGraph;
/**
 * Serialize the graph data set : nodes, edges, edges weight & properties.
 * @param graph
 * @param opts
 */
function serializeGraph(graph, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.includeDefaultWeight, includeDefaultWeight = _a === void 0 ? false : _a;
    var serialized = {
        nodes: Array.from(graph.nodes),
        links: [],
    };
    serialized.nodes.forEach(function (node) {
        var _a;
        var source = node;
        (_a = graph.adjacent(source)) === null || _a === void 0 ? void 0 : _a.forEach(function (target) {
            var edgeWeight = graph.getEdgeWeight(source, target);
            var edgeProps = graph.getEdgeProperties(source, target);
            var link = {
                source: source,
                target: target,
            };
            if (edgeWeight != 1 || includeDefaultWeight) {
                link.weight = edgeWeight;
            }
            if (edgeProps) {
                link.props = edgeProps;
            }
            serialized.links.push(link);
        });
    });
    return serialized;
}
