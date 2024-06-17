import { Graph } from '../Graph.js';
import { NoInfer } from '../types.js';

export function outdegree<Node>(graph: Graph<Node>, node: NoInfer<Node>): number {
  return graph.edges.get(node)?.size ?? 0;
}
