/**
 * Serializes the graph.
 */
import { Graph } from '../Graph.js';
import { NoInfer, Edge, Serialized } from '../types.js';

type SerializeGraphOptions<IncludeDefaultWeight extends boolean = false> = {
  /**
   * If no weight is set on an edge, the default weight is `1`.
   * When `includeDefaultWeight: true`, the serialization will include the edge's weight even when none is set or
   * the value has been set to `1`.
   *
   * @default false
   */
  includeDefaultWeight?: IncludeDefaultWeight;
};

/**
 * Serialize the graph data set : nodes, edges, edges weight & properties.
 *
 * Optionally, you can pass a function that returns a unique value for a given node.
 * When provided, the function will be used to avoid data duplication in the serialized object.
 */
export function serializeGraph<
  Node,
  LinkProps,
  IncludeDefaultWeight extends boolean,
  NodeIdentity = Node,
>(
  graph: Graph<Node, LinkProps>,
  ...args:
    | [
        identityFn: (node: NoInfer<Node>) => NodeIdentity,
        SerializeGraphOptions<IncludeDefaultWeight>?,
      ]
    | [SerializeGraphOptions<IncludeDefaultWeight>?]
): Serialized<Node, LinkProps, NodeIdentity> {
  const identityFn = typeof args[0] === 'function' ? args[0] : undefined;
  const opts = typeof args[0] === 'function' ? args[1] : args[0];

  const { includeDefaultWeight = false } = opts ?? {};

  const serialized: Serialized<Node, LinkProps, NodeIdentity> = {
    nodes: Array.from(graph.nodes),
    links: [],
  };

  const nodeIdentityMap = new Map<Node, NodeIdentity>();

  serialized.nodes.forEach((node) => {
    const source = node;
    graph.adjacent(source)?.forEach((target) => {
      const edgeWeight = graph.getEdgeWeight(source, target);
      const edgeProps = graph.getEdgeProperties(source, target);

      if (identityFn && !nodeIdentityMap.has(source)) {
        nodeIdentityMap.set(source, identityFn(source));
      }

      if (identityFn && !nodeIdentityMap.has(target)) {
        nodeIdentityMap.set(target, identityFn(target));
      }

      const sourceIdentity = nodeIdentityMap.get(source) ?? source;
      const targetIdentity = nodeIdentityMap.get(target) ?? target;

      const link = {
        source: sourceIdentity,
        target: targetIdentity,
      } as Edge<NodeIdentity, LinkProps>;

      if (edgeWeight != 1 || includeDefaultWeight) {
        link.weight = edgeWeight;
      }

      if (edgeProps) {
        link.props = edgeProps;
      }

      serialized.links.push(link);
    });
  });

  return serialized;
}
