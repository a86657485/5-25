import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, RefreshCcw, Eye, Video } from 'lucide-react';
import Konigsberg3D from '../components/Konigsberg3D';
import { konigsbergGraph } from '../data/graphs';
import { useGraphGame } from '../hooks/useGraphGame';

interface Props {
  onNext: () => void;
}

export default function Level1({ onNext }: Props) {
  const { gameState, handleNodeClick, handleEdgeClick, reset } = useGraphGame(konigsbergGraph);
  const [attempts, setAttempts] = useState(0);
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview'>('follow');

  const handleFail = () => {
    setAttempts(a => a + 1);
    reset();
  };

  const stuck = gameState.currentNode !== null && 
    konigsbergGraph.edges.filter(e => 
      !gameState.visitedEdges.includes(e.id) &&
      (e.n1 === gameState.currentNode || e.n2 === gameState.currentNode)
    ).length === 0 && 
    gameState.visitedEdges.length < konigsbergGraph.edges.length;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      className="flex flex-col h-full bg-[#0a192f] text-slate-200 relative"
    >
      {/* Header */}
      <div className="p-6 bg-slate-900/50 shadow-md flex justify-between items-center z-10 w-full shrink-0">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-yellow-400">第一关：实地考察</h2>
          <p className="text-sm text-slate-400 leading-snug">点击岛屿或桥梁进行移动。每座桥只能走一次。</p>
        </div>
        <div className="flex gap-4 ml-4">
          <button onClick={() => setCameraMode(m => m === 'follow' ? 'overview' : 'follow')} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 shadow-md transition-colors" title="切换视角">
            <Video size={20} className={cameraMode === 'overview' ? "text-blue-400" : "text-white"} />
          </button>
          <button onClick={reset} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 shadow-md transition-colors" title="重新开始">
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-[#1e293b]">
        {/* River Background (Decorative) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-full h-1/3 bg-blue-500 transform -rotate-12 blur-2xl"></div>
        </div>
        
        {!gameState.currentNode && (
          <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-yellow-500/90 text-slate-900 px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce z-20 pointer-events-none backdrop-blur-sm whitespace-nowrap border-2 border-yellow-300">
            👆 请先点击任意地点作为起点
          </div>
        )}

        <Konigsberg3D 
          gameState={gameState} 
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          cameraMode={cameraMode}
        />

        {/* HUD: Progress */}
        <div className="absolute bottom-6 left-6 bg-slate-900/80 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
          <p className="text-sm font-semibold">已走桥梁：{gameState.visitedEdges.length} / 7</p>
        </div>
      </div>

      {/* Stuck Overlay */}
      <AnimatePresence>
        {stuck && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-4 right-4 bg-red-900/90 p-4 rounded-xl shadow-2xl text-center border border-red-500 backdrop-blur-md"
          >
            <p className="font-bold mb-2">你卡住了！</p>
            <p className="text-sm mb-4 text-red-200">从这座岛出发，已经没有未走过的新桥了。</p>
            <button onClick={handleFail} className="bg-white text-red-900 px-4 py-2 rounded-lg font-bold w-full">
              再试一次
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint/Next Level Trigger */}
      <AnimatePresence>
        {attempts >= 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-8 text-center z-50 backdrop-blur-sm"
          >
            <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500 shadow-2xl max-w-sm">
              <Eye size={48} className="mx-auto text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">遇到死胡同了？</h3>
              <p className="text-slate-300 mb-6">
                看来死磕是不行的！也许我们需要换个视角。让我们开启“上帝之眼”，剥离陆地和河水...
              </p>
              <button 
                onClick={onNext}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              >
                开启“上帝之眼”
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
