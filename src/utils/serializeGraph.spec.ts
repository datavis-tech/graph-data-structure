import { describe, expect, expectTypeOf, it } from 'vitest';
import { Graph } from '../Graph.js';
import { checkSerialized } from '../test-utils.js';
import { Serialized } from '../types.js';
import { serializeGraph } from './serializeGraph.js';

describe('serializeGraph', () => {
  let serialized: Serialized<string>;

  it('Should serialize a graph.', function () {
    const graph = new Graph<string>().addEdge('a', 'b').addEdge('b', 'c');
    serialized = serializeGraph(graph);
    checkSerialized(serialized);
  });

  it('should use the node identity for link serialization', function () {
    const nodeA = { id: 1, title: 'a' };
    const nodeB = { id: 2, title: 'b' };

    const graph = new Graph<{ id: number; title: string }, { type: string }>();
    graph.addEdge(nodeA, nodeB, { props: { type: 'foo' } });

    const serialized = serializeGraph(graph, (n) => n.id);

    expect(serialized).toStrictEqual({
      nodes: [nodeA, nodeB],
      links: [{ source: 1, target: 2, props: { type: 'foo' } }],
    });
  });

  it('should reuse the same identity when the node is met multiple times', function () {
    const nodeA = { id: 1, title: 'a' };
    const nodeB = { id: 2, title: 'b' };
    const nodeC = { id: 3, title: 'c' };

    const graph = new Graph<{ id: number; title: string }>();
    graph.addEdge(nodeA, nodeC);
    graph.addEdge(nodeB, nodeC);

    // we use an object as identity
    const serialized = serializeGraph(graph, (n) => ({ id: n.id }));

    const nodeIdentityC1 = serialized.links.find(
      (l) => l.source.id === nodeA.id && l.target.id === nodeC.id,
    )?.target;
    const nodeIdentityC2 = serialized.links.find(
      (l) => l.source.id === nodeB.id && l.target.id === nodeC.id,
    )?.target;

    expect(nodeIdentityC1).toBeDefined();
    expect(nodeIdentityC1).toBe(nodeIdentityC2);
  });

  it.skip('should return a serialized input with type inferred from the graph', function () {
    const nodeA = { title: 'a' };
    const nodeB = { title: 'b' };

    const graph = new Graph<{ title: string }, { type: string }>();
    graph.addEdge(nodeA, nodeB, { props: { type: 'foo' } });

    const serialized = serializeGraph(graph);

    expectTypeOf(serialized).toEqualTypeOf<
      Serialized<{ title: string }, { type: string }>
    >();
  });
});
