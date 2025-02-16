import type { EdgeWeight, NoInfer } from '../../types.js';
import type { TraversingTracks } from './types.js';

import { Graph } from '../../Graph.js';

export function addWeightFunction(edgeWeight: number, currentPathWeight: number | undefined, hop: number): number {
  if (currentPathWeight === undefined) {
      return edgeWeight;
  }
  return edgeWeight + currentPathWeight;
}

/**
 * Assembles the shortest path by traversing the
 * predecessor subgraph from destination to source.
 */
export function getPath<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
  weightFunction: (edgeWeight: number, currentPathWeight: number, hop: number) => number = addWeightFunction
): {
  nodes: [Node, Node, ...Node[]];
  weight: number;
} {
  const { p } = tracks;
  const nodeList: Node[] & { weight?: EdgeWeight } = [];

  let totalWeight = undefined as unknown as EdgeWeight;
  let node = destination;

  let hop = 1;
  while (p.has(node)) {
    const currentNode = p.get(node)!;

    nodeList.push(node);
    totalWeight = weightFunction(graph.getEdgeWeight(currentNode, node), totalWeight, hop);
    node = currentNode;
    hop++;
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
