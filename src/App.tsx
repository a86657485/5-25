import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings, X } from 'lucide-react';
import Intro from './levels/Intro';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';
import Level5 from './levels/Level5';
import Outro from './levels/Outro';

export default function App() {
  const [level, setLevel] = useState(0);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [devUnlocked, setDevUnlocked] = useState(false);

  const nextLevel = () => setLevel((l) => l + 1);
  const resetToStart = () => setLevel(0);

  const handleDevSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (devPassword === '2468') {
      setDevUnlocked(true);
      setDevModalOpen(false);
      setDevPassword('');
    } else {
      setDevPassword('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-950 w-full font-sans overflow-hidden relative">
      <div className="w-full h-full max-w-7xl max-h-[90vh] bg-neutral-900 text-white relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col rounded-3xl border border-neutral-800">
        <AnimatePresence mode="wait">
          {level === 0 && <Intro key="intro" onNext={nextLevel} />}
          {level === 1 && <Level1 key="l1" onNext={nextLevel} />}
          {level === 2 && <Level2 key="l2" onNext={nextLevel} />}
          {level === 3 && <Level3 key="l3" onNext={nextLevel} />}
          {level === 4 && <Level4 key="l4" onNext={nextLevel} />}
          {level === 5 && <Level5 key="l5" onNext={nextLevel} />}
          {level === 6 && <Outro key="outro" onNext={resetToStart} />}
        </AnimatePresence>
      </div>

      {/* Dev Tools Trigger */}
      <button 
        onClick={() => setDevModalOpen(true)}
        className="absolute bottom-4 left-4 p-2 text-white/30 hover:text-white/80 transition-colors z-[100]"
      >
        <Settings size={20} />
      </button>

      {/* Dev Tools Modal / Level Selector */}
      <AnimatePresence>
        {devModalOpen && !devUnlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl"
            >
              <button onClick={() => setDevModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-4">开发者模式</h3>
              <form onSubmit={handleDevSubmit}>
                <input 
                  type="password" 
                  value={devPassword}
                  onChange={(e) => setDevPassword(e.target.value)}
                  placeholder="请输入密令"
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 mb-4"
                  autoFocus
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors">
                  解锁
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {devModalOpen && devUnlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl"
            >
              <button onClick={() => setDevModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-6">关卡选择</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "序章", lvl: 0 },
                  { name: "第一关：考察", lvl: 1 },
                  { name: "第二关：抽象", lvl: 2 },
                  { name: "第三关：探究", lvl: 3 },
                  { name: "第四关：结算", lvl: 4 },
                  { name: "第五关：测试", lvl: 5 },
                  { name: "终章", lvl: 6 },
                ].map((l) => (
                  <button 
                    key={l.lvl}
                    onClick={() => { setLevel(l.lvl); setDevModalOpen(false); }}
                    className={`py-3 px-4 rounded-lg font-medium transition-colors ${level === l.lvl ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
