
// Unit tests for reactive-property.
var assert = require("assert");

// If using from the NPM package, this line would be
// var Graph = require("graph-data-structure");
var Graph = require("./index.js");

describe("Graph", function() {

  describe("Data Structure", function() {
    it("Should add edges and query for adjacent nodes.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      assert(graph.adjacent("a").length === 1);
      assert(graph.adjacent("a")[0] === "b");
    });
  });

});
