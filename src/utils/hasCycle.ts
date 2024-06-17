import { depthFirstSearch } from '../algorithms/depthFirstSearch/index.js';
import { CycleError } from '../CycleError.js';
import { Graph } from '../Graph.js';

/**
 * Perform a depth first search to detect an eventual cycle.
 */
export function hasCycle(graph: Graph): boolean {
  try {
    depthFirstSearch(graph, {
      includeSourceNodes: true,
      errorOnCycle: true,
    });
    // No error thrown -> no cycles
    return false;
  } catch (error) {
    if (error instanceof CycleError) {
      return true;
    } else {
      throw error;
    }
  }
}
