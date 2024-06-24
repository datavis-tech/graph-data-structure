import { invariant } from '../../invariant.js';
import type { NoInfer } from '../../types.js';
import type { DepthFirstSearchOptions } from './types.js';

import { Graph } from '../../Graph.js';
import { depthFirstVisit } from './depthFirstVisit.js';

/**
 * Depth First Search algorithm, inspired by
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
 */
export function depthFirstSearch<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  opts: DepthFirstSearchOptions<NoInfer<Node>, NoInfer<LinkProps>> = {},
): Node[] {
  const { sourceNodes = Array.from(graph.nodes), includeSourceNodes = true } = opts;

  const visited: Set<Node> = new Set();
  const visiting: Set<Node> = new Set();
  const nodeList: Node[] = [];

  if (includeSourceNodes) {
    for (let i = 0; i < sourceNodes.length; i++) {
      const sourceNode = sourceNodes[i];
      if (!sourceNode) continue;
      depthFirstVisit(graph, nodeList, visited, visiting, sourceNode, opts);
    }
    return nodeList;
  }

  for (let i = 0; i < sourceNodes.length; i++) {
    const sourceNode = sourceNodes[i];
    if (!sourceNode) continue;
    visited.add(sourceNode);
  }

  for (let i = 0; i < sourceNodes.length; i++) {
    const sourceNode = sourceNodes[i];
    if (!sourceNode) continue;

    graph
      .adjacent(sourceNode)
      ?.forEach((n) => depthFirstVisit(graph, nodeList, visited, visiting, n, opts));
  }

  return nodeList;
}
