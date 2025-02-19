import { describe, expect, it, vi } from 'vitest';
import { Graph } from '../../Graph.js';
import { serializeGraph } from '../../utils/serializeGraph.js';
import { shortestPath } from './shortestPath.js';
import { shortestPaths } from './shortestPaths.js';
import { addWeightFunction } from './getPath.js';
import { NextWeightFnParams } from '../../types.js';

describe("Dijkstra's Shortest Path Algorithm", function () {
  it('Should compute shortest path on a single edge.', function () {
    const graph = new Graph().addEdge('a', 'b');
    expect(shortestPath(graph, 'a', 'b')).toEqual({
      nodes: ['a', 'b'],
      weight: 1,
    });
  });

  it('Should compute shortest path on two edges.', function () {
    const graph = new Graph().addEdge('a', 'b').addEdge('b', 'c');
    expect(shortestPath(graph, 'a', 'c')).toEqual({
      nodes: ['a', 'b', 'c'],
      weight: 2,
    });
  });

  it('Should compute shortest path on example from Cormen text (p. 659).', function () {
    const graph = new Graph()
      .addEdge('s', 't', 10)
      .addEdge('s', 'y', 5)
      .addEdge('t', 'y', 2)
      .addEdge('y', 't', 3)
      .addEdge('t', 'x', 1)
      .addEdge('y', 'x', 9)
      .addEdge('y', 'z', 2)
      .addEdge('x', 'z', 4)
      .addEdge('z', 'x', 6);

    expect(shortestPath(graph, 's', 'z')).toEqual({
      nodes: ['s', 'y', 'z'],
      weight: 5 + 2,
    });

    expect(shortestPath(graph, 's', 'x')).toEqual({
      nodes: ['s', 'y', 't', 'x'],
      weight: 5 + 3 + 1,
    });
  });

  it('Should throw error if source node not in graph.', function () {
    const graph = new Graph().addEdge('b', 'c');
    expect(() => shortestPath(graph, 'a', 'c')).toThrowError(/Source node/);
  });

  it('Should throw error if dest node not in graph.', function () {
    const graph = new Graph().addEdge('b', 'c');
    expect(() => shortestPath(graph, 'b', 'g')).toThrowError(/Destination node/);
  });

  it('Should throw error if no path exists.', function () {
    const graph = new Graph().addEdge('a', 'b').addEdge('d', 'e');
    expect(() => shortestPath(graph, 'a', 'e')).toThrowError(/No path/);
  });

  it('Should be robust to disconnected subgraphs.', function () {
    const graph = new Graph().addEdge('a', 'b').addEdge('b', 'c').addEdge('d', 'e');
    expect(shortestPath(graph, 'a', 'c')).toEqual({
      nodes: ['a', 'b', 'c'],
      weight: 2,
    });
  });

  it('Should compute shortest paths.', function () {
    const graph = new Graph()
      .addEdge('a', 'b')
      .addEdge('b', 'c')
      .addEdge('a', 'd')
      .addEdge('d', 'c')
      .addEdge('a', 'e')
      .addEdge('e', 'f')
      .addEdge('f', 'c');

    const serializedGraph = serializeGraph(graph);

    expect(shortestPaths(graph, 'a', 'c')).toEqual([
      { nodes: ['a', 'b', 'c'], weight: 2 },
      { nodes: ['a', 'd', 'c'], weight: 2 },
    ]);

    // check graph has not been mutated
    // we can't perform a deep equal because the order of the elements is not guaranteed
    const postSerializedGraph = serializeGraph(graph);

    expect(postSerializedGraph.nodes).toContainEqual('a');
    expect(postSerializedGraph.nodes).toContainEqual('b');
    expect(postSerializedGraph.nodes).toContainEqual('c');
    expect(postSerializedGraph.nodes).toContainEqual('d');
    expect(postSerializedGraph.nodes).toContainEqual('e');
    expect(postSerializedGraph.nodes).toContainEqual('f');

    expect(postSerializedGraph.links).toContainEqual({ source: 'a', target: 'b' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'b', target: 'c' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'a', target: 'd' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'd', target: 'c' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'a', target: 'e' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'e', target: 'f' });
    expect(postSerializedGraph.links).toContainEqual({ source: 'f', target: 'c' });
  });
});

describe('addWeightFunction', () => {
  it('should return edgeWeight if currentPathWeight is undefined', () => {
    const graph = new Graph();
    const params = { edgeWeight: 5, currentPathWeight: undefined, hop: 1, sourceGraph: graph };
    expect(addWeightFunction(params)).toBe(5);
  });

  it('should return the sum of edgeWeight and currentPathWeight', () => {
    const graph = new Graph()
    const params = { edgeWeight: 5, currentPathWeight: 10, hop: 1, sourceGraph: graph };
    expect(addWeightFunction(params)).toBe(15);
  });
});

describe('shortestPath with custom weight functions', () => {
  it('should compute shortest path with default weight function (sum of weights)', () => {
    const graph = new Graph().addEdge('a', 'b', 1).addEdge('b', 'c', 2);
    expect(shortestPath(graph, 'a', 'c')).toEqual({
      nodes: ['a', 'b', 'c'],
      weight: 3,
    });
  });

  it('should compute shortest path with a custom weight function', () => {
    const customWeightFn = ({ edgeWeight, currentPathWeight, hop }: NextWeightFnParams) => {
      if (currentPathWeight === undefined) {
        return edgeWeight;
      }
      return currentPathWeight + edgeWeight ** hop;
    };

    const graph = new Graph().addEdge('a', 'b', 2).addEdge('b', 'c', 3);
    expect(shortestPath(graph, 'a', 'c', customWeightFn)).toEqual({
      nodes: ['a', 'b', 'c'],
      weight: 7,
    });
  });

  it('should pass correct parameters to custom weight function for a path with 3 nodes', () => {
    const customWeightFn = vi.fn(({ edgeWeight, currentPathWeight, hop }: NextWeightFnParams) => {
      if (currentPathWeight === undefined) {
        return edgeWeight;
      }
      return currentPathWeight + edgeWeight ** hop;
    });

    const graph = new Graph().addEdge('a', 'b', 1).addEdge('b', 'c', 2);
    shortestPath(graph, 'a', 'c', customWeightFn);

    expect(customWeightFn).toHaveBeenCalledWith({ edgeWeight: 2, currentPathWeight: undefined, hop: 1, sourceGraph: graph });
    expect(customWeightFn).toHaveBeenCalledWith({ edgeWeight: 1, currentPathWeight: 2, hop: 2, sourceGraph: graph });
  });

  it('should compute shortest path with a custom weight function in a graph with multiple paths', () => {
    const customWeightFn = ({ edgeWeight, currentPathWeight }: NextWeightFnParams) => {
      if (currentPathWeight === undefined) {
        return edgeWeight;
      }
      return edgeWeight + currentPathWeight;
    };

    const graph = new Graph()
      .addEdge('a', 'b', 1)
      .addEdge('b', 'c', 2)
      .addEdge('a', 'd', 1)
      .addEdge('d', 'c', 1);

    expect(shortestPath(graph, 'a', 'c', customWeightFn)).toEqual({
      nodes: ['a', 'd', 'c'],
      weight: 2,
    });
  });
});
