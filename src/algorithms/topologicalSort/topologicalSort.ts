/**
 * The topological sort algorithm yields a list of visited nodes
 * such that for each visited edge (u, v), u comes before v in the list.
 * Amazingly, this comes from just reversing the result from depth first search.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
 */
import { Graph } from '../../Graph.js';
import { NoInfer } from '../../types.js';
import { depthFirstSearch } from '../depthFirstSearch/index.js';

export type TopologicalSortOptions<Node> = {
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
};

export function topologicalSort<Node>(
  graph: Graph<Node>,
  opts: TopologicalSortOptions<NoInfer<Node>> = {},
) {
  return depthFirstSearch(graph, {
    ...opts,
    errorOnCycle: true,
  }).reverse();
}
