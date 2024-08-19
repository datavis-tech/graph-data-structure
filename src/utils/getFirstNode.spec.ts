import { describe, it } from 'vitest';
import { Graph } from '../Graph.js';
import { getFirstNode } from './getFirstNode.js';

describe('getFirstNode', () => {
  type Node = { id: string; type: string };

  it('should retrieve a node successfully when it exists in the graph', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(getFirstNode(graph, (n) => n.id === '1')).toEqual(node1);
    expect(getFirstNode(graph, (n) => n.id === '2')).toEqual(node2);
  });

  it('should throw when the node is not found', ({ expect }) => {
    const graph = new Graph<Node>();
    expect(() => getFirstNode(graph, (n) => n.id === 'nope')).toThrowError();
  });

  it('should not throw when more than one node is found', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(getFirstNode(graph, (n) => n.type === 'foo')).toEqual(node1);
  });
});
