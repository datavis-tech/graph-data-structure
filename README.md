# graph-data-structure

A graph data structure with topological sort algorithm.

[![NPM](https://nodei.co/npm/graph-data-structure.png)](https://nodei.co/npm/graph-data-structure/)

[![Build Status](https://travis-ci.org/curran/graph-data-structure.svg?branch=master)](https://travis-ci.org/curran/graph-data-structure)

# Usage

If you are using NPM, install the library by running

`npm install graph-data-structure`

Require it in your code like this.

```javascript
var Graph = require("graph-data-structure");
```

Create a graph instance.

```javascript
var graph = Graph();
```

Add some nodes and edges.

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

For more detailed example code that shows more methods, have a look at the [tests](https://github.com/curran/graph-data-structure/blob/master/test.js).

# API Reference

Methods on graphs include:

* `addNode(node)` Adds a node to the graph, accepts a string node identifier. If node was already added, this function does nothing.
* `removeNode(node)` Removes a node from the graph. Also removes incoming and outgoing edges.
* `nodes()` List all nodes in the graph.
* `adjacent(node)` Gets the adjacent node list for the given node. This is the set of nodes for which there is an incoming edge from the given node.
* `addEdge(u, v)` Adds an edge from node u to node v. Implicitly adds the nodes if they were not already added.
* `removeEdge(u, v)` Removes the edge from node u to node v. Does not remove the nodes. Does nothing if the edge does not exist.
* `depthFirstSearch(sourceNodes, includeSourceNodes)` Depth First Search algorithm, inspired by Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604. This variant includes an additional option `includeSourceNodes` to specify whether to include or exclude the source nodes from the result (true by default). If `sourceNodes` is not specified, all nodes in the graph are used as source nodes.
* `topologicalSort` The topological sort algorithm yields a list of visited nodes such that for each visited edge (u, v), u comes before v in the list. Amazingly, this comes from just reversing the result from depth first search. Inspired by Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
