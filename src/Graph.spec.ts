import { describe, expect, it } from 'vitest';

import { Graph } from './index.js';
import { indegree } from './utils/indegree.js';
import { outdegree } from './utils/outdegree.js';

describe('Graph', function () {
  describe('Data structure', function () {
    it('Should add nodes and list them.', function () {
      const graph = new Graph();
      graph.addNode('a');
      graph.addNode('b');

      const nodes = graph.nodes;

      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it('Should chain addNode.', function () {
      const graph = new Graph().addNode('a').addNode('b');
      const nodes = graph.nodes;

      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it('Should remove nodes.', function () {
      const graph = new Graph();
      graph.addNode('a');
      graph.addNode('b');
      graph.removeNode('a');
      graph.removeNode('b');

      const nodes = graph.nodes;
      expect(nodes).toHaveLength(0);
    });

    it('Should chain removeNode.', function () {
      const graph = new Graph().addNode('a').addNode('b').removeNode('a').removeNode('b');

      const nodes = graph.nodes;
      expect(nodes).toHaveLength(0);
    });

    it('Should add edges and query for adjacent nodes.', function () {
      const graph = new Graph();
      graph.addNode('a');
      graph.addNode('b');
      graph.addEdge('a', 'b');

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);
    });

    it('Should implicitly add nodes when edges are added.', function () {
      const graph = new Graph();
      graph.addEdge('a', 'b');

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);

      const nodes = graph.nodes;
      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it('Should chain addEdge.', function () {
      const graph = new Graph().addEdge('a', 'b');
      const adjacentNodes = graph.adjacent('a');

      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);
    });

    it('Should remove edges.', function () {
      const graph = new Graph();
      graph.addEdge('a', 'b');
      graph.removeEdge('a', 'b');

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(0);
    });

    it('Should chain removeEdge.', function () {
      const graph = new Graph().addEdge('a', 'b').removeEdge('a', 'b');

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(0);
    });

    it('Should not remove nodes when edges are removed.', function () {
      const graph = new Graph();
      graph.addEdge('a', 'b');
      graph.removeEdge('a', 'b');

      const nodes = graph.nodes;
      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });
    it('Should remove outgoing edges when a node is removed.', function () {
      const graph = new Graph();
      graph.addEdge('a', 'b');
      graph.removeNode('a');
      expect(graph.adjacent('a')).toEqual(undefined);
    });

    it('Should remove incoming edges when a node is removed.', function () {
      const graph = new Graph();
      graph.addEdge('a', 'b');
      graph.removeNode('b');
      expect(graph.adjacent('a')?.size).toEqual(0);
    });
  });

  describe('Edge cases and error handling', function () {
    it('Should return undefined for unknown nodes.', function () {
      const graph = new Graph();
      expect(graph.adjacent('a')).toEqual(undefined);
      expect(graph.nodes).toHaveLength(0);
    });

    it('Should do nothing if removing an edge that does not exist.', function () {
      const graph = new Graph();
      expect(() => graph.removeEdge('a', 'b')).not.toThrowError();
    });

    it('Should return indegree of 0 for unknown nodes.', function () {
      const graph = new Graph();
      expect(indegree(graph, 'z')).toEqual(0);
    });

    it('Should return outdegree of 0 for unknown nodes.', function () {
      const graph = new Graph();
      expect(outdegree(graph, 'z')).toEqual(0);
    });
  });

  describe('Edge Weights', function () {
    it('Should set and get an edge weight.', function () {
      const graph = new Graph().addEdge('a', 'b', 5);
      expect(graph.getEdgeWeight('a', 'b')).toEqual(5);
    });

    it('Should set edge weight via setEdgeWeight.', function () {
      const graph = new Graph().addEdge('a', 'b').setEdgeWeight('a', 'b', 5);
      expect(graph.getEdgeWeight('a', 'b')).toEqual(5);
    });

    it('Should return weight of 1 if no weight set.', function () {
      const graph = new Graph().addEdge('a', 'b');
      expect(graph.getEdgeWeight('a', 'b')).toEqual(1);
    });
  });

  describe('hadEdge', function () {
    it('Should compute hasEdge.', function () {
      const graph = new Graph().addEdge('a', 'b');
      expect(graph.hasEdge('a', 'b')).toEqual(true);
      expect(graph.hasEdge('b', 'a')).toEqual(false);
      expect(graph.hasEdge('c', 'a')).toEqual(false);
    });
  });
});
