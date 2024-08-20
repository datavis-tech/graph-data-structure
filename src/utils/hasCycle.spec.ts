import { describe, expect, it } from 'vitest';
import { Graph } from '../Graph.js';
import { hasCycle } from './hasCycle.js';

describe('hasCycle', () => {
  it('should detect cycle.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('should detect cycle (long).', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');
    graph.addEdge('c', 'd');
    graph.addEdge('d', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('should detect cycle (loop).', function () {
    const graph = new Graph();
    graph.addEdge('a', 'a');
    expect(hasCycle(graph)).toBe(true);
  });

  it('should not detect cycle.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    expect(hasCycle(graph)).toBe(false);
  });

  it('should ignore the cycle in another sub-graph.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');
    graph.addEdge('c', 'd');
    graph.addEdge('d', 'a');

    graph.addEdge('m', 'n');

    expect(hasCycle(graph, { sourceNodes: ['m'] })).toBe(false);
  });

  it('should not detect the cycle when the traversing is stopped by the shouldFollow option.', function () {
    const graph = new Graph<string, string>();
    graph.addEdge('a', 'b', { props: 'foo' });
    graph.addEdge('b', 'c', { props: 'foo' });
    graph.addEdge('c', 'd', { props: 'foo' });
    graph.addEdge('d', 'a', { props: 'bar' });

    expect(
      hasCycle(graph, {
        shouldFollow: ({ source, target }) =>
          graph.getEdgeProperties(source, target) === 'foo',
      }),
    ).toBe(false);
  });
});
