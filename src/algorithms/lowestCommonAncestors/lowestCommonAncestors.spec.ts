import { describe, expect, it } from 'vitest';
import { Graph } from '../../Graph.js';
import { lowestCommonAncestors } from './lowestCommonAncestors.js';

describe('lowestCommonAncestors', () => {
  it('Should compute lowest common ancestors.', function () {
    const graph = new Graph()
      .addEdge('a', 'b')
      .addEdge('b', 'd')
      .addEdge('c', 'd')
      .addEdge('b', 'e')
      .addEdge('c', 'e')
      .addEdge('d', 'g')
      .addEdge('e', 'g')
      .addNode('f');

    expect(lowestCommonAncestors(graph, 'a', 'a')).toEqual(['a']);
    expect(lowestCommonAncestors(graph, 'a', 'b')).toEqual(['b']);
    expect(lowestCommonAncestors(graph, 'a', 'c')).toEqual(['d', 'e']);
    expect(lowestCommonAncestors(graph, 'a', 'f')).toEqual([]);
  });
});
