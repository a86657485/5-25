import React from 'react';
import { motion } from 'motion/react';
import { Scroll, ArrowRight } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export default function Intro({ onNext }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col h-full bg-[#1a1510] text-[#e8dcc4] p-8 items-center justify-center relative border-[12px] border-double border-[#8b5a2b]"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-10"
      >
        <Scroll size={64} className="text-[#8b5a2b]" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-center mt-12 z-10"
      >
        <h1 className="text-3xl font-serif mb-6 text-[#d4af37]">欧拉的求救信</h1>
        <p className="text-lg leading-relaxed mb-4 italic font-serif">
          "你好，时空侦探。"
        </p>
        <p className="text-md leading-relaxed mb-4 font-serif">
          哥尼斯堡的居民被一个谜题困扰了很久。<br/>他们在美丽的城市中游荡，试图精准地只走过七座雄伟的桥各一次，绝不走回头路。
        </p>
        <p className="text-md leading-relaxed mb-12 font-serif text-[#d4af37]">
          你能帮他们找出这条路线吗？
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={onNext}
        className="absolute bottom-12 flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#a67139] text-[#1a1510] font-bold py-3 px-6 rounded-full transition-colors"
      >
        前往哥尼斯堡 <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );
}
