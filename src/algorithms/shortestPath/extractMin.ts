import { TraversingTracks } from './types.js';

/**
 * Remove the node with the minimum weight from the priority queue.
 *
 * Performs linear search.
 */
export function extractMin<Node>(tracks: TraversingTracks<Node>): Node | null {
  let min = Infinity;
  let minNode;
  const { d, q } = tracks;

  q.forEach((node) => {
    const nodeWeight = d.get(node) ?? Infinity;

    if (nodeWeight < min) {
      min = nodeWeight;
      minNode = node;
    }
  });

  if (minNode === undefined) {
    // If we reach here, there's a disconnected subgraph, and we're done.
    q.clear();
    return null;
  }

  q.delete(minNode);
  return minNode;
}
