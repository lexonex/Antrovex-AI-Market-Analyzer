import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Maximize2,
  Lock
} from 'lucide-react';
import { HistoryItem } from '../types/analysis';
import { cn } from '../lib/utils';

interface HistoryAreaProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function HistoryArea({ 
  history, 
  onSelect, 
  onClear, 
  onRemove,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}: HistoryAreaProps) {
  const [selectedLog, setSelectedLog] = useState<HistoryItem | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Deletion Authentication states
  const [authAction, setAuthAction] = useState<'single' | 'all' | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    setTimeout(() => {
      if (deletePassword === '85660') {
        if (authAction === 'all') {
          onClear();
        } else if (authAction === 'single' && targetId) {
          onRemove(targetId);
        }
        setAuthAction(null);
        setTargetId(null);
        setDeletePassword('');
        setAuthError(false);
        setIsVerifying(false);
      } else {
        setAuthError(true);
        setIsVerifying(false);
        setDeletePassword('');
        setTimeout(() => setAuthError(false), 2000);
      }
    }, 600);
  };

  // Calculate Analytics
  const stats = history.reduce((acc, curr) => {
    if (curr.outcome === 'PROFIT') acc.profits++;
    if (curr.outcome === 'LOSS') acc.losses++;
    if (curr.outcome === 'SKIPPED') acc.skips++;
    
    if (curr.result.signal === 'UP' || curr.result.signal === 'DOWN') {
      acc.totalTrades++;
    } else {
      acc.totalWait++;
    }
    return acc;
  }, { profits: 0, losses: 0, skips: 0, totalTrades: 0, totalWait: 0 });

  const winRate = stats.totalTrades > 0 
    ? ((stats.profits / (stats.profits + stats.losses || 1)) * 100).toFixed(1) 
    : '0.0';

  if (history.length === 0) {
    return (
      <div className="hud-glass p-8 hud-border bg-white/40 flex flex-col items-center justify-center min-h-[300px] text-center">
        <History className="text-black/5 mb-6" size={48} strokeWidth={1} />
        <h3 className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em] mb-2">No_History_Records</h3>
        <p className="text-[9px] font-mono text-black/20 uppercase tracking-widest">Awaiting first market analysis data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard Header */}
      <div className="hud-glass hud-border bg-white p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <BarChart3 size={120} />
        </div>
        
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <h3 className="text-[11px] font-black text-black uppercase tracking-[0.3em]">Performance_Analytics_Matrix</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <StatBox label="Execution_Signals" value={stats.totalTrades} subLabel="Total Put/Call" />
          <StatBox label="Wait_Sequences" value={stats.skips} subLabel="Total Skipped" color="text-orange-500" />
          <StatBox label="Profit_Mark" value={stats.profits} subLabel="Successful" color="text-emerald-500" icon={<ArrowUpRight size={12} />} />
          <StatBox label="Loss_Mark" value={stats.losses} subLabel="Unsuccessful" color="text-red-500" icon={<ArrowDownRight size={12} />} />
          <div className="p-4 bg-black rounded-lg text-white">
            <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Performance_Index</p>
            <p className="text-2xl font-black italic tabular-nums">{winRate}%</p>
            <p className="text-[8px] font-mono text-white/20 mt-1 uppercase">Accuracy_Rating</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="hud-glass hud-border bg-white overflow-hidden shadow-xl">
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.01]">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-orange-500" />
            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.25em]">Telemetry_Log_History</h3>
          </div>
          <button 
            onClick={() => {
              setAuthAction('all');
              setTargetId(null);
              setDeletePassword('');
              setAuthError(false);
            }}
            className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear_All_Records
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto divide-y divide-black/5">
          {history.map((item) => (
            <div 
              key={item.id}
              className="p-5 hover:bg-black/[0.01] transition-all group relative cursor-pointer"
              onClick={() => setSelectedLog(item)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded border border-black/5 overflow-hidden shrink-0 relative bg-black/5 shadow-inner">
                  <img src={item.preview} alt="Log" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  <div className={cn(
                    "absolute inset-0 opacity-10",
                    item.result.signal === 'UP' ? "bg-emerald-500" : 
                    item.result.signal === 'DOWN' ? "bg-red-500" : "bg-orange-500"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[11px] font-black uppercase tracking-tighter flex items-center gap-1.5",
                        item.result.signal === 'UP' ? "text-emerald-600" : 
                        item.result.signal === 'DOWN' ? "text-red-600" : "text-orange-600"
                      )}>
                        {item.result.signal === 'UP' ? <TrendingUp size={14} /> : 
                         item.result.signal === 'DOWN' ? <TrendingDown size={14} /> : <ShieldAlert size={14} />}
                        {item.result.signal} {item.result.signal !== 'NO_TRADE' && `(${item.result.expiry})`}
                      </span>
                      
                      {/* Outcome Badge */}
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                        item.outcome === 'PROFIT' ? "bg-emerald-500/10 text-emerald-600" : 
                        item.outcome === 'LOSS' ? "bg-red-500/10 text-red-600" : "bg-black/5 text-black/40"
                      )}>
                        {item.outcome === 'PROFIT' && <CheckCircle2 size={10} />}
                        {item.outcome === 'LOSS' && <XCircle size={10} />}
                        {item.outcome}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-black/20 font-bold">
                      {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-bold text-black/70 truncate">
                      Confidence: {item.result.confidence}% | {item.result.marketRegime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setAuthAction('single');
                      setTargetId(item.id);
                      setDeletePassword('');
                      setAuthError(false);
                    }}
                    className="p-2 text-black/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="p-6 text-center bg-black/[0.01]">
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2.5 bg-black hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.25em] transition-all rounded disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isLoadingMore ? 'Loading_More...' : 'Load_More_Records'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Detail Window (Modal) & Fullscreen Image Lightbox */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.01]">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-orange-500" />
                  <span className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.2em]">Log_ID: {selectedLog.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Main Row: Image & Key Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Image Container with click-to-expand option */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40 font-mono">Telemetry_Screenshot</span>
                    <div 
                      onClick={() => setFullscreenImage(selectedLog.preview)}
                      className="group relative cursor-zoom-in rounded-xl border border-black/5 overflow-hidden bg-black/5 shadow-inner aspect-[4/3] flex items-center justify-center"
                    >
                      <img 
                        src={selectedLog.preview} 
                        alt="Telemetry Log Screenshot" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-black shadow-lg">
                          <Maximize2 size={12} /> Click_To_Expand
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* General Core Metrics */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono font-bold text-black/20 uppercase tracking-widest">Signal_Output</span>
                        <span className={cn(
                          "text-2xl font-black italic tracking-tight",
                          selectedLog.result.signal === 'UP' ? "text-emerald-500" :
                          selectedLog.result.signal === 'DOWN' ? "text-red-500" : "text-orange-500"
                        )}>
                          {selectedLog.result.signal}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-mono font-bold text-black/20 uppercase tracking-widest">Trade_Outcome</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1",
                          selectedLog.outcome === 'PROFIT' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : 
                          selectedLog.outcome === 'LOSS' ? "bg-red-500/10 text-red-600 border border-red-500/20" : 
                          "bg-black/5 text-black/40 border border-black/5"
                        )}>
                          {selectedLog.outcome === 'PROFIT' && <CheckCircle2 size={12} />}
                          {selectedLog.outcome === 'LOSS' && <XCircle size={12} />}
                          {selectedLog.outcome}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <DetailSpecBox label="Confidence" value={`${selectedLog.result.confidence}%`} />
                      <DetailSpecBox label="Expiry" value={selectedLog.result.expiry || 'N/A'} />
                      <DetailSpecBox label="Institutional_Bias" value={selectedLog.result.institutionalBias} />
                      <DetailSpecBox label="Market_Regime" value={selectedLog.result.marketRegime} />
                    </div>

                    <div className="p-4 bg-black/[0.02] border border-black/5 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] font-mono text-black/40 uppercase">
                        <span>Trend_Strength:</span>
                        <span className="font-bold text-black">{selectedLog.result.trendStrength || 'N/A'}</span>
                      </div>
                      <div className="w-full h-px bg-black/5" />
                      <div className="flex justify-between items-center text-[9px] font-mono text-black/40 uppercase">
                        <span>Price_Action:</span>
                        <span className="font-bold text-black">{selectedLog.result.priceActionState || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Reasoning */}
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/40 font-mono">Technical_Reasoning</span>
                  <div className="p-5 bg-black/[0.01] border-l-4 border-orange-500 rounded-r-lg">
                    <p className="text-[12px] font-mono text-black/70 leading-relaxed italic">
                      "{selectedLog.result.reason}"
                    </p>
                  </div>
                </div>

                {/* Audit Checklist */}
                {selectedLog.result.audit && selectedLog.result.audit.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40 font-mono">Security_Audit_Log</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedLog.result.audit.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 bg-black/[0.01] border border-black/5 rounded-lg text-[10px] font-mono text-black/60 leading-tight">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0 mt-1" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-black/[0.01] border-t border-black/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-black/30 uppercase font-bold">
                  Telemetry_Log_Registered: {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-2.5 bg-black text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-orange-600 transition-colors rounded"
                >
                  Close_Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setFullscreenImage(null)}
          >
            <button 
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <X size={24} />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-full max-h-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={fullscreenImage} 
                alt="Full Telemetry Shot" 
                className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" 
              />
            </motion.div>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black font-mono mt-4">
              Click_Anywhere_To_Close_Fullscreen
            </span>
          </motion.div>
        )}

        {authAction && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white border border-black/10 shadow-2xl p-8 relative overflow-hidden rounded-2xl"
            >
              {/* Technical Header */}
              <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded flex items-center justify-center border border-red-500/20">
                    <Lock size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">Delete_Authorization</h1>
                    <p className="text-[9px] font-mono text-black/30 uppercase tracking-widest mt-0.5">Protocol: Secure_Purge_Gate</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAuthAction(null)}
                  className="p-1.5 hover:bg-black/5 rounded-full text-black/40 hover:text-black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Enter Security PIN</label>
                    <span className="text-[8px] font-mono text-red-500 uppercase tracking-wider font-bold">DESTRUCTION_INTEGRITY</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="•••••"
                      className="w-full h-14 bg-black/[0.02] border-b-2 border-black/10 px-5 font-mono text-lg tracking-[0.5em] focus:outline-none focus:border-red-500 transition-all placeholder:text-black/5"
                      autoFocus
                      disabled={isVerifying}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {authError && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
                      >
                        <ShieldAlert size={14} className="shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Access_Denied: Invalid_PIN</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthAction(null)}
                    className="flex-1 py-3 bg-black/5 text-black/60 hover:bg-black/10 text-[9px] font-black uppercase tracking-[0.2em] transition-colors rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || !deletePassword}
                    className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-black uppercase tracking-[0.2em] transition-colors rounded shadow-md shadow-red-500/10"
                  >
                    {isVerifying ? 'Verifying...' : 'Authorize_Purge'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, subLabel, color = "text-black", icon }: { label: string, value: number, subLabel: string, color?: string, icon?: React.ReactNode }) {
  return (
    <div className="p-4 bg-black/[0.02] border border-black/5 rounded-lg hover:border-black/10 transition-colors">
      <p className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className={cn("text-2xl font-black italic tabular-nums", color)}>{value}</p>
        {icon && <div className={color}>{icon}</div>}
      </div>
      <p className="text-[8px] font-mono text-black/20 mt-1 uppercase">{subLabel}</p>
    </div>
  );
}

function DetailSpecBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-black/[0.01] border border-black/5 rounded-lg">
      <p className="text-[8px] font-mono font-bold text-black/20 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[11px] font-black text-black uppercase tracking-tight">{value}</p>
    </div>
  );
}

