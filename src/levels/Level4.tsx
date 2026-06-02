import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GraphCanvas from '../components/GraphCanvas';
import { cityGraph, circuitGraph, museumGraph } from '../data/graphs';
import { useGraphGame } from '../hooks/useGraphGame';
import { Truck, Undo2, Map, PartyPopper, Cpu, Shield, HelpCircle, X } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const SCENARIOS = [
  {
    id: 'city',
    graph: cityGraph,
    theme: 'blueprint' as const,
    title: '城市规划师',
    icon: Map,
    indicator: Truck,
    desc: '规划洒水车路线，务必不能在同一条街道走两次。',
    hint: '提示：寻找全图的奇点。欧拉定律告诉我们，如果有且仅有两个奇点，必须从其中一个出发，到另一个结束。先找找哪两个路口连着奇数条街道？',
    colors: { bg: 'bg-[#f8fafc]', headerBg: 'bg-white', boardBg: 'bg-slate-200', text: 'text-blue-600', primary: 'bg-blue-600', success: 'bg-blue-500' }
  },
  {
    id: 'circuit',
    graph: circuitGraph,
    theme: 'circuit' as const,
    title: '硬件工程师',
    icon: Cpu,
    indicator: Cpu,
    desc: '在主板上连接所有触点，连线不能重叠。提示：仔细观察奇点！',
    hint: '提示：这块主板上也有且只有两个奇点触点。仔细数一数每个触点连出去了几条线？记住，从奇点开始布线才能成功！',
    colors: { bg: 'bg-[#064e3b]', headerBg: 'bg-[#022c22]', boardBg: 'bg-[#022c22]', text: 'text-[#34d399]', primary: 'bg-[#10b981]', success: 'bg-emerald-600' }
  },
  {
    id: 'museum',
    graph: museumGraph,
    theme: 'museum' as const,
    title: '博物馆安保主管',
    icon: Shield,
    indicator: Shield,
    desc: '设计一条不重复的巡航路线，走过所有连廊。仔细观察，所有点都是偶点喔！',
    hint: '提示：数过这里的连廊了吗？你会发现所有的区域都是偶点。既然有0个奇点，那就意味着你可以从任意一个点出发，最后还会回到原点！',
    colors: { bg: 'bg-[#291911]', headerBg: 'bg-[#1a0e08]', boardBg: 'bg-[#1a0e08]', text: 'text-[#fbbf24]', primary: 'bg-[#d97706]', success: 'bg-amber-600' }
  }
];

export default function Level4({ onNext }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);

  const handleSceneComplete = () => {
    if (sceneIndex < SCENARIOS.length - 1) {
      setSceneIndex(s => s + 1);
    } else {
      onNext();
    }
  };

  return (
    <Level4Scene 
      key={sceneIndex} 
      config={SCENARIOS[sceneIndex]} 
      onComplete={handleSceneComplete} 
      isLast={sceneIndex === SCENARIOS.length - 1}
    />
  );
}

function Level4Scene({ config, onComplete, isLast }: { config: typeof SCENARIOS[0], onComplete: () => void, isLast: boolean }) {
  const { gameState, handleNodeClick, handleEdgeClick, undo, isComplete } = useGraphGame(config.graph);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => setShowSuccess(true), 1000);
    }
  }, [isComplete]);

  const Icon = config.icon;
  const Indicator = config.indicator;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col h-full ${config.colors.bg} ${config.theme === 'blueprint' ? 'text-slate-800' : 'text-slate-100'} relative w-full overflow-hidden`}
    >
      <div className={`p-6 ${config.colors.headerBg} shadow-md flex flex-col z-10 sticky top-0 border-b ${config.theme === 'blueprint' ? 'border-slate-200' : 'border-white/10'}`}>
        <div className="flex justify-between items-center mb-2">
          <div className={`flex items-center gap-2 ${config.colors.text}`}>
            <Icon size={24} />
            <h2 className="text-xl font-black tracking-tight">{config.title}</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHint(true)}
              className={`p-2 rounded-full ${config.theme === 'blueprint' ? 'bg-amber-100 hover:bg-amber-200 text-amber-600' : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-400'} transition-colors shadow-sm`}
              title="查看过关提示"
            >
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={undo}
              disabled={gameState.visitedEdges.length === 0 || isComplete}
              className={`p-2 rounded-full ${config.theme === 'blueprint' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/10 hover:bg-white/20 text-white'} disabled:opacity-50`}
            >
              <Undo2 size={20} />
            </button>
          </div>
        </div>
        <p className={`text-sm ${config.theme === 'blueprint' ? 'text-slate-500' : 'text-slate-300'} font-medium`}>{config.desc}</p>
      </div>

      <div className={`flex-1 relative overflow-hidden p-4 md:p-6 ${config.colors.boardBg}`}>
        {/* Subtle grid background */}
        {config.theme === 'blueprint' && <div className="absolute inset-0 bg-grid-slate-300/[0.4] bg-[length:20px_20px]" />}
        
        <div className={`absolute inset-4 md:inset-6 ${config.theme === 'blueprint' ? 'bg-white/80 border-white' : 'bg-black/40 border-black/50'} rounded-3xl border-4 shadow-xl backdrop-blur-sm overflow-hidden`}>
          <GraphCanvas 
            graph={config.graph} 
            gameState={gameState} 
            onNodeClick={isComplete ? () => {} : handleNodeClick}
            onEdgeClick={isComplete ? undefined : handleEdgeClick}
            theme={config.theme}
            showLabels
          />
        </div>

        {/* HUD Indicator */}
        {gameState.currentNode && !isComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-8 right-8 ${config.colors.text} ${config.theme === 'blueprint' ? 'bg-white/90 border-white' : 'bg-black/90 border-white/20'} p-3 rounded-full shadow-lg z-20 backdrop-blur-md border border-white`}
          >
            <Indicator size={32} className="animate-bounce" />
          </motion.div>
        )}
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${config.theme === 'blueprint' ? 'bg-white text-slate-800' : 'bg-neutral-900 text-slate-100'} p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-sm w-full relative border ${config.theme === 'blueprint' ? 'border-amber-200' : 'border-amber-900/50'}`}
            >
              <button onClick={() => setShowHint(false)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-full shadow-inner">
                  <HelpCircle size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">欧拉的提示</h3>
              </div>
              <p className="text-base leading-relaxed font-medium mt-2 mb-6 opacity-90">
                {config.hint}
              </p>
              <button 
                onClick={() => setShowHint(false)}
                className={`w-full py-3 rounded-xl font-bold ${config.theme === 'blueprint' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20'} transition-all active:scale-95`}
              >
                我明白了，这就去试试
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className={`${config.theme === 'blueprint' ? 'bg-white' : 'bg-neutral-900'} rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-32 ${config.colors.success} opacity-20`} />
              <PartyPopper size={64} className={`${config.colors.text} mx-auto mb-6 relative z-10`} />
              <h2 className={`text-3xl font-black ${config.theme === 'blueprint' ? 'text-slate-800' : 'text-white'} mb-4 relative z-10`}>任务完成！</h2>
              <p className={`${config.theme === 'blueprint' ? 'text-slate-600' : 'text-slate-300'} font-medium mb-8 relative z-10 text-lg leading-relaxed`}>
                {isLast ? "你已经掌握了欧拉路径的核心奥秘！从城市规划、电路板到巡警迷宫，一笔画无处不在。" : "干得漂亮！准备好迎接下一个现实挑战了吗？"}
              </p>
              
              <button 
                onClick={onComplete}
                className={`w-full ${config.colors.success} text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-95 text-lg relative z-10`}
              >
                {isLast ? "查看最终结论" : "前往下一关"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
