import type { Graph } from '../../Graph.js';
import type { NoInfer } from '../../types.js';

export type DepthFirstSearchOptions<Node, LinkProps> = {
  /**
   * Use those nodes as source nodes.
   * @default all the nodes in the graph are used as source nodes.
   */
  sourceNodes?: Node[];

  /**
   * Include or exclude the source nodes from the result.
   * @default true
   */
  includeSourceNodes?: boolean;

  /**
   * Throw an error when a cycle is detected.
   * @default false
   */
  errorOnCycle?: boolean;

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
