import { useState, useEffect } from 'react';
import Cell from './Cell';
import { useGameStore } from '../store/gameStore';

const Grid = () => {
  const { 
    grid: initialGrid, 
    snapshots, 
    currentSnapshotIndex, 
    initializeGrid, 
    toggleWall,
    isPlaying,
    isFinished
  } = useGameStore();

  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    initializeGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine which grid to show
  const hasSnapshots = snapshots.length > 0;
  // If we have started simulation (snapshots exist) and index > 0, show snapshot
  // Or if we are playing.
  const showSnapshot = hasSnapshots && (currentSnapshotIndex > 0 || isPlaying || isFinished);
  
  const currentGrid = showSnapshot 
    ? snapshots[currentSnapshotIndex].gridState 
    : initialGrid;

  // Safety check: if grid isn't ready
  if (!currentGrid || currentGrid.length === 0) return <div>Loading Grid...</div>;

  const handleMouseDown = (row: number, col: number) => {
    if (showSnapshot) return;
    setIsMouseDown(true);
    toggleWall(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (showSnapshot) return;
    if (isMouseDown) {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <div 
      className="inline-grid gap-px select-none bg-gray-300 border-4 border-gray-800 shadow-2xl rounded-lg overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${currentGrid[0].length}, 24px)`
      }}
      onMouseLeave={() => setIsMouseDown(false)}
    >
        {currentGrid.map((row) => (
            row.map((cell) => (
                <Cell 
                    key={`${cell.row}-${cell.col}`}
                    data={cell}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                />
            ))
        ))}
    </div>
  );
};
export default Grid;
