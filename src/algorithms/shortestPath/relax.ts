import { Graph } from '../../Graph.js';
import { invariant } from '../../invariant.js';
import { NoInfer } from '../../types.js';
import { TraversingTracks } from './types.js';

export function relax<Node>(
  graph: Graph<Node, any>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  target: NoInfer<Node>,
) {
  const { d, p } = tracks;

  const edgeWeight = graph.getEdgeWeight(source, target);

  const distanceSource = d.get(source);
  const distanceTarget = d.get(target);

  invariant(distanceSource, 'Missing source distance');
  invariant(distanceTarget, 'Missing target distance');

  if (distanceTarget > distanceSource + edgeWeight) {
    d.set(target, distanceSource + edgeWeight);
    p.set(target, source);
  }
}
