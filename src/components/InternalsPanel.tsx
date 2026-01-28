import { useGameStore } from '../store/gameStore';

const InternalsPanel = () => {
  const { snapshots, currentSnapshotIndex, algorithm } = useGameStore();
  
  const currentSnapshot = snapshots[currentSnapshotIndex];
  const structure = currentSnapshot?.structureState || [];
  
  const title = algorithm === 'bfs' ? 'Queue (FIFO)' : algorithm === 'dfs' ? 'Stack (LIFO)' : 'Priority Queue';

  return (
    <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col overflow-hidden">
       <h3 className="text-lg font-bold border-b pb-2 mb-2 flex justify-between items-center">
         <span>Internal State</span>
         <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase tracking-wider">{title}</span>
       </h3>
       
       <div className="flex-1 bg-gray-50 rounded p-2 overflow-y-auto">
         {structure.length === 0 ? (
           <div className="text-gray-400 text-sm italic text-center mt-4">Empty</div>
         ) : (
           <div className="flex flex-wrap gap-1 content-start">
             {structure.map((item: any, idx: number) => (
               <div key={idx} className="bg-white border border-gray-300 px-2 py-1 rounded text-xs font-mono shadow-sm text-gray-600">
                 ({item.row}, {item.col})
               </div>
             ))}
           </div>
         )}
       </div>
       
       {/* Current Node Detail */}
       {currentSnapshot?.currentNode && (
           <div className="mt-4 border-t pt-2">
               <h4 className="text-sm font-semibold text-gray-700 mb-1">Proccessing Node</h4>
               <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm text-gray-800">
                   <div className="flex justify-between">
                       <span>Position:</span>
                       <span className="font-mono font-bold">({currentSnapshot.currentNode.row}, {currentSnapshot.currentNode.col})</span>
                   </div>
                   {currentSnapshot.currentNode.distance !== Infinity && (
                       <div className="flex justify-between">
                           <span>Distance:</span>
                           <span className="font-mono">{currentSnapshot.currentNode.distance}</span>
                       </div>
                   )}
                   {/* Future A* metrics */}
                   {currentSnapshot.currentNode.f !== Infinity && (
                       <div className="mt-1 pt-1 border-t border-yellow-200">
                           <div className="flex justify-between text-xs">
                               <span>F: {currentSnapshot.currentNode.f}</span>
                               <span>G: {currentSnapshot.currentNode.g}</span>
                               <span>H: {currentSnapshot.currentNode.h}</span>
                           </div>
                       </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};
export default InternalsPanel;
