import { Graph } from '../../Graph.js';
import { NoInfer } from '../../types.js';

/**
 * Return an array containing the lowest common ancestors.
 *
 * Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
 * but uses depth search instead of breadth. Also uses some optimizations.
 */
export function lowestCommonAncestors<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  node1: NoInfer<Node>,
  node2: NoInfer<Node>,
): Node[] {
  const node1Ancestors: Node[] = [];
  const lcas: Node[] = [];
  if (CA1Visit(graph, node1Ancestors, lcas, new Set<Node>(), node1, node2)) {
    // No shortcut worked
    CA2Visit(graph, node1Ancestors, lcas, new Set<Node>(), node2);
  }

  return lcas;
}

function CA1Visit<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  node1Ancestors: Node[],
  lcas: Node[],
  visited: Set<Node>,
  node: Node,
  node2: Node,
): boolean {
  if (!visited.has(node)) {
    visited.add(node);
    node1Ancestors.push(node);
    if (node == node2) {
      lcas.push(node);
      return false; // found - shortcut
    }
    return Array.from(graph.adjacent(node) ?? []).every((node) => {
      return CA1Visit(graph, node1Ancestors, lcas, visited, node, node2);
    });
  } else {
    return true;
  }
}

function CA2Visit<Node, LinkProps>(
  graph: Graph<Node, LinkProps>,
  node1Ancestors: Node[],
  lcas: Node[],
  visited: Set<Node>,
  node: Node,
): void {
  if (!visited.has(node)) {
    visited.add(node);
    if (node1Ancestors.indexOf(node) >= 0) {
      lcas.push(node);
    } else if (lcas.length == 0) {
      graph.adjacent(node)?.forEach((node) => {
        CA2Visit(graph, node1Ancestors, lcas, visited, node);
      });
    }
  }
}
