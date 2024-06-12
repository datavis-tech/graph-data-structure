export type EdgeWeight = number;

export type Edge<Node, Props> = {
  source: Node;
  target: Node;
  weight: EdgeWeight;
  props: Props;
}

export type Serialized<Node, Link extends Edge<Node, unknown>> = {
  nodes: Node[];
  links: Link[];
}

export type SerializedInput<Node, Link extends Edge<Node, unknown>> = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<Link>;
}