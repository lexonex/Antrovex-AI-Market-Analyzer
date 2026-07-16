import Header from './components/Header';
import { Dashboard } from './components/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-orange-500/30">
      <Header />
      
      <main className="flex-1 overflow-x-hidden">
        <Dashboard />
      </main>

      {/* Bottom Info Rail */}
      <footer className="h-10 bg-white border-t border-black/5 flex items-center justify-between px-6 shrink-0 relative z-50">
        <div className="flex gap-6 text-[9px] text-black/40 font-mono uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
            System: Active_Link_M3
          </span>
          <span className="hidden md:inline">Protocol: Secure_JSON_HTTPS</span>
          <span className="hidden md:inline">Node: Global_Edge_A1</span>
        </div>
        <div className="text-[9px] text-black/20 uppercase font-black tracking-[0.3em]">
          Antrovex_HUD • © 2026
        </div>
      </footer>
    </div>
  );
}
