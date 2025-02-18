import { Graph } from '../../Graph.js';
import { NoInfer } from '../../types.js';
import { dijkstra } from './dijkstra.js';
import { getPath, addWeightFunction } from './getPath.js';
import { TraversingTracks } from './types.js';
import type { WeightParams } from '../../types.js';

/**
 * Dijkstra's Shortest Path Algorithm.
 * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
 * Variable and function names correspond to names in the book.
 */
export function shortestPath<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
  nextWeightFn: (params: WeightParams) => number = addWeightFunction
): {
  nodes: [Node, Node, ...Node[]];
  weight: number | undefined;
} {
  const tracks: TraversingTracks<Node> = {
    d: new Map(),
    p: new Map(),
    q: new Set(),
  };

  dijkstra(graph, tracks, source, destination);

  return getPath(graph, tracks, source, destination, nextWeightFn);
}
