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
exports.topologicalSort = topologicalSort;
var index_js_1 = require("../depthFirstSearch/index.js");
function topologicalSort(graph, opts) {
    if (opts === void 0) { opts = {}; }
    return (0, index_js_1.depthFirstSearch)(graph, __assign(__assign({}, opts), { errorOnCycle: true })).reverse();
}
