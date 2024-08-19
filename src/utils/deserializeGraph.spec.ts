import { describe, expectTypeOf, it, expect } from 'vitest';
import { Graph } from '../Graph.js';
import { checkSerialized } from '../test-utils.js';
import { Serialized } from '../types.js';
import { deserializeGraph } from './deserializeGraph.js';
import { serializeGraph } from './serializeGraph.js';

describe('serializeGraph', () => {
  it('should deserialize a graph', () => {
    const g = new Graph<string>().addEdge('a', 'b').addEdge('b', 'c');
    const serialized = serializeGraph(g);

    const graph = deserializeGraph(serialized);
    checkSerialized(serializeGraph(graph));
  });

  it('should not duplicate nodes when they are objects', () => {
    const nodeA = { id: 1, title: 'a' };
    const nodeB = { id: 2, title: 'b' };

    const stringData = JSON.stringify({
      nodes: [nodeA, nodeB],
      links: [{ source: nodeA, target: nodeB, props: { type: 'foo' } }],
    });

    const serializedGraph: Serialized<{ id: number; title: string }, { type: string }> =
      JSON.parse(stringData);

    const graph = deserializeGraph(serializedGraph, (n) => n.id);

    expect(graph.nodes).toHaveLength(2);
  });

  it.skip('should return a graph with type inferred from the input', () => {
    const nodeA = { id: 1, title: 'a' };
    const nodeB = { id: 2, title: 'b' };
    const serialized = {
      nodes: [nodeA, nodeB],
      links: [{ source: nodeA, target: nodeB, props: { type: 'foo' } }],
    };

    const graph = deserializeGraph(serialized, (n) => n.id);
    expectTypeOf(graph).toEqualTypeOf<
      Graph<{ id: number; title: string }, { type: string }>
    >();
  });

  it.skip('should require an identity function when nodes are objects', () => {
    const nodeA = { id: 1, title: 'a' };
    const nodeB = { id: 2, title: 'b' };
    const serialized = {
      nodes: [nodeA, nodeB],
      links: [{ source: nodeA, target: nodeB, props: { type: 'foo' } }],
    };

    // @ts-expect-error Missing identity function
    deserializeGraph(serialized);
  });
});
