import type { EdgeWeight, NoInfer } from '../../types.js';
import type { TraversingTracks } from './types.js';

import { Graph } from '../../Graph.js';

/**
 * Assembles the shortest path by traversing the
 * predecessor subgraph from destination to source.
 */
export function getPath<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
): {
  nodes: [Node, Node, ...Node[]];
  weight: number;
} {
  const { p } = tracks;
  const nodeList: Node[] & { weight?: EdgeWeight } = [];

  let totalWeight = 0;
  let node = destination;

  while (p.has(node)) {
    const currentNode = p.get(node)!;

    nodeList.push(node);
    totalWeight += graph.getEdgeWeight(currentNode, node);
    node = currentNode;
  }

  if (node !== source) {
    throw new Error('No path found');
  }

  nodeList.push(node);
  nodeList.reverse();

  return {
    nodes: nodeList as [Node, Node, ...Node[]],
    weight: totalWeight,
  };
}
