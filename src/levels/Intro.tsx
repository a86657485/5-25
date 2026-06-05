import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Scroll, ArrowRight, Play } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export default function Intro({ onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col h-full bg-[#1a1510] text-[#e8dcc4] border-[12px] border-double border-[#8b5a2b]"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      {/* Video Section */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl flex-shrink-0 relative"
      >
        <div className="relative rounded-xl overflow-hidden border-2 border-[#8b5a2b] shadow-2xl">
          <video
            ref={videoRef}
            src="导入1.mp4"
            className="w-full"
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={28} className="text-[#1a1510] ml-1" />
              </div>
            </button>
          )}
        </div>
      </motion.div>

      {/* Scroll Icon */}
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Scroll size={48} className="text-[#8b5a2b]" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-center mt-4 z-10 pb-8"
      >
        <h1 className="text-2xl font-serif mb-4 text-[#d4af37]">欧拉的求救信</h1>
        <p className="text-base leading-relaxed mb-3 italic font-serif">
          "你好，时空侦探。"
        </p>
        <p className="text-sm leading-relaxed mb-3 font-serif">
          哥尼斯堡的居民被一个谜题困扰了很久。<br/>他们在美丽的城市中游荡，试图精准地只走过七座雄伟的桥各一次，绝不走回头路。
        </p>
        <p className="text-md leading-relaxed mb-6 font-serif text-[#d4af37]">
          你能帮他们找出这条路线吗？
        </p>
      </motion.div>

      </div>

      {/* Fixed Bottom Button */}
      <div className="flex-shrink-0 p-4 flex justify-center border-t border-[#8b5a2b]/30">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onNext}
          className="flex items-center gap-2 bg-[#8b5a2b] hover:bg-[#a67139] text-[#1a1510] font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
      >
        前往哥尼斯堡 <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );
}
