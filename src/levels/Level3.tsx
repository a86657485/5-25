import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import { konigsbergGraph, envelopeGraph } from '../data/graphs';
import { useGraphGame } from '../hooks/useGraphGame'; // Just for rendering empty state

interface Props {
  onNext: () => void;
}

export default function Level3({ onNext }: Props) {
  const [step, setStep] = useState(0); 
  // 0: Intro to Odd/Even
  // 1: Envelope Graph - Find Odd Nodes
  // 2: The Rule Reveal
  // 3: Apply to Konigsberg

  const [foundOddNodes, setFoundOddNodes] = useState<string[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);

  const handleEnvelopeNodeClick = (id: string) => {
    // Envelope odd nodes are 'bl' and 'br'
    if ((id === 'bl' || id === 'br') && !foundOddNodes.includes(id)) {
      setFoundOddNodes(prev => [...prev, id]);
      setErrorVisible(false);
    } else if (id !== 'bl' && id !== 'br') {
      // Small penalty or shake?
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 2000);
    }
  };

  const handleKonigsbergNodeClick = (id: string) => {
    if (!foundOddNodes.includes(id)) {
      setFoundOddNodes(prev => [...prev, id]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-slate-50 text-slate-900 relative"
    >
      <div className="p-6 bg-white shadow-sm flex justify-between items-center z-10">
        <div>
          <h2 className="text-xl font-black text-emerald-600 tracking-tight">第三关：一笔画实验室</h2>
          <p className="text-sm text-slate-500 font-medium">探究隐藏的规律。</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" exit={{ opacity: 0, scale: 0.9 }} className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 relative mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <line x1="50" y1="50" x2="10" y2="10" stroke="#94a3b8" strokeWidth="4" />
                  <line x1="50" y1="50" x2="90" y2="10" stroke="#94a3b8" strokeWidth="4" />
                  <line x1="50" y1="50" x2="50" y2="90" stroke="#94a3b8" strokeWidth="4" />
                  <circle cx="50" cy="50" r="15" fill="#f43f5e" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 w-full">数一数线条。</h3>
              <p className="text-slate-600 mb-8">这个点连着 3 条线。3 是一个奇数，我们把它叫做<strong className="text-rose-500">奇点</strong>。</p>
              <button onClick={() => setStep(1)} className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-full hover:bg-emerald-600 transition-colors shadow-lg">明白啦</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">找出图形里的“奇点”！</h3>
                <p className="text-sm text-slate-500">点击具有奇数条连线（1, 3, 5...）的节点。</p>
                <div className="mt-2 text-rose-500 font-bold">已找到 {foundOddNodes.length} / 2 个</div>
                <AnimatePresence>
                  {errorVisible && (
                    <motion.div 
                      key="err"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm font-bold mt-1"
                    >
                      不对哦，这个点连出去的线条数不是奇数！
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 relative">
                <GraphCanvas 
                  graph={envelopeGraph}
                  gameState={{ currentNode: null, visitedEdges: [] }}
                  onNodeClick={handleEnvelopeNodeClick}
                  theme="abstract"
                />
                {/* Highlight found nodes */}
                {foundOddNodes.map(id => {
                  const n = envelopeGraph.nodes.find(node => node.id === id)!;
                  return (
                    <motion.div 
                      key={id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute w-12 h-12 bg-rose-500/30 rounded-full border-4 border-rose-500 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    />
                  );
                })}
              </div>
              {foundOddNodes.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 z-20 flex justify-center"
                >
                  <button 
                    onClick={() => { setStep(2); setFoundOddNodes([]); }}
                    className="bg-emerald-500 text-white font-bold py-4 px-12 rounded-xl shadow-2xl text-lg w-full max-w-sm"
                  >
                    继续
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={64} className="text-emerald-500 mb-6" />
              <h3 className="text-3xl font-black mb-6 text-slate-800 tracking-tight">欧拉的黄金定律</h3>
              <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 mb-8 w-full max-w-sm">
                <p className="text-lg font-bold text-emerald-800 leading-relaxed">
                  一个图形<strong>只能被一笔画出</strong>的情况，是它有且仅有：
                </p>
                <p className="text-3xl font-black text-emerald-600 mt-4 mb-2">0 <span className="text-lg">或</span> 2</p>
                <p className="text-lg font-bold text-emerald-800">个奇点。</p>
              </div>
              <button onClick={() => setStep(3)} className="bg-slate-800 text-white font-bold px-8 py-4 rounded-xl w-full max-w-sm hover:bg-slate-700 shadow-xl">应用到哥尼斯堡七桥</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">回到哥尼斯堡</h3>
                <p className="text-sm text-slate-500">点击所有的奇点。</p>
                <div className="mt-2 text-rose-500 font-bold">已找到 {foundOddNodes.length} / 4 个</div>
              </div>
              <div className="flex-1 relative bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden">
                <GraphCanvas 
                  graph={konigsbergGraph}
                  gameState={{ currentNode: null, visitedEdges: [] }}
                  onNodeClick={handleKonigsbergNodeClick}
                  theme="abstract"
                />
                {foundOddNodes.map(id => {
                  const n = konigsbergGraph.nodes.find(node => node.id === id)!;
                  return (
                    <motion.div 
                      key={id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute w-12 h-12 bg-rose-500/30 rounded-full border-4 border-rose-500 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    />
                  );
                })}
              </div>
              
              {foundOddNodes.length === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 bg-white border-2 border-rose-500 p-4 rounded-xl text-center shadow-2xl z-30"
                >
                  <XCircle size={32} className="mx-auto text-rose-500 mb-2" />
                  <p className="font-bold text-rose-600 mb-4">4个奇点！原来从一开始，这就是个在数学上不可能完成的任务！</p>
                  <button onClick={onNext} className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg w-full max-w-sm mx-auto block">终级任务</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
