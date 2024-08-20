import { describe, expectTypeOf, it } from 'vitest';
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
