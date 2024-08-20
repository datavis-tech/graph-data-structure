import { invariant } from './invariant.js';
import { EdgeWeight } from './types.js';

export class Graph<Node = string, LinkProps = never> {
  /**
   * Contains all the nodes added to the graph.
   */
  nodes: Set<Node> = new Set();

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

  /**
   * Adds a node to the graph.
   * If node was already added, this function does nothing.
   * If node was not already added, this function sets up an empty adjacency list.
   */
  addNode(node: Node): this {
    if (!this.nodes.has(node)) {
      this.nodes.add(node);
    }

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
    this.nodes.delete(node);

    // Remove ingoing edges
    for (const adjacentNodes of this.edges.values()) {
      adjacentNodes.delete(node);
    }

    return this;
  }

  /**
   * Gets the adjacent nodes set for the given node.
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
   * Gets the weight of the given edge or `1` if not set.
   */
  getEdgeWeight(source: Node, target: Node): number {
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
  addEdge(source: Node, target: Node, ...args: AddEdgeArgs<LinkProps>): this {
    let weight: number | undefined;
    let linkProps: LinkProps | undefined;

    const firstArg = args[0];

    if (typeof firstArg === 'number') {
      weight = firstArg;
    }

    if (typeof firstArg === 'object') {
      weight = firstArg.weight;

      if (firstArg)
        linkProps = Object.prototype.hasOwnProperty.call(firstArg, 'props')
          ? (firstArg as { props: LinkProps }).props
          : undefined;
    }

    this.addNode(source);
    this.addNode(target);
    const adjacentNodes = this.adjacent(source);

    invariant(adjacentNodes);

    adjacentNodes.add(target);

    if (weight !== undefined) {
      this.setEdgeWeight(source, target, weight);
    }

    if (linkProps !== undefined) {
      this.setEdgeProperties(source, target, linkProps);
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
    this.edgeProperties.get(source)?.delete(target);

    return this;
  }

  /**
   * Returns true if there is an edge from the `source` node to `target` node..
   */
  hasEdge(source: Node, target: Node): boolean {
    return this.edges.get(source)?.has(target) ?? false;
  }
}

type AddEdgeArgs<LinkProps> = [LinkProps] extends [never]
  ? [weight?: EdgeWeight] | [opts?: { weight?: EdgeWeight }]
  : [opts: { weight?: EdgeWeight; props: LinkProps }];
