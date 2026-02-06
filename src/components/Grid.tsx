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
    setStartNode,
    setTargetNode,
    isPlaying,
    isFinished
  } = useGameStore();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [activeSelection, setActiveSelection] = useState<'start' | 'end' | null>(null);

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

    const cell = currentGrid[row][col];

    // If we are currently in "moving start node" mode
    if (activeSelection === 'start') {
      // Prevent placing start node on top of end node
      if (cell.type !== 'target') {
        setStartNode(row, col);
        setActiveSelection(null); // Exit selection mode
      }
      return;
    }

    // If we are currently in "moving end node" mode
    if (activeSelection === 'end') {
      // Prevent placing end node on top of start node
      if (cell.type !== 'start') {
        setTargetNode(row, col);
        setActiveSelection(null); // Exit selection mode
      }
      return;
    }

    // Check if clicking existing Start/End nodes to enter selection mode
    if (cell.type === 'start') {
      setActiveSelection('start');
      return;
    }
    
    if (cell.type === 'target') {
      setActiveSelection('end');
      return;
    }

    // Default behavior: Wall drawing
    setIsMouseDown(true);
    toggleWall(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (showSnapshot) return;
    
    // Disable dragging walls if we are in the middle of moving a Start/End node
    if (activeSelection) return;

    if (isMouseDown) {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <div 
      className={`inline-grid gap-px select-none bg-gray-300 border-4 border-gray-800 shadow-2xl rounded-lg overflow-hidden ${activeSelection ? 'cursor-crosshair' : ''}`}
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
