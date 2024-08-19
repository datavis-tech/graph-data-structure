import { describe, it } from 'vitest';
import { Graph } from '../Graph.js';
import { getNode } from './getNode.js';

describe('getNode', () => {
  type Node = { id: string; type: string };

  it('should retrieve a node successfully when it exists in the graph', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(getNode(graph, (n) => n.id === '1')).toEqual(node1);
    expect(getNode(graph, (n) => n.id === '2')).toEqual(node2);
  });

  it('should throw when the node is not found', ({ expect }) => {
    const graph = new Graph<Node>();
    expect(() => getNode(graph, (n) => n.id === 'nope')).toThrowError();
  });

  it('should throw when more than one node is found', ({ expect }) => {
    const graph = new Graph<Node>();
    const node1 = { id: '1', type: 'foo' };
    const node2 = { id: '2', type: 'foo' };

    graph.addNode(node1);
    graph.addNode(node2);

    expect(() => getNode(graph, (n) => n.type === 'foo')).toThrowError();
  });

  it.skip('should not trigger a type error when the link props are set', ({ expect }) => {
    const graph = new Graph<Node, { foo: string }>();
    const node1 = { id: '1', type: 'foo' };

    graph.addNode(node1);

    expect(getNode(graph, (n) => n.id === '1')).toEqual(node1);
  });
});
