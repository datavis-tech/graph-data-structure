import { describe, it } from 'vitest';
import { Graph } from '../Graph.js';
import { findNodes } from './findNodes.js';

describe('findNodes', () => {
  type Node = { id: string; type: string };

  it('should retrieve a node successfully when it exists in the graph', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(findNodes(graph, (n) => n.id === '1')).toEqual([node1]);
    expect(findNodes(graph, (n) => n.id === '2')).toEqual([node2]);
  });

  it('should return an empty array when no matching node is found', ({ expect }) => {
    const graph = new Graph<Node>();
    expect(findNodes(graph, (n) => n.id === 'nope')).toEqual([]);
  });

  it('should return all the nodes matching', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(findNodes(graph, (n) => n.type === 'foo')).toEqual([node1, node2]);
  });
});
