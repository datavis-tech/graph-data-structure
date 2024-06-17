import { Graph } from '../Graph.js';
import { NoInfer } from '../types.js';

/**
 * Computes the indegree for the given node.
 * Not very efficient, costs O(E) where E = number of edges.
 */
export function indegree<Node>(graph: Graph<Node>, node: NoInfer<Node>): number {
  let degree = 0;

  for (const adjacentNodes of graph.edges.values()) {
    for (let adjacentNode of adjacentNodes) {
      if (adjacentNode === node) {
        degree++;
      }
    }
  }

  return degree;
}
