import React, { memo } from 'react';
import type { Cell as CellType } from '../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CellProps {
  data: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Cell: React.FC<CellProps> = ({ data, onMouseDown, onMouseEnter, onMouseUp }) => {
  const { type } = data;

  const classes = clsx(
    'w-full h-full aspect-square cursor-pointer select-none',
    {
      'bg-wall': type === 'wall',
      'bg-current shadow-lg shadow-yellow-500/50 z-10': type === 'current',
      'bg-visited': type === 'visited', 
      'bg-frontier': type === 'frontier',
      'bg-path shadow-lg shadow-orange-500/50 z-10': type === 'path',
      'bg-green-500 shadow-md shadow-green-500/50 z-20': type === 'start',
      'bg-red-500 shadow-md shadow-red-500/50 z-20': type === 'target',
      'bg-white': type === 'empty',
    }
  );

  return (
    <motion.div
      className={classes}
      initial={false}
      animate={{ 
        scale: type === 'current' ? 1.2 : 1,
        // We rely on classes for color to keep it simple, but we can animate opacity/scale
      }}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      onMouseDown={() => onMouseDown(data.row, data.col)}
      onMouseEnter={() => onMouseEnter(data.row, data.col)}
      onMouseUp={onMouseUp}
    />
  );
};

export default memo(Cell);
