"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = invariant;
function invariant(value, message) {
    if (value === false || value === null || typeof value === 'undefined') {
        console.warn('Test invariant failed:', message);
        throw new Error(message);
    }
}
