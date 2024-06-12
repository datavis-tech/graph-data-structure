import { describe, expect, it } from 'vitest';

import { Graph, Serialized } from "./src/index.js";


function withWeight(nodeList: ReadonlyArray<unknown> & { weight?: number }, weight: number) {
  nodeList.weight = weight;
  return nodeList;
}

describe("Graph", function () {
  describe("Data structure", function () {
    it("Should add nodes and list them.", function () {
      const graph = new Graph();
      graph.addNode("a");
      graph.addNode("b");

      const nodes = graph.nodes();

      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it("Should chain addNode.", function () {
      const graph = new Graph().addNode("a").addNode("b");
      const nodes = graph.nodes();

      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it("Should remove nodes.", function () {
      const graph = new Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.removeNode("a");
      graph.removeNode("b");

      const nodes = graph.nodes();
      expect(nodes).toHaveLength(0);
    });

    it("Should chain removeNode.", function () {
      const graph = new Graph()
        .addNode("a")
        .addNode("b")
        .removeNode("a")
        .removeNode("b");

      const nodes = graph.nodes();
      expect(nodes).toHaveLength(0);
    });

    it("Should add edges and query for adjacent nodes.", function () {
      const graph = new Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.addEdge("a", "b");

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);
    });

    it("Should implicitly add nodes when edges are added.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);

      const nodes = graph.nodes();
      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });

    it("Should chain addEdge.", function () {
      const graph = new Graph().addEdge("a", "b");
      const adjacentNodes = graph.adjacent('a');

      expect(adjacentNodes).toHaveLength(1);
      expect(adjacentNodes?.has('b')).toBe(true);
    });

    it("Should remove edges.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(0);
    });

    it("Should chain removeEdge.", function () {
      const graph = new Graph().addEdge("a", "b").removeEdge("a", "b");

      const adjacentNodes = graph.adjacent('a');
      expect(adjacentNodes).toHaveLength(0);
    });

    it("Should not remove nodes when edges are removed.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");

      const nodes = graph.nodes();
      expect(nodes).toHaveLength(2);
      expect(nodes).toContain('a');
      expect(nodes).toContain('b');
    });
    it("Should remove outgoing edges when a node is removed.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.removeNode("a");
      expect(graph.adjacent("a")).toEqual(undefined);
    });

    it("Should remove incoming edges when a node is removed.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.removeNode("b");
      expect(graph.adjacent("a")?.size).toEqual(0);
    });

    it("Should compute indegree.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      expect(graph.indegree("a")).toEqual(0);
      expect(graph.indegree("b")).toEqual(1);

      graph.addEdge("c", "b");
      expect(graph.indegree("b")).toEqual(2);
    });

    it("Should compute outdegree.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      expect(graph.outdegree("a")).toEqual(1);
      expect(graph.outdegree("b")).toEqual(0);

      graph.addEdge("a", "c");
      expect(graph.outdegree("a")).toEqual(2);
    });
  });

  describe("Algorithms", function () {
    it("Should detect cycle.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.addEdge("b", "a");
      expect(graph.hasCycle()).toBe(true);
    });

    it("Should detect cycle (long).", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "d");
      graph.addEdge("d", "a");
      expect(graph.hasCycle()).toBe(true);
    });

    it("Should detect cycle (loop).", function () {
      const graph = new Graph();
      graph.addEdge("a", "a");
      expect(graph.hasCycle()).toBe(true);
    });

    it("Should not detect cycle.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      expect(graph.hasCycle()).toBe(false);
    });

    // This example is from Cormen et al. "Introduction to Algorithms" page 550
    it("Should compute topological sort.", function () {
      const graph = new Graph();

      // Shoes depend on socks.
      // Socks need to be put on before shoes.
      graph.addEdge("socks", "shoes");

      graph.addEdge("shirt", "belt");
      graph.addEdge("shirt", "tie");
      graph.addEdge("tie", "jacket");
      graph.addEdge("belt", "jacket");
      graph.addEdge("pants", "shoes");
      graph.addEdge("underpants", "pants");
      graph.addEdge("pants", "belt");

      const sorted = graph.topologicalSort();

      expect(comesBefore(sorted, "pants", "shoes")).toBe(true)
      expect(comesBefore(sorted, "underpants", "pants")).toBe(true)
      expect(comesBefore(sorted, "underpants", "shoes")).toBe(true)
      expect(comesBefore(sorted, "shirt", "jacket")).toBe(true)
      expect(comesBefore(sorted, "shirt", "belt")).toBe(true)
      expect(comesBefore(sorted, "belt", "jacket")).toBe(true)

      expect(sorted.length).toEqual(8);
    });

    it("Should compute topological sort, excluding source nodes.", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      const sorted = graph.topologicalSort(["a"], false);
      expect(sorted.length).toEqual(2);
      expect(sorted[0]).toEqual("b");
      expect(sorted[1]).toEqual("c");
    });

    it("Should compute topological sort tricky case.", function () {
      const graph = new Graph();            //      a
                                            //     / \
      graph.addEdge("a", "b"); //    b   |
      graph.addEdge("a", "d"); //    |   d
      graph.addEdge("b", "c"); //    c   |
      graph.addEdge("d", "e"); //     \ /
      graph.addEdge("c", "e"); //      e

      const sorted = graph.topologicalSort(["a"], false);
      expect(sorted.length).toEqual(4);
      expect(sorted).toContain('b');
      expect(sorted).toContain('c');
      expect(sorted).toContain('d');

      expect(sorted[sorted.length - 1]).toEqual("e");

      expect(comesBefore(sorted, "b", "c")).toBe(true)
      expect(comesBefore(sorted, "b", "e")).toBe(true)
      expect(comesBefore(sorted, "c", "e")).toBe(true)
      expect(comesBefore(sorted, "d", "e")).toBe(true)
    });

    it("Should exclude source nodes with a cycle.", function () {
      const graph = new Graph().addEdge("a", "b").addEdge("b", "c").addEdge("c", "a");
      const sorted = graph.topologicalSort(["a"], false);
      expect(sorted.length).toEqual(2);
      expect(sorted[0]).toEqual("b");
      expect(sorted[1]).toEqual("c");
    });

    it("Should exclude source nodes with multiple cycles.", function () {
      const graph = new Graph()
        .addEdge("a", "b")
        .addEdge("b", "a")

        .addEdge("b", "c")
        .addEdge("c", "b")

        .addEdge("a", "c")
        .addEdge("c", "a");

      const sorted = graph.topologicalSort(["a", "b"], false);
      expect(sorted).not.toContain('b');
    });

    it("Should error on non-DAG topological sort", function () {
      const graph = new Graph();
      graph.addEdge("a", "b");
      graph.addEdge("b", "a");
      expect(graph.topologicalSort).toThrowError();
    });

    it("Should compute lowest common ancestors.", function () {
      const graph = new Graph()
        .addEdge("a", "b")
        .addEdge("b", "d")
        .addEdge("c", "d")
        .addEdge("b", "e")
        .addEdge("c", "e")
        .addEdge("d", "g")
        .addEdge("e", "g")
        .addNode("f");

      expect(graph.lowestCommonAncestors("a", "a")).toEqual(["a"]);
      expect(graph.lowestCommonAncestors("a", "b")).toEqual(["b"]);
      expect(graph.lowestCommonAncestors("a", "c")).toEqual(["d", "e"]);
      expect(graph.lowestCommonAncestors("a", "f")).toEqual([]);
    });
  });

  describe("Edge cases and error handling", function () {
    it("Should return undefined for unknown nodes.", function () {
      const graph = new Graph();
      expect(graph.adjacent("a")).toEqual(undefined);
      expect(graph.nodes()).toHaveLength(0);
    });

    it("Should do nothing if removing an edge that does not exist.", function () {
      const graph = new Graph();
      expect(() => graph.removeEdge("a", "b")).not.toThrowError();
    });

    it("Should return indegree of 0 for unknown nodes.", function () {
      const graph = new Graph();
      expect(graph.indegree("z")).toEqual(0);
    });

    it("Should return outdegree of 0 for unknown nodes.", function () {
      const graph = new Graph();
      expect(graph.outdegree("z")).toEqual(0);
    });
  });

  describe("Serialization", function () {
    let serialized: Serialized<string>;

    function checkSerialized(graph: Serialized<string>) {
      expect(graph.nodes.length).toEqual(3);
      expect(graph.links.length).toEqual(2);

      expect(graph.nodes[0]).toEqual("a");
      expect(graph.nodes[1]).toEqual("b");
      expect(graph.nodes[2]).toEqual("c");

      expect(graph.links[0].source).toEqual("a");
      expect(graph.links[0].target).toEqual("b");
      expect(graph.links[1].source).toEqual("b");
      expect(graph.links[1].target).toEqual("c");
    }

    it("Should serialize a graph.", function () {
      const graph = new Graph<string>().addEdge("a", "b").addEdge("b", "c");
      serialized = graph.serialize();
      checkSerialized(serialized);
    });

    it("Should deserialize a graph.", function () {
      const graph = new Graph<string>();
      graph.deserialize(serialized);
      checkSerialized(graph.serialize());
    });

    it("Should static deserialize a graph.", function () {
      const graph = Graph.deserialize(serialized);
      checkSerialized(graph.serialize());
    });

    it("Should deserialize a graph passed to constructor.", function () {
      const graph = new Graph(serialized);
      checkSerialized(graph.serialize());
    });
  });

  describe("Edge Weights", function () {
    it("Should set and get an edge weight.", function () {
      const graph = new Graph().addEdge("a", "b", 5);
      expect(graph.getEdgeWeight("a", "b")).toEqual(5);
    });

    it("Should set edge weight via setEdgeWeight.", function () {
      const graph = new Graph().addEdge("a", "b").setEdgeWeight("a", "b", 5);
      expect(graph.getEdgeWeight("a", "b")).toEqual(5);
    });

    it("Should return weight of 1 if no weight set.", function () {
      const graph = new Graph().addEdge("a", "b");
      expect(graph.getEdgeWeight("a", "b")).toEqual(1);
    });
  });

  describe("Dijkstra's Shortest Path Algorithm", function () {
    it("Should compute shortest path on a single edge.", function () {
      const graph = new Graph().addEdge("a", "b");
      expect(graph.shortestPath("a", "b")).toEqual(withWeight(["a", "b"], 1));
    });

    it("Should compute shortest path on two edges.", function () {
      const graph = new Graph().addEdge("a", "b").addEdge("b", "c");
      expect(graph.shortestPath("a", "c")).toEqual(withWeight(["a", "b", "c"], 2));
    });

    it("Should compute shortest path on example from Cormen text (p. 659).", function () {
      const graph = new Graph()
        .addEdge("s", "t", 10)
        .addEdge("s", "y", 5)
        .addEdge("t", "y", 2)
        .addEdge("y", "t", 3)
        .addEdge("t", "x", 1)
        .addEdge("y", "x", 9)
        .addEdge("y", "z", 2)
        .addEdge("x", "z", 4)
        .addEdge("z", "x", 6);

      expect(
        graph.shortestPath("s", "z")).toEqual(
        withWeight(["s", "y", "z"], 5 + 2)
      );
      expect(
        graph.shortestPath("s", "x")).toEqual(
        withWeight(["s", "y", "t", "x"], 5 + 3 + 1)
      );
    });

    it("Should throw error if source node not in graph.", function () {
      const graph = new Graph().addEdge("b", "c");
      expect(() => graph.shortestPath("a", "c")).toThrowError(/Source node/);
    });

    it("Should throw error if dest node not in graph.", function () {
      const graph = new Graph().addEdge("b", "c");
      expect(() => graph.shortestPath("b", "g")).toThrowError(/Destination node/);
    });

    it("Should throw error if no path exists.", function () {
      const graph = new Graph().addEdge("a", "b").addEdge("d", "e");
      expect(() => graph.shortestPath("a", "e")).toThrowError(/No path/);
    });

    it("Should be robust to disconnected subgraphs.", function () {
      const graph = new Graph().addEdge("a", "b").addEdge("b", "c").addEdge("d", "e");
      expect(
        graph.shortestPath("a", "c")).toEqual(
        withWeight(["a", "b", "c"], 2)
      );
    });

    it("Should compute shortest paths.", function () {
      const graph = new Graph()
        .addEdge("a", "b")
        .addEdge("b", "c")
        .addEdge("a", "d")
        .addEdge("d", "c")
        .addEdge("a", "e")
        .addEdge("e", "f")
        .addEdge("f", "c");

      const serializedGraph = graph.serialize();

      expect(graph.shortestPaths("a", "c")).toEqual([
        withWeight(["a", "b", "c"], 2),
        withWeight(["a", "d", "c"], 2),
      ]);

      // check graph has not changed
      const postSerializedGraph = graph.serialize();
      expect(postSerializedGraph.links.length).toEqual(serializedGraph.links.length);
      expect(postSerializedGraph.nodes.length).toEqual(serializedGraph.nodes.length);
    });
  });

  describe("hadEdge", function () {
    it("Should compute hasEdge.", function () {
      const graph = new Graph().addEdge("a", "b");
      expect(graph.hasEdge("a", "b")).toEqual(true);
      expect(graph.hasEdge("b", "a")).toEqual(false);
      expect(graph.hasEdge("c", "a")).toEqual(false);
    });
  });

});

function comesBefore(arr: ReadonlyArray<unknown>, a: unknown, b: unknown) {
  let aIndex = 0, bIndex = 0;
  arr.forEach(function (d, i) {
    if (d === a) {
      aIndex = i;
    }
    if (d === b) {
      bIndex = i;
    }
  });

  return aIndex < bIndex;
}
