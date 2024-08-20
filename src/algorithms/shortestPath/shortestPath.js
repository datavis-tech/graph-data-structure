"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortestPath = shortestPath;
var dijkstra_js_1 = require("./dijkstra.js");
var getPath_js_1 = require("./getPath.js");
/**
 * Dijkstra's Shortest Path Algorithm.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
 * Variable and function names correspond to names in the book.
 */
function shortestPath(graph, source, destination) {
    var tracks = {
        d: new Map(),
        p: new Map(),
        q: new Set(),
    };
    (0, dijkstra_js_1.dijkstra)(graph, tracks, source, destination);
    return (0, getPath_js_1.getPath)(graph, tracks, source, destination);
}
