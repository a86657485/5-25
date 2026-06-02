import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GraphCanvas from '../components/GraphCanvas';
import { konigsbergGraph } from '../data/graphs';
import { useGraphGame } from '../hooks/useGraphGame';
import { Network, RefreshCcw } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export default function Level2({ onNext }: Props) {
  const { gameState, handleNodeClick, handleEdgeClick, reset } = useGraphGame(konigsbergGraph);
  const [showEuler, setShowEuler] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const stuck = gameState.currentNode !== null && 
    konigsbergGraph.edges.filter(e => 
      !gameState.visitedEdges.includes(e.id) &&
      (e.n1 === gameState.currentNode || e.n2 === gameState.currentNode)
    ).length === 0 && 
    gameState.visitedEdges.length < konigsbergGraph.edges.length;

  useEffect(() => {
    if (stuck) {
      setAttempts(a => a + 1);
    }
  }, [stuck]);

  useEffect(() => {
    if (attempts >= 1) {
      setTimeout(() => setShowEuler(true), 1500);
    }
  }, [attempts]);

  return (
    <motion.div 
      initial={{ opacity: 0, backgroundColor: '#0f172a' }}
      animate={{ opacity: 1, backgroundColor: '#020617' }}
      transition={{ duration: 1.5 }}
      className="flex flex-col h-full text-slate-200 relative"
    >
      <div className="p-6 bg-slate-900/80 shadow-md flex justify-between items-center z-10 border-b border-purple-900/30">
        <div>
          <h2 className="text-xl font-bold text-purple-400">第二关：上帝之眼</h2>
          <p className="text-sm text-slate-400">只留下无形的点与线。</p>
        </div>
        <button onClick={reset} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700">
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-grid-slate-800/[0.04]">
        <GraphCanvas 
          graph={konigsbergGraph} 
          gameState={gameState} 
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          theme="abstract"
          showLabels
        />
      </div>

      {/* Stuck Alert */}
      <AnimatePresence>
        {stuck && !showEuler && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-4 right-4 bg-slate-800 p-4 rounded-xl shadow-2xl text-center border border-slate-600"
          >
            <p className="mb-4">这下还是画不出来吗？</p>
            <button onClick={reset} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold w-full">
              重置
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Euler Reveal */}
      <AnimatePresence>
        {showEuler && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-50 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-slate-900 p-8 rounded-3xl border border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] max-w-sm"
            >
              <Network size={48} className="mx-auto text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-serif text-purple-300">"发现其中的联系了吗！"</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                你发现了吗？我们不需要管岛屿有多大，桥有多长。我们只关心<span className="text-white font-bold">点（陆地）</span>和<span className="text-white font-bold">线（桥梁）</span>。这就是抽象！
              </p>
              <p className="text-slate-300 mb-8">
                但为什么这是个不可能完成的任务？让我们去实验室一探究竟。
              </p>
              <button 
                onClick={onNext}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                进入实验室
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
