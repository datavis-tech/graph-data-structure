import { describe, expectTypeOf, it } from 'vitest';
import { Graph } from '../Graph.js';
import { checkSerialized } from '../test-utils.js';
import { deserializeGraph } from './deserializeGraph.js';
import { serializeGraph } from './serializeGraph.js';

describe('serializeGraph', () => {
  it('Should deserialize a graph.', function () {
    const g = new Graph<string>().addEdge('a', 'b').addEdge('b', 'c');
    const serialized = serializeGraph(g);

    const graph = deserializeGraph(serialized);
    checkSerialized(serializeGraph(graph));
  });

  it('Should deserialize a graph passed to constructor.', function () {
    const g = new Graph<string>().addEdge('a', 'b').addEdge('b', 'c');
    const serialized = serializeGraph(g);
    const graph = new Graph(serialized);
    checkSerialized(serializeGraph(graph));
  });

  it.skip('should return a graph with type inferred from the input', function () {
    const nodeA = { title: 'a' };
    const nodeB = { title: 'b' };
    const serialized = {
      nodes: [nodeA, nodeB],
      links: [{ source: nodeA, target: nodeB, props: { type: 'foo' } }],
    };

    const graph = deserializeGraph(serialized);
    expectTypeOf(graph).toEqualTypeOf<Graph<{ title: string }, { type: string }>>();
  });
});
