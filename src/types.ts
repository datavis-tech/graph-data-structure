import { Graph } from './Graph.js';

export type EdgeWeight = number;

export type Edge<NodeIdentity = unknown, Props = unknown> = {
  source: NodeIdentity;
  target: NodeIdentity;
  weight?: EdgeWeight;
  props: Props;
};

export type Serialized<Node = unknown, LinkProps = unknown, NodeIdentity = Node> = {
  nodes: Node[];
  links: Edge<NodeIdentity, LinkProps>[];
};

export type SerializedInput<Node = unknown, LinkProps = unknown> = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<Edge<Node, LinkProps>>;
};

export type NoInfer<T> = [T][T extends any ? 0 : never];

export type NextWeightFnParams<Node = unknown, LinkProps = unknown> = {
  edgeWeight: EdgeWeight;
  currentPathWeight: EdgeWeight | undefined;
  hop: number;
  graph: Graph<Node, LinkProps>;
  path: readonly [NoInfer<Node>, NoInfer<Node>, ...NoInfer<Node>[]];
  previousNode: NoInfer<Node> | undefined;
  currentNode: NoInfer<Node>;
  props: LinkProps;
};
