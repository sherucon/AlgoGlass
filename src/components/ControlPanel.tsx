import { useGameStore } from '../store/gameStore';
import type { AlgorithmType } from '../types';

const ControlPanel = () => {
    const { 
        runSimulation,
        isPlaying, 
        isFinished,
        setPlaying,
        nextStep, 
        resetSimulation, 
        clearBoard, 
        fillWalls,
        algorithm, 
        setAlgorithm,
        snapshots,
        speed,
        setSpeed
    } = useGameStore();

    const handleStart = () => {
        if (snapshots.length === 0 || isFinished) {
            runSimulation();
        } else {
            setPlaying(true);
        }
    };

    const handlePause = () => {
        setPlaying(!isPlaying);
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[300px]">
           <h2 className="text-xl font-bold text-gray-800">Control Panel</h2>
           
           {/* Algorithm Selector */}
           <div className="flex flex-col gap-1">
             <label className="text-sm font-semibold text-gray-500">Algorithm</label>
             <select 
               value={algorithm} 
               onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
               className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
             >
               <option value="bfs">Breadth-First Search (BFS)</option>
               <option value="dfs">Depth-First Search (DFS)</option>
               <option value="dijkstra">Dijkstra's Algorithm</option>
               <option value="astar">A* Search</option>
             </select>
           </div>

           {/* Speed Control */}
           <div className="flex flex-col gap-1">
             <label className="text-sm font-semibold text-gray-500">Speed</label>
             <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
               {(['slow', 'normal', 'fast', 'instant'] as const).map(s => (
                 <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-all ${
                        speed === s 
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                 >
                   {s === 'instant' ? '⚡' : s.charAt(0).toUpperCase() + s.slice(1)}
                 </button>
               ))}
             </div>
           </div>
           
           {/* Controls */}
           <div className="grid grid-cols-2 gap-2">
             <button 
                onClick={handleStart}
                disabled={isPlaying && snapshots.length > 0}
                className="col-span-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold disabled:opacity-50 transition-colors"
             >
                {snapshots.length > 0 ? (isPlaying ? 'Running...' : 'Resume') : 'Start Simulation'}
             </button>
             
             <button 
                onClick={handlePause} 
                disabled={snapshots.length === 0}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 font-medium disabled:opacity-50"
             >
                {isPlaying ? 'Pause' : 'Play'}
             </button>
             
             <button 
                onClick={nextStep} 
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 font-medium"
             >
                Step &gt;
             </button>
             
             <button 
                onClick={resetSimulation} 
                className="px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded hover:bg-yellow-200 font-medium"
             >
                Reset Path
             </button>

             <button 
                onClick={fillWalls} 
                className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded hover:bg-gray-900 font-medium"
             >
                Fill Walls
             </button>
             
             <button 
                onClick={clearBoard} 
                className="px-4 py-2 bg-red-100 text-red-800 border border-red-200 rounded hover:bg-red-200 font-medium"
             >
                Clear Board
             </button>
           </div>
        </div>
    );
};
export default ControlPanel;
