import { useGameStore } from '../store/gameStore';

const Narrator = () => {
  const { snapshots, currentSnapshotIndex } = useGameStore();
  const currentLog = snapshots[currentSnapshotIndex]?.logMessage || "Ready to start.";

  return (
    <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-xl shadow-lg h-full overflow-y-auto">
      <div className="text-xs text-gray-500 mb-1">SYSTEM LOG</div>
      <div className="text-sm">
        {'>'} {currentLog}
      </div>
    </div>
  );
};
export default Narrator;
