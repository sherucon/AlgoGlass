import type { Cell, Coordinate, SimulationSnapshot } from '../types';

export const dijkstra = (
  initialGrid: Cell[][], 
  start: Coordinate, 
  target: Coordinate
): SimulationSnapshot[] => {
  const snapshots: SimulationSnapshot[] = [];
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  
  const cloneGrid = (g: Cell[][]) => g.map(row => row.map(cell => ({ ...cell })));
  
  let grid = cloneGrid(initialGrid);
  
  let openSet: Cell[] = [];
  
  const startCell = grid[start.row][start.col];
  startCell.distance = 0;
  startCell.type = 'frontier';
  
  // Dijkstra typically uses just Distance (Cost).
  openSet.push(startCell);
  
  snapshots.push({
    gridState: cloneGrid(grid),
    structureState: openSet.map(n => ({ row: n.row, col: n.col, d: n.distance })),
    currentNode: null,
    logMessage: `Dijkstra Started. Start Dist = 0`
  });

  let found = false;

  while (openSet.length > 0) {
    // Sort by Distance
    openSet.sort((a, b) => a.distance - b.distance);

    const currentCell = openSet.shift()!;
    const { row, col } = currentCell;

    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: openSet.map(n => ({ row: n.row, col: n.col, d: n.distance })),
        currentNode: { ...currentCell },
        logMessage: `Processing Node (${row}, ${col}) Dist: ${currentCell.distance}`
    });

    if (grid[row][col].type !== 'start' && grid[row][col].type !== 'target') {
        grid[row][col].type = 'visited';
    }

    if (row === target.row && col === target.col) {
        found = true;
        snapshots.push({
            gridState: cloneGrid(grid),
            structureState: [],
            currentNode: { ...currentCell },
            logMessage: `TARGET FOUND!`
        });
        break;
    }

    const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 },
    ];

    for (const n of neighbors) {
        if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
            const neighbor = grid[n.r][n.c];
            
            if (neighbor.isWall || neighbor.type === 'visited' || neighbor.type === 'start') {
                continue;
            }

            const tentativeDist = currentCell.distance + 1; // Uniform weight 1
            
            const inOpenSet = neighbor.type === 'frontier';

            if (tentativeDist < neighbor.distance) {
                neighbor.parent = { row, col };
                neighbor.distance = tentativeDist;
                
                if (!inOpenSet) {
                    neighbor.type = 'frontier';
                    openSet.push(neighbor);
                }
            }
        }
    }
    
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: openSet.map(n => ({ row: n.row, col: n.col, d: n.distance })),
        currentNode: { ...currentCell },
        logMessage: `Updated Neighbors. PQ Size: ${openSet.length}`
    });
  }

  // Backtrace
  if (found) {
      let curr = grid[target.row][target.col];
      while (curr.parent) {
          if (curr.type !== 'start' && curr.type !== 'target') {
              curr.type = 'path';
              curr.isPath = true;
          }
          const p = curr.parent;
          curr = grid[p.row][p.col];
      }
      snapshots.push({
        gridState: cloneGrid(grid),
        structureState: [],
        currentNode: null,
        logMessage: `Dijkstra Shortest Path Found!`
    });
  }

  return snapshots;
};
