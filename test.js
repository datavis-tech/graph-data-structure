
// Unit tests for reactive-property.
var assert = require("assert");

// If using from the NPM package, this line would be
// var Graph = require("graph-data-structure");
var Graph = require("./index.js");

describe("Graph", function() {

  describe("Data structure", function() {

    it("Should add edges and query for adjacent nodes.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 1);
      assert.equal(graph.adjacent("a")[0], "b");
    });

    it("Should remove edges.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 0);
    });

  });


  describe("Edge cases and error handling", function() {

    it("Should return empty array of adjacent nodes for unknown nodes.", function (){
      var graph = Graph();
      assert(graph.adjacent("a").length === 0);
    });

  });
});
