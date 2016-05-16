# graph-data-structure 

A [graph data structure](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)) with [topological sort](https://en.wikipedia.org/wiki/Topological_sorting). [![NPM](https://nodei.co/npm/graph-data-structure.png?mini=true)](https://nodei.co/npm/graph-data-structure/) [![Build Status](https://travis-ci.org/datavis-tech/graph-data-structure.svg?branch=master)](https://travis-ci.org/curran/graph-data-structure) 

This library provides a minimalist implementation of a directed graph data structure. Nodes are represented by unique strings. Internally, an [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) is used to represent edges. The main use case is when you need topological sort, to get an ordering of nodes such that for each edge (**u** -> **v**), **u** comes before **v**.

The primary use case for this library is in implementing [dataflow programming](https://en.wikipedia.org/wiki/Dataflow_programming) or [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming). The topological sorting algorithm exposed here supports modifications useful for computing the order in which functions in a data flow graph should be executed, while leaving out parts of the graph that do not change. Namely, you can specify a set of **source nodes**, and the topologically sorted result only contains the subset of nodes impacted by changes originating at the source nodes.

To create a graph instance, invoke `Graph` as a constructor function.

```javascript
var graph = Graph();
```

Add some nodes and edges with `addNode` and `addEdge`.

```javascript
graph.addNode("a");
graph.addNode("b");
graph.addEdge("a", "b");
```

Nodes are added implicitly when edges are added.

```javascript
graph.addEdge("b", "c");
```

[Topological sort](https://en.wikipedia.org/wiki/Topological_sorting) can be invoked like this.

```
graph.topologicalSort(); // Returns ["a", "b", "c"]
```

Here's an example of topological sort with getting dressed (from Cormen et al. "Introduction to Algorithms" page 550).

```javascript
var graph = Graph();

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

console.log(graph.topologicalSort()); // prints [ "underpants", "pants", "shirt", "tie", "belt", "jacket", "socks", "shoes" ]
```

For more detailed example code that shows more methods, have a look at the [tests](https://github.com/datavis-tech/graph-data-structure/blob/master/test.js).

# Installation

This library is distributed only via [NPM](npmjs.com). Install by running

`npm install graph-data-structure`

Require it in your code like this.

```javascript
var Graph = require("graph-data-structure");
```

# API Reference

* [Creating a Graph](#creating-a-graph)
* [Adding and Removing Nodes](#adding-and-removing-nodes)
* [Adding and Removing Edges](##adding-and-removing-edges)
* [Querying the Graph](#querying-the-graph)
* [Graph Algorithms](#graph-algorithms)

### Creating a Graph

<a name="constructor" href="#constructor">#</a> <b>Graph</b>()

Constructs an instance of the graph data structure.

```javascript
var graph = Graph();
```

### Adding and Removing Nodes

<a name="add-node" href="#add-node">#</a> <i>graph</i>.<b>addNode</b>(<i>node</i>)

Adds a node to the graph. The argument *node* is a string identifier that uniquely identifies the node within this graph instance. If a node with the same identifier was already added to the graph, this function does nothing.

<a name="remove-node" href="#remove-node">#</a> <i>graph</i>.<b>removeNode</b>(<i>node</i>)

Removes the specified node. The argument *node* is a string identifier for the node to remove. This function also removes all edges connected to the specified node, both incoming and outgoing.

### Adding and Removing Edges

* `addEdge(u, v)` Adds an edge from node u to node v. Implicitly adds the nodes if they were not already added.
* `removeEdge(u, v)` Removes the edge from node u to node v. Does not remove the nodes. Does nothing if the edge does not exist.

### Querying the Graph

* `nodes()` List all nodes in the graph.
* `adjacent(node)` Gets the adjacent node list for the given node. This is the set of nodes for which there is an incoming edge from the given node.

### Graph Algorithms

* `depthFirstSearch(sourceNodes, includeSourceNodes)` Depth First Search algorithm, inspired by Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604. This variant includes an additional option `includeSourceNodes` to specify whether to include or exclude the source nodes from the result (true by default). If `sourceNodes` is not specified, all nodes in the graph are used as source nodes.
* `topologicalSort(sourceNodes, includeSourceNodes)` The topological sort algorithm yields a list of visited nodes such that for each visited edge (u, v), u comes before v in the list. Amazingly, this comes from just reversing the result from depth first search. Inspired by Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613. This variant includes an additional option `includeSourceNodes` to specify whether to include or exclude the source nodes from the result (true by default). If `sourceNodes` is not specified, all nodes in the graph are used as source nodes.
