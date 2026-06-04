import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GraphCanvas from '../components/GraphCanvas';
import { qGraph1, qGraph2, qGraph3, qGraph4, qGraph5, qGraph6, qGraph7, qGraph8, qGraph9 } from '../data/graphs';
import { BrainCircuit, CheckCircle2, XCircle, Undo2, RefreshCcw } from 'lucide-react';
import { useGraphGame } from '../hooks/useGraphGame';

interface Props {
  onNext: () => void;
}

const QUIZ_DATA = [
  { graph: qGraph1, oddCount: 6, canDraw: false },
  { graph: qGraph2, oddCount: 4, canDraw: false },
  { graph: qGraph3, oddCount: 4, canDraw: false },
  { graph: qGraph4, oddCount: 6, canDraw: false },
  { graph: qGraph5, oddCount: 2, canDraw: true },
  { graph: qGraph6, oddCount: 2, canDraw: true },
  { graph: qGraph7, oddCount: 0, canDraw: true },
  { graph: qGraph8, oddCount: 0, canDraw: true },
  { graph: qGraph9, oddCount: 8, canDraw: false },
];

export default function Level5({ onNext }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [oddInput, setOddInput] = useState<string>('');
  const [canDrawInput, setCanDrawInput] = useState<boolean | null>(null);
  
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string, degree: number } | null>(null);

  const currentQuiz = QUIZ_DATA[currentIdx];
  const { gameState, handleNodeClick: baseNodeClick, handleEdgeClick, undo, reset, isComplete } = useGraphGame(currentQuiz.graph);

  useEffect(() => {
    reset();
    setOddInput('');
    setCanDrawInput(null);
    setFeedback(null);
    setSelectedNode(null);
  }, [currentIdx]);

  const handleNodeClick = (nodeId: string) => {
    const degree = currentQuiz.graph.edges.filter(e => e.n1 === nodeId || e.n2 === nodeId).length;
    setSelectedNode({ id: nodeId, degree });
    // clear feedback when they are exploring
    setFeedback(null);
    
    // Play game logic
    baseNodeClick(nodeId);
  };

  const handleSubmit = () => {
    if (oddInput === '' || canDrawInput === null) {
      setFeedback({ type: 'error', msg: '请完整填写奇点数量和是否能一笔画！' });
      return;
    }

    const predictedOdd = parseInt(oddInput);
    
    if (predictedOdd !== currentQuiz.oddCount) {
      setFeedback({ type: 'error', msg: `奇点数量不对喔！你可以点击图上的节点，查查它连着几条线。` });
      return;
    }

    if (canDrawInput !== currentQuiz.canDraw) {
      setFeedback({ type: 'error', msg: `奇点数量算对啦是 ${predictedOdd} 个！但判断错啦，记住：只有当奇点数量为 0 或 2 时，才可以一笔画！` });
      return;
    }

    setFeedback({ type: 'success', msg: '回答完全正确！真聪明！' });
    
    setTimeout(() => {
      if (currentIdx < QUIZ_DATA.length - 1) {
        setCurrentIdx(c => c + 1);
        setOddInput('');
        setCanDrawInput(null);
        setFeedback(null);
        setSelectedNode(null);
      } else {
        onNext();
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col h-full bg-slate-50 text-slate-900 w-full relative"
    >
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <BrainCircuit size={24} />
          <h2 className="text-xl font-bold">第五关：终极测试</h2>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
          {currentIdx + 1} / {QUIZ_DATA.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Half: Graph Area */}
        <div className="md:w-1/2 lg:w-3/5 h-[45%] md:h-full relative bg-slate-100 p-4 shrink-0 flex flex-col items-center justify-center md:border-r-4 md:border-b-0 border-b-4 border-slate-200 border-dashed">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          <p className="text-slate-500 font-medium text-sm lg:text-base mb-6 relative z-10 text-center">
            点击圆点数奇点，<span className="text-indigo-500">也可以直接连线验证哦！</span>
          </p>
          <div className="relative w-full max-w-[320px] md:max-w-[480px] lg:max-w-[560px] aspect-square bg-white shadow-xl rounded-2xl border-2 border-slate-300 overflow-hidden">
            <GraphCanvas 
              graph={currentQuiz.graph} 
              gameState={gameState}
              onNodeClick={isComplete ? undefined : handleNodeClick}
              onEdgeClick={isComplete ? undefined : handleEdgeClick}
              theme="abstract" 
              highlightedNodeId={selectedNode?.id}
            />

            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
              <button 
                onClick={undo}
                disabled={gameState.visitedEdges.length === 0 && gameState.currentNode === null}
                className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:shadow-none"
                title="撤销"
              >
                <Undo2 size={20} />
              </button>
              <button 
                onClick={reset}
                disabled={gameState.visitedEdges.length === 0 && gameState.currentNode === null}
                className="p-3 rounded-full bg-white text-slate-600 shadow-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:shadow-none"
                title="重置"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            {isComplete && (
              <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>挑战成功</span>
                </div>
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {selectedNode && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={selectedNode.id}
                className="absolute top-6 left-0 right-0 mx-auto w-max bg-slate-800 text-white px-6 py-3 rounded-full text-base font-medium shadow-xl z-[100] pointer-events-none"
              >
                这个点连接了 <span className="font-bold text-amber-400 text-xl mx-1">{selectedNode.degree}</span> 条线，它是
                <span className={selectedNode.degree % 2 !== 0 ? 'text-rose-400 mx-1 font-bold' : 'text-emerald-400 mx-1 font-bold'}>
                  {selectedNode.degree % 2 !== 0 ? '奇' : '偶'}点
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Half: Form Area */}
        <div className="md:w-1/2 lg:w-2/5 p-6 lg:p-8 flex flex-col bg-white overflow-y-auto relative z-10 md:rounded-l-3xl md:-ml-4 rounded-t-3xl border-t-0 -mt-4 md:mt-0 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] md:justify-center">
          
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
            <label className="block text-slate-700 font-bold mb-2">1. 这个图形中，共有几个奇点？</label>
            <input 
              type="number" 
              value={oddInput}
              onChange={e => setOddInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-bold text-slate-800"
              placeholder="请输入奇点个数"
              min="0"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
            <label className="block text-slate-700 font-bold mb-3">2. 这个图形能一笔画完成吗？</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setCanDrawInput(true)}
                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${canDrawInput === true ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-sm scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                能
              </button>
              <button 
                onClick={() => setCanDrawInput(false)}
                className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${canDrawInput === false ? 'bg-rose-100 border-rose-500 text-rose-700 shadow-sm scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                不能
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`p-3 rounded-lg flex items-start gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}
              >
                {feedback.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
                <p className="text-sm font-medium leading-tight pt-0.5">{feedback.msg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 text-lg mt-auto disabled:opacity-50 disabled:active:scale-100"
            disabled={feedback?.type === 'success'}
          >
            {feedback?.type === 'success' ? '太棒了！下一题...' : '提交答案'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
