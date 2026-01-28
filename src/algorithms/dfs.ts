import type { Cell, Coordinate, SimulationSnapshot } from '../types';

export const dfs = (
  initialGrid: Cell[][], 
  start: Coordinate, 
  target: Coordinate
): SimulationSnapshot[] => {
  const snapshots: SimulationSnapshot[] = [];
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  
  const cloneGrid = (g: Cell[][]) => g.map(row => row.map(cell => ({ ...cell })));
  
  let grid = cloneGrid(initialGrid);
  
  // Stack for DFS
  const stack: Coordinate[] = [start];
  const visited = new Set<string>();
  // DFS typically marks visited when POPPED, or pushed? 
  // Standard DFS: Mark visited when pushing to stack OR when popping.
  // To avoid cycles, usually mark when pushing (grey) or use visited set strictly.
  // Actually, standard iterative DFS:
  // Push start. 
  // Loop while stack not empty:
  //   u = pop()
  //   if u not visited:
  //      visit u
  //      for each v in neighbors: push v
  // This allows duplicate entries in stack but handles them.
  
  // Let's stick to: Checked Visited on POP.
  
  // Initial Snapshot
  snapshots.push({
    gridState: cloneGrid(grid),
    structureState: [...stack],
    currentNode: null,
    logMessage: `DFS Started at (${start.row},${start.col})`
  });

  let found = false;

  while (stack.length > 0) {
    const currentCoord = stack.pop()!;
    const { row, col } = currentCoord;
    
    // Check if already visited (since we allow dups in stack in this implementation)
    const key = `${row},${col}`;
    if (visited.has(key)) continue; 
    
    visited.add(key);
    
    const currentCell = grid[row][col];
    
    // Update visual
    if (currentCell.type !== 'start' && currentCell.type !== 'target') {
        currentCell.type = 'current';
    }

    snapshots.push({
       gridState: cloneGrid(grid),
       structureState: [...stack],
       currentNode: { ...currentCell },
       logMessage: `Popped Node (${row}, ${col})`
    });

    if (row === target.row && col === target.col) {
        found = true;
        snapshots.push({
            gridState: cloneGrid(grid),
            structureState: [],
            currentNode: { ...currentCell },
            logMessage: `Target Found!`
        });
        break;
    }

    // Neighbors
    const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 },
    ];

    let neighborsAdded = 0;
    
    for (const n of neighbors) {
        if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
             const nKey = `${n.r},${n.c}`;
             const cell = grid[n.r][n.c];
             
             if (!cell.isWall && !visited.has(nKey)) {
                 // Essential for path tracing in DFS: set parent when discovering
                 // Note: In DFS set parent can be tricky if we revisit logic differs.
                 // But for simplicity, we set parent here.
                 // If a node is already in stack via another path, we might update parent?
                 // No, first discovery usually wins or last... strict DFS is first visited.
                 // But wait, if we only mark visited on POP, we might have multiple parents?
                 // Let's set parent only if parent is null or we want to overwrite?
                 // Actually, if we use the "Visited on Pop" style, we only set parent if not visited.
                 // But multiple paths can reach it.
                 // Simplest: Set parent, push to stack.
                 
                 // However, "Visited on Pop" means better to set parent when PUSHING?
                 // If we push, we haven't visited yet.
                 // Let's check if it has a parent? No, might overwrite.
                 
                 // Refined DFS:
                 // Only push if not visited. 
                 
                 cell.parent = { row, col };
                 cell.type = 'frontier';
                 stack.push({ row: n.r, col: n.c });
                 neighborsAdded++;
             }
        }
    }

    if (currentCell.type !== 'start' && currentCell.type !== 'target') {
        currentCell.type = 'visited';
    }

    snapshots.push({
       gridState: cloneGrid(grid),
       structureState: [...stack],
       currentNode: { ...currentCell },
       logMessage: `Pushed ${neighborsAdded} neighbors.`
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
  }

  return snapshots;
};
