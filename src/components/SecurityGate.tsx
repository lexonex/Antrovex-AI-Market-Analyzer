import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, Cpu, Activity, ChevronRight } from 'lucide-react';

interface SecurityGateProps {
  onUnlock: () => void;
}

export default function SecurityGate({ onUnlock }: SecurityGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    
    // Artificial delay for "Security Processing" vibe
    setTimeout(() => {
      if (password === '1212') {
        onUnlock();
      } else {
        setError(true);
        setIsChecking(false);
        setPassword('');
        setTimeout(() => setError(false), 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white border border-black/5 shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Technical Header */}
          <div className="flex items-center justify-between mb-12 border-b border-black/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Lock size={18} className="text-orange-500" />
              </div>
              <div>
                <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-black">Security_Access</h1>
                <p className="text-[9px] font-mono text-black/30 uppercase tracking-widest mt-1">Protocol: Level_4_Auth</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-mono text-black/20 block">ENCRYPTION: AES_256</span>
              <span className="text-[8px] font-mono text-black/20 block">SECURE_TUNNEL: ON</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Credential_Input</label>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/5" />
                  ))}
                </div>
              </div>
              
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full h-16 bg-black/[0.02] border-b-2 border-black/10 px-6 font-mono text-xl tracking-[0.5em] focus:outline-none focus:border-orange-500 transition-all placeholder:text-black/5"
                  autoFocus
                  disabled={isChecking}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                  <Activity size={16} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded"
                  >
                    <ShieldAlert size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Access_Denied: Invalid_Sequence</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isChecking || !password}
              className="w-full h-14 bg-black text-white relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  {isChecking ? 'Verifying_Identity...' : 'Initialize_Access'}
                </span>
                {!isChecking && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </div>
            </button>
          </form>

          {/* System Footer Info */}
          <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center opacity-30">
            <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span className="text-[8px] font-mono uppercase tracking-widest">Hardware_Locked: ID_882</span>
            </div>
            <div className="text-[8px] font-mono">ST: 121.0.1.9</div>
          </div>
        </div>

        {/* Outer Accents */}
        <div className="absolute -top-1 -right-1 w-12 h-12 border-t border-r border-black/10 pointer-events-none"></div>
        <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b border-l border-black/10 pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
