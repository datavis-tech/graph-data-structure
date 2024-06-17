import { describe, expect, it } from 'vitest';
import { Graph } from '../Graph.js';
import { hasCycle } from './hasCycle.js';

describe('hasCycle', () => {
  it('Should detect cycle.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('Should detect cycle (long).', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');
    graph.addEdge('c', 'd');
    graph.addEdge('d', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('Should detect cycle (loop).', function () {
    const graph = new Graph();
    graph.addEdge('a', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('Should not detect cycle.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    expect(hasCycle(graph)).toBe(false);
  });
});
