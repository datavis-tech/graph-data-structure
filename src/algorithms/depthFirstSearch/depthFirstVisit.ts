import { CycleError } from '../../CycleError.js';
import { Graph } from '../../Graph.js';
import { Edge, NoInfer } from '../../types.js';
import { DepthFirstSearchOptions } from './types.js';

export function depthFirstVisit<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  nodeList: NoInfer<Node>[],
  visited: Set<NoInfer<Node>>,
  visiting: Set<NoInfer<Node>>,
  node: NoInfer<Node>,
  opts: Pick<DepthFirstSearchOptions<Node, LinkProps>, 'errorOnCycle' | 'visit'>,
) {
  const { errorOnCycle = false, visit } = opts;

  if (visiting.has(node) && errorOnCycle) {
    throw new CycleError('Cycle found');
  }

  if (!visited.has(node)) {
    visited.add(node);
    visiting.add(node);

    graph.adjacent(node)?.forEach((n) => {
      // TODO
      // const shouldVisit = visit === undefined || (visit && visit(node, n, graph));
      // if (!shouldVisit) return;

      depthFirstVisit(graph, nodeList, visited, visiting, n, opts);
    });

    visiting.delete(node);
    nodeList.push(node);
  }
}
