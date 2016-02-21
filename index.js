// A graph data structure with depth-first search and topological sort.
module.exports = function Graph(){
  
  // The adjacency list of the graph.
  // Keys are node ids.
  // Values are adjacent node id arrays.
  var edges = {};

  // Gets or creates the adjacent node list for node u.
  function adjacent(u){
    return edges[u] || [];
  }

  // Adds node u to the graph.
  // If u was already added, this function does nothing.
  // If u was not already added, this function sets up an empty adjacency list for u.
  function addNode(u){
    edges[u] = adjacent(u);
  }

  // Adds an edge between nodes u and v.
  // Implicitly creates the nodes if they were not already added to the graph.
  function addEdge(u, v){
    addNode(u);
    addNode(v);
    adjacent(u).push(v);
  }

  function removeEdge(u, v){
    if(edges[u]){
      edges[u] = adjacent(u).filter(function (_v){
        return _v !== v;
      });
    }
  }

  // Depth First Search algorithm, inspired by
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
  // This variant excludes the source nodes from the result.
  function depthFirstSearch(sourceNodes){

    var visited = {};
    var nodes = [];

    function DFSVisit(node){
      if(!visited[node]){
        visited[node] = true;
        adjacent(node).forEach(DFSVisit);
        nodes.push(node);
      }
    }

    sourceNodes.forEach(function (node){
      adjacent(node).forEach(DFSVisit);
    });

    return nodes;
  }

  // The topological sort algorithm yields a list of visited nodes
  // such that for each visited edge (u, v), u comes before v in the list.
  // Amazingly, this comes from just reversing the result from depth first search.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
  function topologicalSort(sourceNodes){
    return depthFirstSearch(sourceNodes).reverse();
  }
  
  return {
    adjacent: adjacent,
    addEdge: addEdge,
    removeEdge: removeEdge,
    depthFirstSearch: depthFirstSearch,
    topologicalSort: topologicalSort
  };
}
