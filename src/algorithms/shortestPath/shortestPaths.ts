import type { NoInfer } from '../../types.js';

import { Graph } from '../../Graph.js';
import { shortestPath } from './shortestPath.js';

export function shortestPaths<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  source: NoInfer<Node>,
  destination: NoInfer<Node>,
) {
  let path = shortestPath(graph, source, destination);

  const paths = [path];
  const pathWeight = path.weight;

  const removedEdges: Array<{ u: Node; v: Node; weight: number; props: LinkProps }> = [];

  while (path.weight) {
    const u = path.nodes[0];
    const v = path.nodes[1];

    if (graph.hasEdge(u, v)) {
      removedEdges.push({
        u,
        v,
        weight: graph.getEdgeWeight(u, v),
        props: graph.getEdgeProperties(u, v),
      });
      graph.removeEdge(u, v);
    }

    if (graph.hasEdge(v, u)) {
      removedEdges.push({
        u: v,
        v: u,
        weight: graph.getEdgeWeight(v, u),
        props: graph.getEdgeProperties(u, v),
      });
      graph.removeEdge(v, u);
    }

    try {
      path = shortestPath(graph, source, destination);
      if (!path.weight || pathWeight < path.weight) break;
      paths.push(path);
    } catch (e) {
      break;
    }
  }

  for (const { u, v, weight, props } of removedEdges) {
    graph.addEdge(u, v, ...([weight, props] as never));
  }

  return paths;
}
