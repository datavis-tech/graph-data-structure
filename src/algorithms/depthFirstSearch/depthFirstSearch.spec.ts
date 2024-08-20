import { describe, expect, it } from 'vitest';
import { Graph } from '../../Graph.js';
import { depthFirstSearch } from './index.js';

describe('depthFirstSearch', () => {
  it('Should return the nodes connected to the source node with the correct type of edge.', function () {
    const graph = new Graph<string, { type: 'foo' | 'bar' }>();

    graph.addEdge('a', 'b', { props: { type: 'foo' } });
    graph.addEdge('b', 'c', { props: { type: 'bar' } });
    graph.addEdge('b', 'd', { props: { type: 'bar' } });
    graph.addEdge('b', 'e', { props: { type: 'foo' } });

    const nodes = depthFirstSearch(graph, {
      shouldFollow: ({ source, target, graph }) =>
        graph.getEdgeProperties(source, target).type === 'foo',
    });

    expect(nodes).toContain('a');
    expect(nodes).toContain('b');
    expect(nodes).toContain('e');
  });
});
