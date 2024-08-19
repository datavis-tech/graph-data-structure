import { describe, expect, it } from 'vitest';
import { Graph } from '../../Graph.js';
import { depthFirstSearch } from './index.js';

describe('depthFirstSearch', () => {
  it('Should return the nodes connected to the source node with the correct type of edge.', function () {
    const graph = new Graph<string, { type: 'foo' | 'bar' }>();

    graph.addEdge('a', 'b', undefined, { type: 'foo' });
    graph.addEdge('b', 'c', undefined, { type: 'bar' });
    graph.addEdge('b', 'd', undefined, { type: 'bar' });
    graph.addEdge('b', 'e', undefined, { type: 'foo' });

    const nodes = depthFirstSearch(graph, {
      shouldFollow: ({ source, target, graph }) =>
        graph.getEdgeProperties(source, target).type === 'foo',
    });

    expect(nodes).toContain('a');
    expect(nodes).toContain('b');
    expect(nodes).toContain('e');
  });
});
