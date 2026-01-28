import type { Cell, Coordinate, SimulationSnapshot } from '../types';

export const bfs = (
  initialGrid: Cell[][], 
  start: Coordinate, 
  target: Coordinate
): SimulationSnapshot[] => {
  const snapshots: SimulationSnapshot[] = [];
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  
  // Deep clone helper
  const cloneGrid = (g: Cell[][]) => g.map(row => row.map(cell => ({ ...cell })));
  
  // Working grid
  let grid = cloneGrid(initialGrid);
  
  const queue: Coordinate[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);
  
  // Mark start
  grid[start.row][start.col].distance = 0;

  // Initial Snapshot
  snapshots.push({
    gridState: cloneGrid(grid),
    structureState: [...queue],
    currentNode: null,
    logMessage: `BFS Initialized. Start: (${start.row}, ${start.col})`
  });

  let found = false;

  while (queue.length > 0) {
    const currentCoord = queue.shift()!;
    const { row, col } = currentCoord;
    const currentCell = grid[row][col];

    // Snapshot: Pop
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: [...queue], // Queue after pop
        currentNode: { ...currentCell },
        logMessage: `Dequeue (${row}, ${col}). Checking neighbors.`
    });

    // Check Target
    if (row === target.row && col === target.col) {
        found = true;
        snapshots.push({
            gridState: cloneGrid(grid),
            structureState: [],
            currentNode: { ...currentCell },
            logMessage: `TARGET FOUND at (${row}, ${col})!`
        });
        break;
    }

    // Mark as Current (processing)
    if (grid[row][col].type !== 'start' && grid[row][col].type !== 'target') {
        grid[row][col].type = 'current';
    }

    // Explore
    const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 },
    ];

    for (const n of neighbors) {
        if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
            const key = `${n.r},${n.c}`;
            const neighborCell = grid[n.r][n.c];

            if (!neighborCell.isWall && !visited.has(key)) {
                visited.add(key);
                neighborCell.parent = { row, col };
                neighborCell.distance = currentCell.distance + 1;
                
                if (neighborCell.type !== 'target') {
                    neighborCell.type = 'frontier';
                }
                
                queue.push({ row: n.r, col: n.c });
            }
        }
    }

    // Mark as Visited (Done with this node)
    if (grid[row][col].type !== 'start' && grid[row][col].type !== 'target') {
         grid[row][col].type = 'visited';
    }

    // Snapshot: End of Loop
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: [...queue],
        currentNode: { ...currentCell },
        logMessage: `Neighbors added. Queue: ${queue.length}`
    });
  }

  // Backtrace Path
  if (found) {
    let curr = grid[target.row][target.col];
    const path: Coordinate[] = [];
    
    while (curr.parent) {
        path.push({ row: curr.row, col: curr.col });
        const p = curr.parent;
        curr = grid[p.row][p.col];
        
        // Mark path visually (excluding start/target if desired, but here we overwrite)
        if (curr.type !== 'start' && curr.type !== 'target') {
             curr.type = 'path';
             curr.isPath = true;
        } else if (curr.type === 'target') {
             // ensure target stays target
        }
    }
    path.push({ row: start.row, col: start.col }); // Add start
    
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: [],
        currentNode: null,
        logMessage: `Path Constructed! Length: ${path.length}`
    });
  } else {
      snapshots.push({
        gridState: cloneGrid(grid),
        structureState: [],
        currentNode: null,
        logMessage: `No path found.`
    });
  }

  return snapshots;
};
