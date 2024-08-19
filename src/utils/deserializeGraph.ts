import { Graph } from '../Graph.js';
import { NoInfer, SerializedInput } from '../types.js';

export function deserializeGraph<Node, LinkProps, NodeIdentity>(
  ...args: Node extends object
    ? [
        data: SerializedInput<Node, LinkProps>,
        identityFn: (node: NoInfer<Node>) => NodeIdentity,
      ]
    : [data: SerializedInput<Node, LinkProps>]
): Graph<Node, LinkProps> {
  const [data, identityFn] = args;

  const g = new Graph<Node, LinkProps>();

  const nodeIdentityMap = new Map<NodeIdentity, Node>();

  data.nodes.forEach((node) => {
    g.addNode(node);

    if (identityFn) {
      nodeIdentityMap.set(identityFn(node), node);
    }
  });

  data.links.forEach((link) => {
    if (!identityFn) {
      g.addEdge.apply(g, [link.source, link.target, link.weight, link.props] as never);
      return;
    }

    const source = nodeIdentityMap.get(identityFn(link.source)) ?? link.source;
    const target = nodeIdentityMap.get(identityFn(link.target)) ?? link.target;

    g.addEdge.apply(g, [source, target, link.weight, link.props] as never);
  });

  return g;
}
