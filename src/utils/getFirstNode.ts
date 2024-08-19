import { Graph } from '../Graph.js';
import { NoInfer } from '../types.js';

/**
 * Return the first node matching your function and throws if none is found.
 */
export function getFirstNode<Node>(
  graph: Graph<Node, any>,
  fn: (node: NoInfer<Node>) => boolean,
): Node {
  for (const node of graph.nodes) {
    if (fn(node)) {
      return node;
    }
  }

  throw new Error('Node not found.');
}
