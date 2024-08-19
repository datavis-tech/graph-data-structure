/**
 * Serializes the graph.
 */
import { Graph } from '../Graph.js';
import { Edge, Serialized } from '../types.js';

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
 * @param graph
 * @param opts
 */
export function serializeGraph<Node, LinkProps, IncludeDefaultWeight extends boolean>(
  graph: Graph<Node, LinkProps>,
  opts: SerializeGraphOptions<IncludeDefaultWeight> = {},
): Serialized<Node, LinkProps> {
  const { includeDefaultWeight = false } = opts;

  const serialized: Serialized<Node, LinkProps> = {
    nodes: Array.from(graph.nodes),
    links: [],
  };

  serialized.nodes.forEach((node) => {
    const source = node;
    graph.adjacent(source)?.forEach((target) => {
      const edgeWeight = graph.getEdgeWeight(source, target);
      const edgeProps = graph.getEdgeProperties(source, target);

      const link = {
        source: source,
        target: target,
      } as Edge<Node, LinkProps>;

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
