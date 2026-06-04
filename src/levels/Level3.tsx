import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Undo2, RefreshCcw } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import { konigsbergGraph, envelopeGraph } from '../data/graphs';
import { useGraphGame } from '../hooks/useGraphGame';

interface Props {
  onNext: () => void;
}

export default function Level3({ onNext }: Props) {
  const [step, setStep] = useState(0); 
  // 0: Intro to Odd/Even
  // 1: Envelope Graph - Find Odd Nodes
  // 2: The Rule Reveal
  // 3: Apply to Konigsberg
  // 4: Modify Konigsberg

  const [foundOddNodes, setFoundOddNodes] = useState<string[]>([]);
  const [errorVisible, setErrorVisible] = useState(false);

  // Modification Mode State
  const [modifiedGraph, setModifiedGraph] = useState(konigsbergGraph);
  const [modStep, setModStep] = useState(0); // 0=del, 1=add_node1, 2=add_node2, 3=play
  const [addN1, setAddN1] = useState<string | null>(null);

  const { 
    gameState: modGameState, 
    handleNodeClick: baseModNodeClick, 
    handleEdgeClick: baseModEdgeClick, 
    isComplete: isModComplete,
    reset: resetModGame,
    undo: undoModGame
  } = useGraphGame(modifiedGraph);

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

  const handleModEdgeClick = (edgeId: string) => {
    if (modStep === 0) {
      setModifiedGraph(prev => ({
        ...prev,
        edges: prev.edges.filter(e => e.id !== edgeId)
      }));
      setModStep(1);
    } else if (modStep === 3) {
      baseModEdgeClick(edgeId);
    }
  };

  const handleModNodeClick = (nodeId: string) => {
    if (modStep === 1) {
      setAddN1(nodeId);
      setModStep(2);
    } else if (modStep === 2) {
      if (nodeId === addN1) return;
      setModifiedGraph(prev => ({
        ...prev,
        edges: [...prev.edges, { id: 'new_edge', n1: addN1!, n2: nodeId, curveOffset: 5, color: '#3b82f6' }]
      }));
      setModStep(3);
    } else if (modStep === 3) {
      baseModNodeClick(nodeId);
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
              <div className="text-center justify-center flex-1 flex flex-col mb-4">
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
              <div className="flex-[3] relative min-h-0 flex justify-center items-center">
                <div className="relative w-full max-w-md aspect-square max-h-full">
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
              <div className="text-center flex-1 flex flex-col justify-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">回到哥尼斯堡</h3>
                <p className="text-sm text-slate-500">点击所有的奇点。</p>
                <div className="mt-2 text-rose-500 font-bold">已找到 {foundOddNodes.length} / 4 个</div>
              </div>
              <div className="flex-[3] relative min-h-0 flex justify-center items-center bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden">
                <div className="relative w-full max-w-md aspect-square max-h-full">
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
              </div>
              
              {foundOddNodes.length === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 bg-white border-2 border-rose-500 p-4 rounded-xl text-center shadow-2xl z-30"
                >
                  <XCircle size={32} className="mx-auto text-rose-500 mb-2" />
                  <p className="font-bold text-rose-600 mb-4">4个奇点！欧拉发现，这在数学上是不可能一笔画完的！</p>
                  <button onClick={() => setStep(4)} className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold py-3 px-6 rounded-lg w-full max-w-sm mx-auto block">尝试改造七桥</button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">自己动手改造哥尼斯堡！</h3>
                
                {modStep === 0 && <p className="text-sm font-bold text-rose-500 mt-2">第一步：点击删除一座桥（一条线）</p>}
                {modStep === 1 && <p className="text-sm font-bold text-emerald-500 mt-2">第二步：点击第一个节点，准备建新桥</p>}
                {modStep === 2 && <p className="text-sm font-bold text-emerald-500 mt-2">第三步：点击第二个节点，建起新桥！</p>}
                {modStep === 3 && (
                  <>
                    <p className="text-sm font-bold text-indigo-500 mt-2">完成啦！现在试着一笔画完这幅新图吧！</p>
                    <button onClick={() => { setModStep(0); setModifiedGraph(konigsbergGraph); resetModGame(); setAddN1(null); }} className="text-xs text-slate-400 mt-2 hover:text-slate-600 underline">想重新改造？点击这里</button>
                  </>
                )}
              </div>

              <div className="flex-[3] relative min-h-0 flex justify-center items-center bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden">
                <div className="relative w-full max-w-md aspect-square max-h-full">
                  <GraphCanvas 
                    graph={modifiedGraph}
                    gameState={modGameState}
                    onNodeClick={handleModNodeClick}
                    onEdgeClick={handleModEdgeClick}
                    theme="abstract"
                    highlightedNodeId={addN1}
                  />

                  {modStep === 3 && (
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                      <button 
                        onClick={undoModGame}
                        disabled={modGameState.visitedEdges.length === 0 && modGameState.currentNode === null}
                        className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:shadow-none"
                        title="撤销"
                      >
                        <Undo2 size={20} />
                      </button>
                      <button 
                        onClick={resetModGame}
                        disabled={modGameState.visitedEdges.length === 0 && modGameState.currentNode === null}
                        className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:shadow-none"
                        title="重置"
                      >
                        <RefreshCcw size={20} />
                      </button>
                    </div>
                  )}

                  {isModComplete && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                      <div className="bg-emerald-500 text-white px-6 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 text-lg">
                        <CheckCircle2 size={28} />
                        <span>改造成功！太聪明了！</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isModComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 z-30"
                >
                  <button onClick={onNext} className="bg-slate-900 shadow-2xl hover:bg-slate-800 transition-colors text-white font-bold py-4 px-6 text-lg rounded-xl w-full mx-auto block max-w-sm">前往终极测试</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
