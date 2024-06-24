import { Graph } from '../Graph.js';
import { NoInfer } from '../types.js';

/**
 * Return the node matching your function. Throws if none is found or if more than one node if found.
 */
export function getNode<Node>(
  graph: Graph<Node, any>,
  fn: (node: NoInfer<Node>) => boolean,
): Node {
  const foundNodes: Node[] = [];

  for (const node of graph.nodes) {
    if (fn(node)) {
      foundNodes.push(node);
    }
  }

  if (foundNodes.length === 0) {
    throw new Error('Node not found.');
  }

  if (foundNodes.length > 1) {
    throw new Error('More than one node found.');
  }

  return foundNodes[0] as Node;
}
