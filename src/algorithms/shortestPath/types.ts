import { EdgeWeight } from '../../types.js';

export type TraversingTracks<Node> = {
  /**
   * Upper bounds for shortest path weights from source.
   */
  d: Map<Node, EdgeWeight>;

  /**
   * Predecessors.
   */
  p: Map<Node, Node>;

  /**
   * Poor man's priority queue, keyed on d.
   */
  q: Set<Node>;
};
