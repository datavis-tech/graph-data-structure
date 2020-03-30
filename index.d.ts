declare type NodeId = string;
declare type EdgeWeight = number;
interface Serialized {
    nodes: {
        id: NodeId;
    }[];
    links: {
        source: NodeId;
        target: NodeId;
        weight: EdgeWeight;
    }[];
}
declare function Graph(serialized?: Serialized): {
    addNode: (node: string) => any;
    removeNode: (node: string) => any;
    nodes: () => string[];
    adjacent: (node: string) => string[];
    addEdge: (u: string, v: string, weight: number) => any;
    removeEdge: (u: string, v: string) => any;
    setEdgeWeight: (u: string, v: string, weight: number) => any;
    getEdgeWeight: (u: string, v: string) => number;
    indegree: (node: string) => number;
    outdegree: (node: string) => number;
    depthFirstSearch: (sourceNodes?: string[] | undefined, includeSourceNodes?: boolean) => string[];
    lowestCommonAncestors: (node1: string, node2: string) => string[];
    topologicalSort: (sourceNodes: string[], includeSourceNodes?: boolean) => string[];
    shortestPath: (source: string, destination: string) => string[] & {
        weight?: number | undefined;
    };
    serialize: () => Serialized;
    deserialize: (serialized: Serialized) => any;
};
export = Graph;
