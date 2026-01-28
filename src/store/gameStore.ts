import { create } from 'zustand';
import type { AlgorithmType, Cell, Coordinate, SimulationSnapshot, SpeedType } from '../types';
import { createGrid, GRID_ROWS, GRID_COLS } from '../utils/gridUtils';

import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { astar } from '../algorithms/astar';
import { dijkstra } from '../algorithms/dijkstra';

// ... existing imports

interface GameState {
  grid: Cell[][];
  startNode: Coordinate;
  targetNode: Coordinate;
  algorithm: AlgorithmType;
  isPlaying: boolean;
  isFinished: boolean;
  speed: SpeedType;
  snapshots: SimulationSnapshot[];
  currentSnapshotIndex: number;
  
  initializeGrid: () => void;
  toggleWall: (row: number, col: number) => void;
  setStartNode: (row: number, col: number) => void;
  setTargetNode: (row: number, col: number) => void;
  setAlgorithm: (algo: AlgorithmType) => void;
  setSpeed: (speed: SpeedType) => void;
  setSnapshots: (snapshots: SimulationSnapshot[]) => void;
  runSimulation: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setPlaying: (isPlaying: boolean) => void;
  resetSimulation: () => void;
  clearBoard: () => void;
  fillWalls: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  grid: [],
  startNode: { row: 10, col: 10 },
  targetNode: { row: 10, col: 30 },
  algorithm: 'bfs',
  isPlaying: false,
  isFinished: false,
  speed: 'normal',
  snapshots: [],
  currentSnapshotIndex: 0,

  initializeGrid: () => {
    const grid = createGrid(GRID_ROWS, GRID_COLS);
    const { startNode, targetNode } = get();
    grid[startNode.row][startNode.col].type = 'start';
    grid[targetNode.row][targetNode.col].type = 'target';
    set({ grid });
  },

  toggleWall: (row, col) => {
    const { grid, isPlaying } = get();
    if (isPlaying) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const cell = newGrid[row][col];
    
    // Don't overwrite start or target
    if (cell.type === 'start' || cell.type === 'target') return;

    cell.isWall = !cell.isWall;
    cell.type = cell.isWall ? 'wall' : 'empty';
    
    // Invalidate snapshots when grid changes
    set({ 
        grid: newGrid, 
        snapshots: [], 
        currentSnapshotIndex: 0, 
        isFinished: false 
    });
  },

  setStartNode: (row, col) => {
    const { grid, isPlaying, startNode } = get();
    if (isPlaying) return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    // Clear old start
    newGrid[startNode.row][startNode.col].type = 'empty';
    // Set new start
    newGrid[row][col].type = 'start';
    newGrid[row][col].isWall = false; // Ensure start isn't a wall
    
    set({ 
        grid: newGrid, 
        startNode: { row, col },
        snapshots: [], 
        currentSnapshotIndex: 0, 
        isFinished: false
    });
  },

  setTargetNode: (row, col) => {
    const { grid, isPlaying, targetNode } = get();
    if (isPlaying) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    // Clear old target
    newGrid[targetNode.row][targetNode.col].type = 'empty';
    // Set new target
    newGrid[row][col].type = 'target';
    newGrid[row][col].isWall = false;

    set({ 
        grid: newGrid, 
        targetNode: { row, col },
        snapshots: [], 
        currentSnapshotIndex: 0, 
        isFinished: false 
    });
  },

  setAlgorithm: (algo) => set({ algorithm: algo }),
  setSpeed: (speed) => set({ speed }),
  setSnapshots: (snapshots) => set({ snapshots, currentSnapshotIndex: 0, isFinished: false }),
  
  runSimulation: () => {
    try {
        const { grid, startNode, targetNode, algorithm } = get();
        
        console.log(`Starting Simulation: ${algorithm}`);
        
        // Clean grid (keep walls)
        const cleanGrid = grid.map(row => 
            row.map(cell => ({
            ...cell,
            isVisited: false,
            isPath: false,
            distance: Infinity,
            parent: null,
            f: Infinity, g: Infinity, h: Infinity,
            type: ((cell.type === 'start' || cell.type === 'target' || cell.type === 'wall') ? cell.type : 'empty') as Cell['type']
            }))
        );

        let snapshots: SimulationSnapshot[] = [];

        if (algorithm === 'bfs') {
            snapshots = bfs(cleanGrid, startNode, targetNode);
        } else if (algorithm === 'dfs') {
            snapshots = dfs(cleanGrid, startNode, targetNode);
        } else if (algorithm === 'astar') {
            snapshots = astar(cleanGrid, startNode, targetNode);
        } else if (algorithm === 'dijkstra') {
            snapshots = dijkstra(cleanGrid, startNode, targetNode);
        } else {
            snapshots = bfs(cleanGrid, startNode, targetNode);
        }

        console.log(`Generated ${snapshots.length} snapshots`);
        set({ snapshots, currentSnapshotIndex: 0, isPlaying: true, isFinished: false });
    } catch (e) {
        console.error("Simulation Failed:", e);
        set({ isPlaying: false });
    }
  },

  nextStep: () => {
    const { currentSnapshotIndex, snapshots } = get();
    if (currentSnapshotIndex < snapshots.length - 1) {
      set({ currentSnapshotIndex: currentSnapshotIndex + 1 });
    } else {
      set({ isPlaying: false, isFinished: true });
    }
  },

  prevStep: () => {
    const { currentSnapshotIndex } = get();
    if (currentSnapshotIndex > 0) {
      set({ currentSnapshotIndex: currentSnapshotIndex - 1 });
    }
  },

  setPlaying: (isPlaying) => set({ isPlaying }),

  resetSimulation: () => {
    set((state) => {
      // Restore grid to initial state (walls/start/target only)
      const cleanGrid = state.grid.map(row => 
        row.map(cell => ({
          ...cell,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          parent: null,
          f: Infinity, g: Infinity, h: Infinity,
          type: (cell.type === 'start' || cell.type === 'target' || cell.type === 'wall') ? cell.type : 'empty' as const
        }))
      );
      
      return {
        grid: cleanGrid,
        snapshots: [],
        currentSnapshotIndex: 0,
        isPlaying: false,
        isFinished: false
      };
    });
  },

  clearBoard: () => {
     const { startNode, targetNode } = get();
     const grid = createGrid(GRID_ROWS, GRID_COLS);
     grid[startNode.row][startNode.col].type = 'start';
     grid[targetNode.row][targetNode.col].type = 'target';
     set({ 
       grid,
       snapshots: [],
       currentSnapshotIndex: 0,
       isPlaying: false,
       isFinished: false 
     });
  },

  fillWalls: () => {
    const { grid, startNode, targetNode } = get();
    // Create full wall grid
    const newGrid = grid.map(row => 
        row.map(cell => {
            const isStart = cell.row === startNode.row && cell.col === startNode.col;
            const isTarget = cell.row === targetNode.row && cell.col === targetNode.col;
            
            return {
                ...cell,
                isWall: !isStart && !isTarget, // Everything is wall except start/end
                type: (isStart ? 'start' : isTarget ? 'target' : 'wall') as Cell['type'],
                isVisited: false,
                isPath: false,
                distance: Infinity,
                parent: null
            };
        })
    );
     
    set({ 
        grid: newGrid, 
        snapshots: [], 
        currentSnapshotIndex: 0, 
        isFinished: false 
    });
  }
}));
