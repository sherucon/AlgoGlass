export type Coordinate = {
  row: number;
  col: number;
};

export type NodeType = 
  | 'empty' 
  | 'wall' 
  | 'start' 
  | 'target' 
  | 'visited' 
  | 'path' 
  | 'frontier' 
  | 'current';

export interface Cell {
  row: number;
  col: number;
  type: NodeType;
  isVisited: boolean;  // Kept separate from type for easier state management
  isWall: boolean;
  isPath: boolean;
  distance: number;
  parent: Coordinate | null;
  // A* specific
  f: number;
  g: number;
  h: number;
}

export interface SimulationSnapshot {
  gridState: Cell[][];
  structureState: any[]; // Can be nodes, or objects with more info
  currentNode: Cell | null;
  logMessage: string;
}

export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export type SpeedType = 'slow' | 'normal' | 'fast' | 'instant';
