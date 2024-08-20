"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowestCommonAncestors = lowestCommonAncestors;
/**
 * Return an array containing the lowest common ancestors.
 *
 * Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
 * but uses depth search instead of breadth. Also uses some optimizations.
 */
function lowestCommonAncestors(graph, node1, node2) {
    var node1Ancestors = [];
    var lcas = [];
    if (CA1Visit(graph, node1Ancestors, lcas, new Set(), node1, node2)) {
        // No shortcut worked
        CA2Visit(graph, node1Ancestors, lcas, new Set(), node2);
    }
    return lcas;
}
function CA1Visit(graph, node1Ancestors, lcas, visited, node, node2) {
    var _a;
    if (!visited.has(node)) {
        visited.add(node);
        node1Ancestors.push(node);
        if (node == node2) {
            lcas.push(node);
            return false; // found - shortcut
        }
        return Array.from((_a = graph.adjacent(node)) !== null && _a !== void 0 ? _a : []).every(function (node) {
            return CA1Visit(graph, node1Ancestors, lcas, visited, node, node2);
        });
    }
    else {
        return true;
    }
}
function CA2Visit(graph, node1Ancestors, lcas, visited, node) {
    var _a;
    if (!visited.has(node)) {
        visited.add(node);
        if (node1Ancestors.indexOf(node) >= 0) {
            lcas.push(node);
        }
        else if (lcas.length == 0) {
            (_a = graph.adjacent(node)) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
                CA2Visit(graph, node1Ancestors, lcas, visited, node);
            });
        }
    }
}
