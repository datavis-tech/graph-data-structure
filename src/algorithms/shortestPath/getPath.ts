import type { EdgeWeight, NoInfer } from '../../types.js';
import type { TraversingTracks } from './types.js';
import type { NextWeightFnParams } from '../../types.js';

import { Graph } from '../../Graph.js';

/**
 * Computes edge weight as the sum of all the edges in the path.
 */
export function addWeightFunction( wp: NextWeightFnParams): number {
  if (wp.currentPathWeight === undefined) {
      return wp.edgeWeight;
  }
  return wp.edgeWeight + wp.currentPathWeight;
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
  nextWeightFn: (params: NextWeightFnParams) => number = addWeightFunction
): {
  nodes: [Node, Node, ...Node[]];
  weight: number | undefined;
} {
  const { p } = tracks;
  const nodeList: Node[] & { weight?: EdgeWeight } = [];

  let totalWeight : EdgeWeight | undefined = undefined;
  let node = destination;

  let hop = 1;
  while (p.has(node)) {
    const currentNode = p.get(node)!;

    nodeList.push(node);
    const edgeWeight = graph.getEdgeWeight(currentNode, node)
    totalWeight = nextWeightFn({
        edgeWeight, currentPathWeight: totalWeight, 
        hop: hop,  graph: graph, path: tracks, 
        previousNode: node, currentNode: currentNode
    });
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
