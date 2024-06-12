export type EdgeWeight = number;

export type Edge<Node, Props = unknown> = {
  source: Node;
  target: Node;
  weight: EdgeWeight;
  props: Props;
}

export type Serialized<Node, Props = unknown, Link extends Edge<Node, Props> = Edge<Node, Props>> = {
  nodes: Node[];
  links: Link[];
}

export type SerializedInput<Node, Props = unknown, Link extends Edge<Node, Props> = Edge<Node, Props>> = {
  nodes: ReadonlyArray<Node>;
  links: ReadonlyArray<Link>;
}