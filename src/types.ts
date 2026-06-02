export interface Point {
  x: number;
  y: number;
}

export interface GraphNode extends Point {
  id: string;
  label?: string;
  isOdd?: boolean;
}

export interface GraphEdge {
  id: string;
  n1: string; // id of node 1
  n2: string; // id of node 2
  curveOffset?: number; // For drawing multiple edges between same nodes
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GameState {
  currentNode: string | null;
  visitedEdges: string[];
}
