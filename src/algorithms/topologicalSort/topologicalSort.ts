/**
 * The topological sort algorithm yields a list of visited nodes
 * such that for each visited edge (u, v), u comes before v in the list.
 * Amazingly, this comes from just reversing the result from depth first search.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
 */
import { Graph } from '../../Graph.js';
import { NoInfer } from '../../types.js';
import { depthFirstSearch } from '../depthFirstSearch/index.js';

export type TopologicalSortOptions<Node, LinkProps> = {
  /**
   * Run the first on those nodes.
   * @default all the nodes of the graph.
   */
  sourceNodes?: Node[];

  /**
   * Include the source nodes from the result.
   * @default true
   */
  includeSourceNodes?: boolean;

  /**
   * A function that is executed to determine if the branch should be visited or not.
   * @param source the current node
   * @param target the next node to explore
   * @param graph the graph instance being explored
   * @returns boolean
   */
  shouldFollow?: (args: {
    source: NoInfer<Node>;
    target: NoInfer<Node>;
    graph: Graph<Node, LinkProps>;
  }) => boolean;
};

export function topologicalSort<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  opts: TopologicalSortOptions<NoInfer<Node>, NoInfer<LinkProps>> = {},
) {
  return depthFirstSearch(graph, {
    ...opts,
    errorOnCycle: true,
  }).reverse();
}
