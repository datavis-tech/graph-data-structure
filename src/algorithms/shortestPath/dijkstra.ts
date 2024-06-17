import { Graph } from '../../Graph.js';
import { NoInfer } from '../../types.js';
import { extractMin } from './extractMin.js';
import { relax } from './relax.js';
import { TraversingTracks } from './types.js';

export function dijkstra<Node>(
  graph: Graph<Node>,
  tracks: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
) {
  const nodes = graph.nodes();
  const { d, p, q } = tracks;

  initializeSingleSource(nodes, tracks, source, destination);
  initializePriorityQueue(nodes, tracks);

  while (q.size !== 0) {
    const u = extractMin(tracks);

    if (u === null) return;

    graph.adjacent(u)?.forEach((v) => {
      relax(graph, tracks, u, v);
    });
  }
}

function initializeSingleSource<Node>(
  nodes: Node[],
  { d }: TraversingTracks<NoInfer<Node>>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
) {
  for (const node of nodes) {
    d.set(node, Infinity);
  }

  if (d.get(source) !== Infinity) {
    throw new Error('Source node is not in the graph');
  }

  if (d.get(destination) !== Infinity) {
    throw new Error('Destination node is not in the graph');
  }

  d.set(source, 0);
}

function initializePriorityQueue<Node>(
  nodes: Node[],
  { q }: TraversingTracks<NoInfer<Node>>,
) {
  for (let i = 0; i < nodes.length; i++) {
    q.add(nodes[i]);
  }
}
