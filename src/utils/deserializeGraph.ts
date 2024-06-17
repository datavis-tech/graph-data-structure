import { Graph } from '../Graph.js';
import { SerializedInput } from '../types.js';

export function deserializeGraph<Node, LinkProps>(
  data: SerializedInput<Node, LinkProps>,
): Graph<Node, LinkProps> {
  const g = new Graph<Node, LinkProps>();

  data.nodes.forEach((node) => {
    g.addNode(node);
  });

  data.links.forEach((link) => {
    g.addEdge.apply(g, [link.source, link.target, link.weight, link.props] as never);
  });

  return g;
}
