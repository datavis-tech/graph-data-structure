# graph-data-structure

A graph data structure with topological sort algorithm.

[![Build Status](https://travis-ci.org/curran/graph-data-structure.svg?branch=master)](https://travis-ci.org/curran/graph-data-structure)

[![NPM](https://nodei.co/npm/graph-data-structure.png)](https://nodei.co/npm/graph-data-structure/)

# Usage

Install the library by running

`npm install graph-data-structure`

Require it in your code like this.

```javascript
var Graph = require("graph-data-structure");
```

Create a graph.

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

[Topological sort](https://en.wikipedia.org/wiki/Topological_sorting) can be invoked with an array source nodes (which are excluded from the result).

```
graph.topologicalSort(["a"]); // Returns ["b", "c"]
```

For more detailed example code, have a look at the [tests](https://github.com/curran/graph-data-structure/blob/master/test.js).
