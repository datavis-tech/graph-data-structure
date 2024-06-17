import { describe, expect, it } from 'vitest';
import { Graph } from '../../Graph.js';
import { depthFirstSearch } from './index.js';

describe('depthFirstSearch', () => {
  it.todo(
    'Should return the nodes connected to the source node with the correct type of edge.',
    function () {
      const graph = new Graph<string, { type: 'follow' | 'stop' }>();

      // Shoes depend on socks.
      // Socks need to be put on before shoes.
      graph.addEdge('a', 'b', undefined, { type: 'follow' });

      const nodes = depthFirstSearch(graph, {
        visit: (source, target, graph) =>
          graph.getEdgeProperties(source, target).type === 'follow',
      });

      // expect(sorted.length).toEqual(8);
      expect(nodes).toContain('socks');
      expect(nodes).toContain('shoes');
    },
  );
});
