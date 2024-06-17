export type EdgeWeight = number;

export type Edge<Node, Props = unknown> = {
  source: Node;
  target: Node;
  weight?: EdgeWeight;
  props: Props;
};

export type Serialized<Node, LinkProps = unknown> = {
  nodes: Node[];
  links: Edge<Node, LinkProps>[];
};

export type SerializedInput<Node, LinkProps = unknown> = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<Edge<Node, LinkProps>>;
};

export type NoInfer<T> = [T][T extends any ? 0 : never];
