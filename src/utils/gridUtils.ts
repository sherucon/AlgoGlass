import type { Cell } from '../types';

export const createGrid = (rows: number, cols: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        type: 'empty',
        isVisited: false,
        isWall: false,
        isPath: false,
        distance: Infinity,
        parent: null,
        f: Infinity,
        g: Infinity,
        h: Infinity,
      });
    }
    grid.push(row);
  }
  return grid;
};

export const GRID_ROWS = 20;
export const GRID_COLS = 40;
