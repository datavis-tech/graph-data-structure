import { describe, it, expect } from 'vitest';
import { Graph } from '../../Graph.js';
import { comesBefore } from '../../test-utils.js';
import { topologicalSort } from './index.js';

describe('topologicalSort', () => {
  // This example is from Cormen et al. "Introduction to Algorithms" page 550
  it('Should compute topological sort.', function () {
    const graph = new Graph();

    // Shoes depend on socks.
    // Socks need to be put on before shoes.
    graph.addEdge('socks', 'shoes');

    graph.addEdge('shirt', 'belt');
    graph.addEdge('shirt', 'tie');
    graph.addEdge('tie', 'jacket');
    graph.addEdge('belt', 'jacket');
    graph.addEdge('pants', 'shoes');
    graph.addEdge('underpants', 'pants');
    graph.addEdge('pants', 'belt');

    const sorted = topologicalSort(graph);

    expect(comesBefore(sorted, 'pants', 'shoes')).toBe(true);
    expect(comesBefore(sorted, 'underpants', 'pants')).toBe(true);
    expect(comesBefore(sorted, 'underpants', 'shoes')).toBe(true);
    expect(comesBefore(sorted, 'shirt', 'jacket')).toBe(true);
    expect(comesBefore(sorted, 'shirt', 'belt')).toBe(true);
    expect(comesBefore(sorted, 'belt', 'jacket')).toBe(true);

    expect(sorted.length).toEqual(8);
  });

  it('Should compute topological sort, excluding source nodes.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'c');
    const sorted = topologicalSort(graph, {
      sourceNodes: ['a'],
      includeSourceNodes: false,
    });
    expect(sorted.length).toEqual(2);
    expect(sorted[0]).toEqual('b');
    expect(sorted[1]).toEqual('c');
  });

  it('Should compute topological sort tricky case.', function () {
    //     a
    //    / \
    //   b   |
    //   |   d
    //   c   |
    //    \ /
    //     e

    const graph = new Graph();

    graph.addEdge('a', 'b');
    graph.addEdge('a', 'd');
    graph.addEdge('b', 'c');
    graph.addEdge('d', 'e');
    graph.addEdge('c', 'e');

    const sorted = topologicalSort(graph, {
      sourceNodes: ['a'],
      includeSourceNodes: false,
    });
    expect(sorted.length).toEqual(4);
    expect(sorted).toContain('b');
    expect(sorted).toContain('c');
    expect(sorted).toContain('d');

    expect(sorted[sorted.length - 1]).toEqual('e');

    expect(comesBefore(sorted, 'b', 'c')).toBe(true);
    expect(comesBefore(sorted, 'b', 'e')).toBe(true);
    expect(comesBefore(sorted, 'c', 'e')).toBe(true);
    expect(comesBefore(sorted, 'd', 'e')).toBe(true);
  });

  it('Should exclude source nodes with a cycle.', function () {
    const graph = new Graph<string, { type: string }>();
    graph
      .addEdge('a', 'b', { props: { type: 'foo' } })
      .addEdge('b', 'c', { props: { type: 'foo' } })
      .addEdge('c', 'a', { props: { type: 'bar' } });

    const sorted = topologicalSort(graph, {
      sourceNodes: ['a'],
      includeSourceNodes: true,
      shouldFollow: ({ source, target }) =>
        graph.getEdgeProperties(source, target).type === 'foo',
    });

    expect(sorted.length).toEqual(3);
    expect(sorted[0]).toEqual('a');
    expect(sorted[1]).toEqual('b');
    expect(sorted[2]).toEqual('c');
  });

  it('Should exclude source nodes with multiple cycles.', function () {
    const graph = new Graph()
      .addEdge('a', 'b')
      .addEdge('b', 'a')

      .addEdge('b', 'c')
      .addEdge('c', 'b')

      .addEdge('a', 'c')
      .addEdge('c', 'a');

    const sorted = topologicalSort(graph, {
      sourceNodes: ['a', 'b'],
      includeSourceNodes: false,
    });
    expect(sorted).not.toContain('b');
  });

  it('Should error on non-DAG topological sort', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    graph.addEdge('b', 'a');
    expect(() => topologicalSort(graph)).toThrowError();
  });
});
