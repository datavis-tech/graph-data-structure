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
      shouldFollow: ({ props }) => props.type === 'foo',
    });

    expect(nodes).toContain('a');
    expect(nodes).toContain('b');
    expect(nodes).toContain('e');
  });

  it('should pass all the expected args to the shouldFollow function', function () {
    expect.hasAssertions();

    const graph = new Graph<string, { type: string }>();

    graph.addEdge('a', 'b', { props: { type: 'foo' } });

    depthFirstSearch(graph, {
      shouldFollow: ({ source, target, props }) => {
        expect(source).toEqual(expect.any(String));
        expect(target).toEqual(expect.any(String));
        expect(props).toEqual({ type: 'foo' });
        return true;
      },
    });
  });
});
