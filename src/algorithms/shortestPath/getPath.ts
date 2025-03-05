import type { EdgeWeight, NoInfer } from '../../types.js';
import type { TraversingTracks } from './types.js';
import type { NextWeightFnParams } from '../../types.js';

import { Graph } from '../../Graph.js';
import { invariant } from '../../invariant.js';

/**
 * Computes edge weight as the sum of all the edges in the path.
 */
export function addWeightFunction(wp: NextWeightFnParams): number {
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
  nextWeightFn: (
    params: NextWeightFnParams<Node, LinkProps>,
  ) => number = addWeightFunction,
): {
  nodes: [Node, Node, ...Node[]];
  weight: number | undefined;
} {
  const { p } = tracks;
  const nodeList: Node[] = [];

  let node = destination;

  while (p.has(node)) {
    const currentNode = p.get(node)!;
    nodeList.push(node);
    node = currentNode;
  }

  if (node !== source) {
    throw new Error('No path found');
  }

  nodeList.push(node);
  nodeList.reverse();

  invariant(nodeList.length >= 2, 'The path should have a least two nodes');

  let totalWeight: EdgeWeight | undefined = undefined;

  // We start as index=1 to work on the first edge between node 0 and 1
  for (let i = 1; i < nodeList.length; i++) {
    const previousNode = nodeList[i - 1]!;
    const currentNode = nodeList[i]!;

    const edgeWeight = graph.getEdgeWeight(previousNode, currentNode);
    const edgeProps = graph.getEdgeProperties(previousNode, currentNode)!;

    totalWeight = nextWeightFn({
      edgeWeight,
      currentPathWeight: totalWeight,
      hop: i,
      graph,
      path: nodeList as [Node, Node, ...Node[]],
      previousNode,
      currentNode,
      props: edgeProps,
    });
  }

  return {
    nodes: nodeList as [Node, Node, ...Node[]],
    weight: totalWeight,
  };
}
