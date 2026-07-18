import { motion } from 'motion/react';
import React, { useState } from 'react';
import { LayoutDashboard, History, Terminal, LogOut } from 'lucide-react';

export default function Header() {
  const [active, setActive] = useState<'analyzer' | 'history'>('analyzer');

  const handleNavigate = (view: 'analyzer' | 'history') => {
    setActive(view);
    window.dispatchEvent(new CustomEvent('antrovex-view-change', { detail: view }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('antrovex_auth');
    window.location.reload();
  };

  return (
    <header className="h-20 border-b border-black/5 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md relative z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 bg-black rounded-xl flex items-center justify-center font-black text-white shadow-xl italic relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 text-xl">AX</span>
        </motion.div>
        <div className="flex flex-col">
          <span className="text-[16px] font-black tracking-[0.25em] text-black uppercase leading-none">
            ANTROVEX_<span className="text-orange-500">SYSTEMS</span>
          </span>
          <span className="text-[8px] font-mono font-bold text-black/30 uppercase tracking-[0.5em] mt-1">Intelligence_Core_V7.2</span>
        </div>
      </div>
      
      <nav className="flex items-center gap-1 bg-black/[0.03] p-1 rounded-xl border border-black/5">
        <NavButton 
          active={active === 'analyzer'} 
          onClick={() => handleNavigate('analyzer')}
          icon={<LayoutDashboard size={14} />}
          label="Analyzer"
        />
        <NavButton 
          active={active === 'history'} 
          onClick={() => handleNavigate('history')}
          icon={<History size={14} />}
          label="History"
        />
        <div className="w-px h-4 bg-black/10 mx-2" />
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Exit</span>
        </button>
      </nav>

      <div className="hidden xl:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-mono font-bold text-black/20 uppercase tracking-widest">Network_Status</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-black/60 uppercase tracking-widest font-mono">Secure_Link: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all
        ${active 
          ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
          : 'text-black/40 hover:text-black hover:bg-white/50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
