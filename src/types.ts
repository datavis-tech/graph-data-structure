export type EdgeWeight = number;

export type Edge<Node = unknown, Props = unknown> = {
  source: Node;
  target: Node;
  weight?: EdgeWeight;
  props: Props;
};

export type Serialized<Node = unknown, LinkProps = unknown> = {
  nodes: Node[];
  links: Edge<Node, LinkProps>[];
};

export type SerializedInput<Node = unknown, LinkProps = unknown> = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<Edge<Node, LinkProps>>;
};

export type NoInfer<T> = [T][T extends any ? 0 : never];
