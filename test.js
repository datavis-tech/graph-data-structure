
// Unit tests for reactive-property.
var assert = require("assert");

// If using from the NPM package, this line would be
// var Graph = require("graph-data-structure");
var Graph = require("./index.js");

describe("Graph", function() {

  describe("Data structure", function() {

    it("Should add nodes and list them.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

    it("Should remove nodes.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.removeNode("a");
      graph.removeNode("b");
      assert.equal(graph.nodes().length, 0);
    });

    it("Should add edges and query for adjacent nodes.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.addEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 1);
      assert.equal(graph.adjacent("a")[0], "b");
    });

    it("Should implicitly add nodes when edges are added.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 1);
      assert.equal(graph.adjacent("a")[0], "b");
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

    it("Should remove edges.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 0);

      // Should not remove associated nodes when edges are removed.
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

  });


  describe("Edge cases and error handling", function() {

    it("Should return empty array of adjacent nodes for unknown nodes.", function (){
      var graph = Graph();
      assert.equal(graph.adjacent("a").length, 0);
      assert.equal(graph.nodes(), 0);
    });

    it("Should do nothing if removing an edge that does not exist.", function (){
      assert.doesNotThrow(function (){
        var graph = Graph();
        graph.removeEdge("a", "b");
      });
    });

  });
});

function contains(arr, item){
  return arr.filter(function (d){
    return d === item;
  }).length > 0;
}
