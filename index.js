// A graph data structure with depth-first search and topological sort.
module.exports = function Graph(serialized){

  // The returned graph instance.
  var graph = {
    addNode: addNode,
    removeNode: removeNode,
    nodes: nodes,
    adjacent: adjacent,
    addEdge: addEdge,
    removeEdge: removeEdge,
    indegree: indegree,
    outdegree: outdegree,
    depthFirstSearch: depthFirstSearch,
    topologicalSort: topologicalSort,
    serialize: serialize,
    deserialize: deserialize
  };

  // The adjacency list of the graph.
  // Keys are node ids.
  // Values are adjacent node id arrays.
  var edges = {};

  // If a serialized graph was passed into the constructor, deserialize it.
  if(serialized){
    deserialize(serialized);
  }

  // Adds a node to the graph.
  // If node was already added, this function does nothing.
  // If node was not already added, this function sets up an empty adjacency list.
  function addNode(node){
    edges[node] = adjacent(node);
    return graph;
  }

  // Removes a node from the graph.
  // Also removes incoming and outgoing edges.
  function removeNode(node){
    
    // Remove incoming edges.
    Object.keys(edges).forEach(function (u){
      edges[u].forEach(function (v){
        if(v === node){
          removeEdge(u, v);
        }
      });
    });

    // Remove outgoing edges (and signal that the node no longer exists).
    delete edges[node];

    return graph;
  }

  // Gets the list of nodes that have been added to the graph.
  function nodes(){
    var nodeSet = {};
    Object.keys(edges).forEach(function (u){
      nodeSet[u] = true;
      edges[u].forEach(function (v){
        nodeSet[v] = true;
      });
    });
    return Object.keys(nodeSet);
  }

  // Gets the adjacent node list for the given node.
  // Returns an empty array for unknown nodes.
  function adjacent(node){
    return edges[node] || [];
  }

  // Adds an edge from node u to node v.
  // Implicitly adds the nodes if they were not already added.
  function addEdge(u, v){
    addNode(u);
    addNode(v);
    adjacent(u).push(v);
    return graph;
  }

  // Removes the edge from node u to node v.
  // Does not remove the nodes.
  // Does nothing if the edge does not exist.
  function removeEdge(u, v){
    if(edges[u]){
      edges[u] = adjacent(u).filter(function (_v){
        return _v !== v;
      });
    }
    return graph;
  }

  // Computes the indegree for the given node.
  // Not very efficient, costs O(E) where E = number of edges.
  function indegree(node){
    var degree = 0;
    function check(v){
      if(v === node){
        degree++;
      }
    }
    Object.keys(edges).forEach(function (u){
      edges[u].forEach(check);
    });
    return degree;
  }

  // Computes the outdegree for the given node.
  function outdegree(node){
    return node in edges ? edges[node].length : 0;
  }

  // Depth First Search algorithm, inspired by
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
  // This variant includes an additional option 
  // `includeSourceNodes` to specify whether to include or
  // exclude the source nodes from the result (true by default).
  // If `sourceNodes` is not specified, all nodes in the graph
  // are used as source nodes.
  function depthFirstSearch(sourceNodes, includeSourceNodes){

    if(!sourceNodes){
      sourceNodes = nodes();
    }

    if(typeof includeSourceNodes !== "boolean"){
      includeSourceNodes = true;
    }

    var visited = {};
    var nodeList = [];

    function DFSVisit(node){
      if(!visited[node]){
        visited[node] = true;
        adjacent(node).forEach(DFSVisit);
        nodeList.push(node);
      }
    }

    if(includeSourceNodes){
      sourceNodes.forEach(DFSVisit);
    } else {
      sourceNodes.forEach(function (node){
        visited[node] = true;
      });
      sourceNodes.forEach(function (node){
        adjacent(node).forEach(DFSVisit);
      });
    }

    return nodeList;
  }

  // The topological sort algorithm yields a list of visited nodes
  // such that for each visited edge (u, v), u comes before v in the list.
  // Amazingly, this comes from just reversing the result from depth first search.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
  function topologicalSort(sourceNodes, includeSourceNodes){
    return depthFirstSearch(sourceNodes, includeSourceNodes).reverse();
  }

  // Serializes the graph.
  function serialize(){
    var serialized = {
      nodes: nodes().map(function (id){
        return { id: id };
      }),
      links: []
    };

    serialized.nodes.forEach(function (node){
      var source = node.id;
      adjacent(source).forEach(function (target){
        serialized.links.push({
          source: source,
          target: target
        });
      });
    });

    return serialized;
  }

  // Deserializes the given serialized graph.
  function deserialize(serialized){
    serialized.nodes.forEach(function (node){ addNode(node.id); });
    serialized.links.forEach(function (link){ addEdge(link.source, link.target); });
    return graph;
  }
  
  return graph;
}
