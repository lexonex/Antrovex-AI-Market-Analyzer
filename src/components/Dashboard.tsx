import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check
} from 'lucide-react';
import { AnalysisResult, HistoryItem } from '../types/analysis';
import { UploadArea } from './UploadArea';
import { AnalyticsArea } from './AnalyticsArea';
import { HistoryArea } from './HistoryArea';
import { FirestoreService } from '../services/db/FirestoreService';
import { cn } from '../lib/utils';

export function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'analyzer' | 'history'>('analyzer');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedOutcome, setSavedOutcome] = useState<'PROFIT' | 'LOSS' | 'SKIPPED' | null>(null);

  // Load history from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const logs = await FirestoreService.getLogs();
        setHistory(logs);
      } catch (e) {
        console.error("Failed to load history from Firestore, trying localStorage", e);
        const savedHistory = localStorage.getItem('antrovex_history');
        if (savedHistory) {
          try {
            setHistory(JSON.parse(savedHistory));
          } catch (err) {
            console.error("Failed to parse local history fallback", err);
          }
        }
      }
    };
    loadData();
    
    // Listen for custom events (navigation only)
    const handleViewChange = (e: any) => {
      if (e.detail) setView(e.detail);
    };
    window.addEventListener('antrovex-view-change', handleViewChange);
    return () => {
      window.removeEventListener('antrovex-view-change', handleViewChange);
    };
  }, []);

  // Save history to localStorage as secondary backup
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('antrovex_history', JSON.stringify(history));
    }
  }, [history]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("FILE_TOO_LARGE: Please upload an image smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setError(null);
        setResult(null);
        setSavedOutcome(null);
        setView('analyzer');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeChart = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setSavedOutcome(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const cleanBase64 = preview.includes(';base64,') 
        ? preview.split(';base64,')[1] 
        : preview;

      const response = await fetch('/api/analyze-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: cleanBase64 }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`SERVER_ERROR: Received non-JSON response. Status: ${response.status}.`);
      }
      
      if (response.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED: System cooldown active.");
      }

      if (!data.success) {
        const errorMsg = typeof data.error === 'string' ? data.error : data.error?.message;
        throw new Error(errorMsg || 'ANALYSIS_INTERRUPTED');
      }
      
      const analysisData = data.data;
      if (!analysisData.validChart) {
        setError("IMAGE_REJECTED: UNABLE_TO_MAP_MARKET_TELEMETRY");
        return;
      }

      setResult(analysisData);
    } catch (err: any) {
      setError(err.name === 'AbortError' ? "REQUEST_TIMEOUT" : err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setSavedOutcome(null);
  };

  const handleOutcomeClick = async (outcome: 'PROFIT' | 'LOSS' | 'SKIPPED') => {
    if (!result || !preview || savedOutcome) return;

    const logData = {
      timestamp: Date.now(),
      result: result,
      outcome: outcome,
      preview: preview
    };

    setSavedOutcome(outcome);

    try {
      const docId = await FirestoreService.addLog(logData);
      const newHistoryItem: HistoryItem = {
        id: docId,
        ...logData
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error("Firestore save failed, fallback to local storage", err);
      const localItem: HistoryItem = {
        id: Date.now().toString(),
        ...logData
      };
      setHistory(prev => [localItem, ...prev]);
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setPreview(item.preview);
    setSavedOutcome(item.outcome);
    setView('analyzer');
  };

  const clearHistory = async () => {
    try {
      await FirestoreService.clearAllLogs();
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear logs in Firestore", e);
      setHistory([]);
    }
  };

  const removeHistoryItem = async (id: string) => {
    try {
      await FirestoreService.deleteLog(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error(`Failed to delete log ${id} in Firestore`, e);
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
      <AnimatePresence mode="wait">
        {view === 'analyzer' ? (
          <motion.div 
            key="analyzer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Data Input */}
            <div className="lg:col-span-5 space-y-6">
              <UploadArea 
                preview={preview}
                analyzing={analyzing}
                onDrop={onDrop}
                onAnalyze={analyzeChart}
                onReset={reset}
                error={error}
              />

              <div className="hud-glass p-6 hud-border">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={16} className="text-black/30" />
                  <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.25em]">System_Parameters</h3>
                </div>
                <div className="space-y-4 font-mono">
                  <SpecRow label="ANALYSIS_TF" value="1M_PRECISION" />
                  <SpecRow label="SIGNAL_PROTOCOL" value={result ? `DYNAMIC_${result.expiry}_EXP` : "DYNAMIC_ANALYSIS"} />
                  <SpecRow label="CO_PROCESSOR" value="IESE_IES_V7" />
                  <SpecRow label="DATA_STREAM" value="LIVE_TELEMETRY" />
                </div>
              </div>

              {/* Dynamic Execution Outcome Controls */}
              <div className="hud-glass p-6 hud-border bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      result ? "bg-orange-500 animate-pulse" : "bg-black/10"
                    )} />
                    <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.25em]">Telemetry_Log_Execution</h3>
                  </div>
                  {savedOutcome && (
                    <span className="text-[8px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Check size={10} className="stroke-[3]" /> Added_to_Log
                    </span>
                  )}
                </div>

                {!result ? (
                  <div className="text-center py-6 border border-dashed border-black/5 rounded-lg bg-black/[0.01]">
                    <p className="text-[10px] font-mono text-black/30 uppercase tracking-[0.15em]">Awaiting_Active_Telemetry</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Visual feedback if already logged */}
                    {savedOutcome ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "p-4 rounded-lg border text-center font-bold font-mono text-[10px] uppercase tracking-wider flex flex-col items-center justify-center gap-2",
                          savedOutcome === 'PROFIT' ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600" :
                          savedOutcome === 'LOSS' ? "bg-red-500/5 border-red-500/10 text-red-600" :
                          "bg-black/[0.02] border-black/5 text-black/40"
                        )}
                      >
                        <div className="flex items-center gap-2 text-[11px] font-black">
                          {savedOutcome === 'PROFIT' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                           savedOutcome === 'LOSS' ? <XCircle className="w-4 h-4 text-red-500" /> :
                           <AlertCircle className="w-4 h-4 text-black/30" />}
                          RECORD_LOGGED: {savedOutcome}
                        </div>
                        <span className="text-[8px] opacity-60">Sequence completed. Awaiting new telemetry upload.</span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => handleOutcomeClick('PROFIT')}
                            className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 active:scale-[0.98] transition-all rounded shadow-md shadow-emerald-500/20 font-bold"
                          >
                            Mark_Profit
                          </button>
                          <button
                            onClick={() => handleOutcomeClick('LOSS')}
                            className="flex items-center justify-center gap-2 py-3.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 active:scale-[0.98] transition-all rounded shadow-md shadow-red-500/20 font-bold"
                          >
                            Mark_Loss
                          </button>
                        </div>
                        <button
                          onClick={() => handleOutcomeClick('SKIPPED')}
                          className="w-full py-3.5 bg-black text-white hover:bg-orange-600 text-[10px] font-black uppercase tracking-[0.3em] active:scale-[0.98] transition-all rounded shadow-md shadow-black/10 font-bold"
                        >
                          Skip_&_Log_Telemetry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Signal Output */}
            <div className="lg:col-span-7">
              <AnalyticsArea result={result} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto w-full"
          >
            <HistoryArea 
              history={history}
              onSelect={selectHistoryItem}
              onClear={clearHistory}
              onRemove={removeHistoryItem}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-[9px] py-1 border-b border-black/[0.02]">
      <span className="text-black/20 tracking-tighter">{label}</span>
      <span className="text-black font-bold">{value}</span>
    </div>
  );
}
