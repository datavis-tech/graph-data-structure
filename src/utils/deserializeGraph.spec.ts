import { describe, it } from 'vitest';
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
});
