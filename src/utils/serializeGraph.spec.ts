import { describe, expect, it } from 'vitest';
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
});
