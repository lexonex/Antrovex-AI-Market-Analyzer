import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0F1115]">
      <div className="flex items-center gap-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20"
        >
          A
        </motion.div>
        <span className="text-lg font-bold tracking-tight text-white uppercase">
          ANTROVEX <span className="text-blue-500 font-light">AI</span>
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">System: gemini-3.5-flash</span>
        </div>
        <nav className="flex gap-6 text-sm text-slate-400 font-medium">
          <a href="#" className="text-white hover:text-blue-400 transition-colors">Analyzer</a>
          <a href="#" className="hover:text-blue-400 transition-colors">History</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Settings</a>
        </nav>
      </div>
    </header>
  );
}
