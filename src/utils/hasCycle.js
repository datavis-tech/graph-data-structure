"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCycle = hasCycle;
var index_js_1 = require("../algorithms/depthFirstSearch/index.js");
var CycleError_js_1 = require("../CycleError.js");
/**
 * Perform a depth first search to detect an eventual cycle.
 *
 * You can provide a `shouldFollow` function to constrain the traversing and
 * provide `sourceNodes` to explore a particular sub-graphs.
 */
function hasCycle(graph, opts) {
    try {
        (0, index_js_1.depthFirstSearch)(graph, __assign(__assign({}, opts), { includeSourceNodes: true, errorOnCycle: true }));
        // No error thrown -> no cycles
        return false;
    }
    catch (error) {
        if (error instanceof CycleError_js_1.CycleError) {
            return true;
        }
        else {
            throw error;
        }
    }
}
