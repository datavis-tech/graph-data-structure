import { CycleError } from "./CycleError.js";
import { invariant } from "./invariant.js";
import { Edge, EdgeWeight, Serialized, SerializedInput } from "./types.js";

export class Graph<Node = string, LinkProps = unknown, Link extends Edge<Node, LinkProps> = Edge<Node, LinkProps>> {

  /**
   * The adjacency list of the graph.
   */
  edges: Map<Node, Set<Node>> = new Map();

  /**
   * The weights of edges.
   *
   * Map<SourceNode, Map<TargetNode, EdgeWeight>>
   */
  edgeWeights: Map<Node, Map<Node, EdgeWeight>> = new Map();

  /**
   * Arbitrary properties of edges.
   * Map<SourceNode, Map<TargetNode, EdgeProperties>>
   */
  edgeProperties: Map<Node, Map<Node, LinkProps>> = new Map();

  constructor(serialized?: SerializedInput<Node, LinkProps, Link>) {
    if (serialized) {
      this.deserialize(serialized);
    }
  }

  public static deserialize<Node, Link extends Edge<Node, Props>, Props>(data: SerializedInput<Node, Props, Link>): Graph<Node, Props, Link> {
    const g = new Graph<Node, Props, Link>();
    return g.deserialize(data);
  };

  public deserialize(data: SerializedInput<Node, LinkProps, Link>): this {
    data.nodes.forEach((node) => {
      this.addNode(node);
    });

    data.links.forEach((link) => {
      this.addEdge(link.source, link.target, link.weight);
    });

    return this;
  }

  /**
   * Adds a node to the graph.
   * If node was already added, this function does nothing.
   * If node was not already added, this function sets up an empty adjacency list.
   */
  addNode(node: Node): this {
    if (!this.edges.has(node)) {
      this.edges.set(node, new Set());
    }

    return this;
  }

  /**
   * Removes a node from the graph.
   * Also removes incoming and outgoing edges.
   */
  removeNode(node: Node): this {
    // Remove outgoing edges (and signal that the node no longer exists).
    this.edges.delete(node);

    // Remove ingoing edges
    for (const adjacentNodes of this.edges.values()) {
      adjacentNodes.delete(node);
    }

    return this;
  }

  /**
   * Gets the list of nodes that have been added to the graph.
   */
  nodes(): Node[] {
    const nodes: Set<Node> = new Set();

    for (const edgeKey of this.edges.keys()) {

      nodes.add(edgeKey);

      const adjacentNodes = this.edges.get(edgeKey)?.values();
      if (!adjacentNodes) {
        throw new Error(`Missing adjacent set for node ${edgeKey}`)
      }

      for (const adjacentNode of adjacentNodes) {
        nodes.add(adjacentNode);
      }
    }

    return Array.from(nodes);
  }

  /**
   * Gets the adjacent node list for the given node.
   * @returns an empty set for unknown nodes.
   * @param node
   */
  adjacent(node: Node): Set<Node> | undefined {
    return this.edges.get(node);
  }

  /**
   * Sets the weight of the given edge.
   */
  setEdgeWeight(source: Node, target: Node, weight: EdgeWeight): this {
    if (!this.edgeWeights.has(source)) {
      this.edgeWeights.set(source, new Map());
    }

    const weights = this.edgeWeights.get(source);
    invariant(weights);

    weights.set(target, weight);

    return this;
  }

  /**
   * Gets the weight of the given edge.
   * Returns 1 if no weight was previously set.
   */
  getEdgeWeight(source: Node, target: Node): EdgeWeight {
    return this.edgeWeights.get(source)?.get(target) ?? 1;
  }


  /**
   * Set the properties of the given edge.
   */
  setEdgeProperties(source: Node, target: Node, props: LinkProps): this {
    if (!this.edgeProperties.has(source)) {
      this.edgeProperties.set(source, new Map());
    }

    const propsHolder = this.edgeProperties.get(source);
    invariant(propsHolder);

    propsHolder.set(target, props);

    return this;
  }

  /**
   * Get the properties of the given edge or undefined if none are set.
   */
  getEdgeProperties(source: Node, target: Node): LinkProps {
    return this.edgeProperties.get(source)?.get(target) as LinkProps;
  }

  /**
   * Adds an edge from the `source` node to `target` node.
   * This method will create the nodes if they were not already added.
   */
  addEdge(source: Node, target: Node, weight?: EdgeWeight): this {
    this.addNode(source);
    this.addNode(target);
    const adjacentNodes = this.adjacent(source);

    invariant(adjacentNodes);

    adjacentNodes.add(target);

    if (weight !== undefined) {
      this.setEdgeWeight(source, target, weight);
    }

    return this;
  }

  /**
   * Removes the edge from the `source` node to `target` node.
   * Does not remove the nodes themselves.
   * Does nothing if the edge does not exist.
   */
  removeEdge(source: Node, target: Node): this {
    this.edges.get(source)?.delete(target);

    return this;
  }

  /**
   * Returns true if there is an edge from the `source` node to `target` node..
   */
  hasEdge(source: Node, target: Node): boolean {
    return this.edges.get(source)?.has(target) ?? false;
  }

  /**
   * Computes the indegree for the given node.
   * Not very efficient, costs O(E) where E = number of edges.
   */
  indegree(node: Node): number {
    let degree = 0;

    for (const adjacentNodes of this.edges.values()) {
      for (let adjacentNode of adjacentNodes) {
        if (adjacentNode === node) {
          degree++;
        }
      }
    }

    return degree;
  }

  outdegree(node: Node): number {
    return this.edges.get(node)?.size ?? 0;
  }

  /**
   * Depth First Search algorithm, inspired by
   * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
   * The additional option `includeSourceNodes` specifies whether to
   * include or exclude the source nodes from the result (true by default).
   * If `sourceNodes` is not specified, all nodes in the graph
   * are used as source nodes.
   *
   * @param sourceNodes
   * @param includeSourceNodes
   * @param errorOnCycle
   */
  depthFirstSearch(
    sourceNodes?: Node[],
    includeSourceNodes = true,
    errorOnCycle = false,
  ) {
    if (!sourceNodes) {
      sourceNodes = this.nodes();
    }

    const visited: Set<Node> = new Set();
    const visiting: Set<Node> = new Set();
    const nodeList: Node[] = [];

    const DFSVisit = (node: Node) => {
      if (visiting.has(node) && errorOnCycle) {
        throw new CycleError("Cycle found");
      }
      if (!visited.has(node)) {
        visited.add(node);
        visiting.add(node);

        this.adjacent(node)?.forEach(DFSVisit);

        visiting.delete(node);
        nodeList.push(node);
      }
    }

    if (includeSourceNodes) {
      sourceNodes.forEach(DFSVisit);
    } else {
      sourceNodes.forEach((node) => {
        visited.add(node);
      });
      sourceNodes.forEach((node) => {
        this.adjacent(node)?.forEach(DFSVisit);
      });
    }

    return nodeList;
  }

  /**
   * Returns true if the graph has one or more cycles and false otherwise.
   */
  hasCycle(): boolean {
    try {
      this.depthFirstSearch(undefined, true, true);
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

  /**
   * Least Common Ancestors
   * Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
   * but uses depth search instead of breadth. Also uses some optimizations.
   */
  lowestCommonAncestors(node1: Node, node2: Node) {
    const node1Ancestors: Node[] = [];
    const lcas: Node[] = [];

    const CA1Visit = (visited: Set<Node>, node: Node): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        node1Ancestors.push(node);
        if (node == node2) {
          lcas.push(node);
          return false; // found - shortcut
        }
        return Array.from(this.adjacent(node) ?? []).every((node) => {
          return CA1Visit(visited, node);
        });
      } else {
        return true;
      }
    }

    const CA2Visit = (visited: Set<Node>, node: Node): void => {
      if (!visited.has(node)) {
        visited.add(node);
        if (node1Ancestors.indexOf(node) >= 0) {
          lcas.push(node);
        } else if (lcas.length == 0) {
          this.adjacent(node)?.forEach((node) => {
            CA2Visit(visited, node);
          });
        }
      }
    }

    if (CA1Visit(new Set<Node>(), node1)) {
      // No shortcut worked
      CA2Visit(new Set<Node>(), node2);
    }

    return lcas;
  }

  /**
   * The topological sort algorithm yields a list of visited nodes
   * such that for each visited edge (u, v), u comes before v in the list.
   * Amazingly, this comes from just reversing the result from depth first search.
   * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
   */
  topologicalSort(
    sourceNodes?: Node[],
    includeSourceNodes = true,
  ) {
    return this.depthFirstSearch(sourceNodes, includeSourceNodes, true).reverse();
  }

  /**
   * Dijkstra's Shortest Path Algorithm.
   * Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
   * Variable and function names correspond to names in the book.
   */
  shortestPath(source: Node, destination: Node) {
    // Upper bounds for shortest path weights from source.
    const d: Map<Node, EdgeWeight> = new Map();

    // Predecessors.
    const p: Map<Node, Node> = new Map();

    // Poor man's priority queue, keyed on d.
    let q: Set<Node> = new Set();

    this.dijkstra(d, p, q, source, destination);
    return this.path(d, p, q, source, destination);
  }

  /**
   * Linear search to extract (find and remove) min from q.
   */
  protected extractMin(d: Map<Node, EdgeWeight>, p: Map<Node, Node>, q: Set<Node>): Node | null {
    let min = Infinity;
    let minNode;

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

  dijkstra(d: Map<Node, EdgeWeight>, p: Map<Node, Node>, q: Set<Node>, source: Node, destination: Node) {
    const nodes = this.nodes();

    const initializeSingleSource = () => {
      nodes.forEach((node) => {
        d.set(node, Infinity);
      });

      if (d.get(source) !== Infinity) {
        throw new Error("Source node is not in the graph");
      }

      if (d.get(destination) !== Infinity) {
        throw new Error("Destination node is not in the graph");
      }

      d.set(source, 0);
    }

    // Adds entries in q for all nodes.
    const initializePriorityQueue = () => {
      nodes.forEach((node) => {
        q.add(node);
      });
    }

    initializeSingleSource();
    initializePriorityQueue();

    while (q.size !== 0) {
      const u = this.extractMin(d, p, q);
      if (u === null) return;
      this.adjacent(u)?.forEach((v) => {
        this.relax(d, p, q, u, v);
      });
    }
  }

  /**
   * Assembles the shortest path by traversing the
   * predecessor subgraph from destination to source.
   */
  protected path(d: Map<Node, EdgeWeight>, p: Map<Node, Node>, q: Set<Node>, source: Node, destination: Node) {
    const nodeList: Node[] & { weight?: EdgeWeight } = [];
    let weight = 0;
    let node = destination;

    while (p.has(node)) {
      nodeList.push(node);
      weight += this.getEdgeWeight(p.get(node)!, node);
      node = p.get(node)!;
    }
    if (node !== source) {
      throw new Error("No path found");
    }
    nodeList.push(node);
    nodeList.reverse();
    nodeList.weight = weight;
    return nodeList;
  }

  protected relax(d: Map<Node, EdgeWeight>, p: Map<Node, Node>, q: Set<Node>, source: Node, target: Node) {
    const edgeWeight = this.getEdgeWeight(source, target);
    const distanceSource = d.get(source);
    const distanceTarget = d.get(target);

    invariant(distanceSource, 'Missing source distance');
    invariant(distanceTarget, 'Missing target distance');

    if (distanceTarget > (distanceSource + edgeWeight)) {
      d.set(target, distanceSource + edgeWeight);
      p.set(target, source);
    }
  }

  shortestPaths(source: Node, destination: Node) {
    let path = this.shortestPath(source, destination);
    const paths = [path],
      removedEdges: { u: Node; v: Node; weight: EdgeWeight }[] = [],
      weight = path.weight;
    while (weight) {
      const u = path[0];
      const v = path[1];

      if (this.hasEdge(u, v)) {
        removedEdges.push({ u, v, weight: this.getEdgeWeight(u, v) });
        this.removeEdge(u, v);
      }

      if (this.hasEdge(v, u)) {
        removedEdges.push({ u: v, v: u, weight: this.getEdgeWeight(v, u) });
        this.removeEdge(v, u);
      }

      try {
        path = this.shortestPath(source, destination);
        if (!path.weight || weight < path.weight) break;
        paths.push(path);
      } catch (e) {
        break;
      }
    }
    for (const { u, v, weight } of removedEdges) this.addEdge(u, v, weight);
    return paths;
  }

  /**
   * Serializes the graph.
   */
  serialize(): Serialized<Node, LinkProps, Link> {
    const serialized: Serialized<Node, LinkProps, Link> = {
      nodes: this.nodes(),
      links: [],
    };

    serialized.nodes.forEach((node) => {
      const source = node;
      this.adjacent(source)?.forEach((target) => {
        const edgeWeight = this.getEdgeWeight(source, target);

        serialized.links.push({
          source: source,
          target: target,
          weight: edgeWeight,
          props: this.getEdgeProperties(source, target),
        } as Link);
      });
    });

    return serialized;
  }
}