import { Graph } from '../Graph.js';

/**
 * Clone the graph data structures.
 * Nodes references are preserves.
 */
export function cloneGraph<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
): Graph<Node, LinkProps> {
  const clone = new Graph<Node, LinkProps>();

  for (let [source, targets] of graph.edges.entries()) {
    targets.forEach((target) => {
      clone.addEdge.apply(clone, [source, target] as never);

      const edgeWeight = graph.edgeWeights.get(source)?.get(target);

      if (edgeWeight) {
        clone.setEdgeWeight(source, target, edgeWeight);
      }

      const edgeProperties = graph.getEdgeProperties(source, target);

      if (edgeProperties) {
        clone.setEdgeProperties(source, target, edgeProperties);
      }
    });
  }

  return clone;
}
