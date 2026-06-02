import React from 'react';
import { motion } from 'motion/react';
import { Award, RotateCcw } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export default function Outro({ onNext }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-[#1a1510] text-[#e8dcc4] p-8 items-center justify-center text-center relative border-[12px] border-double border-[#8b5a2b]"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mb-8"
      >
        <Award size={100} className="text-[#d4af37] drop-shadow-2xl" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h1 className="text-4xl font-serif font-bold text-[#d4af37] mb-6">神探出师</h1>
        <p className="text-xl mb-4 font-serif italic text-[#c4a478]">
          你已精通抽象化思维的魅力。
        </p>
        <p className="text-md leading-relaxed font-serif text-slate-300 max-w-sm">
          通过剥开纷繁复杂的表象，抽出简单的点与线，你解开了一个困扰人们几个世纪的谜题。这就是数学特有的力量与浪漫！
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onNext}
        className="absolute bottom-12 flex items-center justify-center w-16 h-16 bg-[#8b5a2b] hover:bg-[#a67139] text-[#1a1510] rounded-full transition-transform hover:scale-110 shadow-xl"
      >
        <RotateCcw size={28} />
      </motion.button>
    </motion.div>
  );
}
