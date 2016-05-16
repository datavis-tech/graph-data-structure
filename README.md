# graph-data-structure 

A [graph data structure](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)) with [topological sort](https://en.wikipedia.org/wiki/Topological_sorting). [![NPM](https://nodei.co/npm/graph-data-structure.png?mini=true)](https://nodei.co/npm/graph-data-structure/) [![Build Status](https://travis-ci.org/datavis-tech/graph-data-structure.svg?branch=master)](https://travis-ci.org/curran/graph-data-structure) 

This library provides a minimalist implementation of a directed graph data structure. Nodes are represented by unique strings. Internally, an [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) is used to represent edges. The main use case is when you need topological sort, to get an ordering of nodes such that for each edge (**u** -> **v**), **u** comes before **v**.

The primary use case for this library is in implementing [dataflow programming](https://en.wikipedia.org/wiki/Dataflow_programming) or [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming). The topological sorting algorithm exposed here has modifications useful for computing the order in which functions in a data flow graph should be executed, namely specifying source nodes for propagation and specifying to exclude the source nodes themselves from the result.

To create a graph instance, invoke **[Graph](#graph)** as a constructor function.

```javascript
var graph = Graph();
```

Add some nodes and edges with **[addNode](#add-node)** and **[addEdge](#add-edge)**.

```javascript
graph.addNode("a");
graph.addNode("b");
graph.addEdge("a", "b");
```

Nodes are added implicitly when edges are added.

```javascript
graph.addEdge("b", "c");
```

[Topological sorting](https://en.wikipedia.org/wiki/Topological_sorting) can be done by invoking **[topologicalSort](#topological-sort)** like this.

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

// prints [ "underpants", "pants", "shirt", "tie", "belt", "jacket", "socks", "shoes" ]
console.log(graph.topologicalSort());
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

<a name="graph" href="#graph">#</a> <b>Graph</b>()

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

<a name="add-edge" href="#add-edge">#</a> <i>graph</i>.<b>addEdge</b>(<i>u</i>, <i>v</i>)

Adds an edge from node *u* to node *v*. The arguments *u* and *v* are string identifiers for nodes. This function also adds *u* and *v* as nodes if they were not already added.

<a name="remove-edge" href="#remove-edge">#</a> <i>graph</i>.<b>removeEdge</b>(<i>u</i>, <i>v</i>)

Removes the edge from node *u* to node *v*. The arguments *u* and *v* are string identifiers for nodes. This function does not remove the nodes *u* and *v*. Does nothing if the edge does not exist.

### Querying the Graph

<a name="nodes" href="#nodes">#</a> <i>graph</i>.<b>nodes</b>()

List all nodes in the graph. Returns an array of node identifier strings.

<a name="adjacent" href="#adjacent">#</a> <i>graph</i>.<b>adjacent</b>(<i>node</i>)

Gets the adjacent node list for the specified node. The argument *node* is a string identifier for a node. Returns an array of node identifier strings.

The "adjacent node list" is the set of nodes for which there is an incoming edge from the given node. In other words, for all edges (**u** -> **v**) where **u** is the specified node, all values for **v** are in the adjacent node list. 

### Graph Algorithms

<a name="dfs" href="#dfs">#</a> <i>graph</i>.<b>depthFirstSearch</b>([<i>sourceNodes</i>][, <i>includeSourceNodes</i>])

Performs [Depth-first Search](https://en.wikipedia.org/wiki/Depth-first_search). Returns an array of node identifier strings. The returned array includes nodes visited by the algorithm in the order in which they were visited. Implementation inspired by pseudocode from Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604.

Arguments:

 * *sourceNodes* (optional) An array of node identifier strings. This specifies the subset of nodes to use as the sources of the depth-first search. If *sourceNodes* is not specified, all **[nodes](#nodes)** in the graph are used as source nodes.
 * *includeSourceNodes* (optional) is a boolean specifying whether or not to include the source nodes in the returned array. If *includeSourceNodes* is not specified, it is treated as `true` (all source nodes are included in the returned array).

<a name="topological-sort" href="#topological-sort">#</a> <i>graph</i>.<b>topologicalSort</b>([<i>sourceNodes</i>][, <i>includeSourceNodes</i>])

Performs [Topological Sort](https://en.wikipedia.org/wiki/Topological_sorting). Returns an array of node identifier strings. The returned array includes nodes in topologically sorted order. This means that for each visited edge (**u** -> **v**), **u** comes before **v** in the topologically sorted order. Amazingly, this comes from simply reversing the result from depth first search. Inspired by by Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613.

See **[depthFirstSearch](#dfs)** for documentation of the arguments *sourceNodes* and *includeSourceNodes*.

<p align="center">
  <a href="https://datavis.tech/">
    <img src="https://cloud.githubusercontent.com/assets/68416/15298394/a7a0a66a-1bbc-11e6-9636-367bed9165fc.png">
  </a>
</p>
