import type { Cell, Coordinate, SimulationSnapshot } from '../types';

export const astar = (
  initialGrid: Cell[][], 
  start: Coordinate, 
  target: Coordinate
): SimulationSnapshot[] => {
  const snapshots: SimulationSnapshot[] = [];
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  
  const cloneGrid = (g: Cell[][]) => g.map(row => row.map(cell => ({ ...cell })));
  const h = (a: Coordinate, b: Coordinate) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  
  let grid = cloneGrid(initialGrid);
  
  // Use array as Priority Queue, sorted by f, then h
  let openSet: Cell[] = [];
  
  // Setup Start Node
  const startCell = grid[start.row][start.col];
  startCell.g = 0;
  startCell.h = h(start, target);
  startCell.f = startCell.g + startCell.h;
  startCell.type = 'frontier';
  
  openSet.push(startCell);
  
  snapshots.push({
    gridState: cloneGrid(grid),
    structureState: openSet.map(n => ({ row: n.row, col: n.col, f: n.f })),
    currentNode: null,
    logMessage: `A* Started. Start F = ${startCell.f} (G:0 + H:${startCell.h})`
  });

  let found = false;

  while (openSet.length > 0) {
    // Sort logic: Lowest F. If tie, Lowest H.
    openSet.sort((a, b) => {
        if (a.f === b.f) return a.h - b.h;
        return a.f - b.f;
    });

    const currentCell = openSet.shift()!;
    const { row, col } = currentCell;

    // Snapshot: Pick Best Node
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: openSet.map(n => ({ row: n.row, col: n.col, f: n.f })),
        currentNode: { ...currentCell },
        logMessage: `Picked Best Node (${row}, ${col}) with F: ${currentCell.f}`
    });

    // Close Node
    if (grid[row][col].type !== 'start' && grid[row][col].type !== 'target') {
        grid[row][col].type = 'visited'; // Closed Set
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
    
    // Update visual to 'current' briefly if needed, but 'visited' is closed set in A*
    // Usually Closed Nodes are red/visited. Open Nodes are green/frontier.
    
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

            const tentativeG = currentCell.g + 1;
            
            // If neighbor not in OpenSet or we found a better G
            // Note: In our grid, if type is 'frontier', it's in OpenSet.
            const inOpenSet = neighbor.type === 'frontier';

            if (!inOpenSet || tentativeG < neighbor.g) {
                neighbor.parent = { row, col };
                neighbor.g = tentativeG;
                neighbor.h = h({ row: n.r, col: n.c }, target);
                neighbor.f = neighbor.g + neighbor.h;
                
                if (!inOpenSet) {
                    neighbor.type = 'frontier';
                    openSet.push(neighbor);
                } else {
                    // It's already in openSet, but we updated values.
                    // We need to re-sort or just leave it for next iter sort.
                }
            }
        }
    }
    
    snapshots.push({
        gridState: cloneGrid(grid),
        structureState: openSet.map(n => ({ row: n.row, col: n.col, f: n.f })),
        currentNode: { ...currentCell },
        logMessage: `Updated Neighbors. Open Set Size: ${openSet.length}`
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
        logMessage: `A* Optimal Path Found!`
    });
  }

  return snapshots;
};
