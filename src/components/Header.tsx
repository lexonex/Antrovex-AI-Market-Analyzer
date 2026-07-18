import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="h-16 border-b border-black/5 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md relative z-50">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white shadow-xl shadow-orange-500/20 italic"
        >
          AX
        </motion.div>
        <div className="flex flex-col -gap-1">
          <span className="text-[14px] font-black tracking-[0.2em] text-black uppercase leading-none">
            ANTROVEX_<span className="text-orange-500">PRO</span>
          </span>
          <span className="text-[8px] font-mono font-bold text-black/20 uppercase tracking-[0.4em]">Market_Intelligence_OS</span>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-orange-500/5 rounded border border-orange-500/10">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] uppercase font-black text-orange-600/60 tracking-widest font-mono">Core: gemini-3.1-pro-preview</span>
        </div>
        <nav className="flex gap-8 text-[10px] text-black/40 font-black uppercase tracking-[0.2em]">
          <a href="#" className="text-black border-b-2 border-orange-500 pb-1">Analyzer</a>
          <a href="#" className="hover:text-orange-500 transition-colors">History</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terminal</a>
        </nav>
      </div>
    </header>
  );
}
