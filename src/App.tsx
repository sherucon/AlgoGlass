import { useEffect } from 'react';
import Grid from './components/Grid';
import ControlPanel from './components/ControlPanel';
import InternalsPanel from './components/InternalsPanel';
import Narrator from './components/Narrator';
import { useGameStore } from './store/gameStore';

function App() {
  const { isPlaying, nextStep, speed } = useGameStore();

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      let ms = 200;
      if (speed === 'slow') ms = 500;
      if (speed === 'fast') ms = 50;
      if (speed === 'instant') ms = 0; 

      interval = setInterval(() => {
        nextStep();
      }, ms);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextStep, speed]);

  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-hidden font-sans">
      {/* Center: Grid (60% approx) */}
      <main className="flex-[3] flex flex-col justify-center items-center relative min-w-0 bg-gray-200/50 rounded-2xl border-2 border-dashed border-gray-300">
        <h1 className="absolute top-4 left-6 text-2xl font-black tracking-tight text-gray-400 select-none">
          AlgoGlass <span className="text-blue-500 text-xs align-baseline">team pr0ud</span>
        </h1>
        <div className="absolute top-14 left-6 text-sm font-medium text-gray-400 pointer-events-none select-none space-y-1">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Draw walls by dragging over empty cells
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Click Start node to move it
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Click Target node to move it
          </p>
        </div>
        <div className="z-10 overflow-auto max-w-full max-h-full p-8 shadow-inner rounded-xl">
            <Grid />
        </div>
      </main>

      {/* Right Panel (25% approx) */}
      <aside className="flex-1 flex flex-col gap-4 min-w-[350px] max-w-[400px]">
        {/* Top: Internals */}
        <div className="flex-[2] min-h-0">
            <InternalsPanel />
        </div>
        
        {/* Bottom: Narrator & Controls */}
        <div className="flex-none flex flex-col gap-4">
            <div className="h-40 shrink-0">
                <Narrator />
            </div>
            <div className="">
                <ControlPanel />
            </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
