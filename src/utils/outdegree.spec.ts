import { describe, expect, it } from 'vitest';
import { Graph } from '../Graph.js';
import { indegree } from './indegree.js';
import { outdegree } from './outdegree.js';

describe('outdegree', () => {
  it('Should compute outdegree.', function () {
    const graph = new Graph();
    graph.addEdge('a', 'b');
    expect(outdegree(graph, 'a')).toEqual(1);
    expect(outdegree(graph, 'b')).toEqual(0);

    graph.addEdge('a', 'c');
    expect(outdegree(graph, 'a')).toEqual(2);
  });
});
