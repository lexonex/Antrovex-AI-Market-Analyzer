import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import AnalysisDisplay from './components/AnalysisDisplay';
import { apiService } from './services/api';
import { AnalysisResult } from '../types/analysis';
import { AlertCircle, LineChart, ShieldAlert } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const cleanBase64 = base64.includes(';base64,') 
        ? base64.split(';base64,')[1] 
        : base64;
        
      const result = await apiService.analyzeChart({ image: cleanBase64 });
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0B0E] text-[#E2E8F0] font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      <Header />
      
      <main className="flex-1 grid grid-cols-12 p-6 gap-6 overflow-hidden">
        {/* Left Column: Upload */}
        <section className="col-span-12 lg:col-span-4 flex flex-col h-full overflow-hidden">
          <UploadZone onUpload={handleUpload} isLoading={loading} />
        </section>

        {/* Right Column: Results or Empty State */}
        <section className="col-span-12 lg:col-span-8 flex flex-col h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {analysis ? (
              <AnalysisDisplay data={analysis} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#16191E] border border-white/5 rounded-xl flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mb-6 border border-blue-500/10">
                  <LineChart className="w-10 h-10 text-blue-500/40" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Market Analysis Engine</h1>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm">
                  Upload a chart screenshot to the left. Antrovex AI will perform a multi-layer scan of price action, liquidity, and structural shifts.
                </p>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold uppercase tracking-widest"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Bottom Info Rail */}
      <footer className="h-8 bg-black border-t border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex gap-6 text-[9px] text-slate-600 font-mono uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            Engine: V1.2.0-STABLE
          </span>
          <span className="hidden md:inline">Latency: {analysis ? '1.4s' : '--'}</span>
          <span className="hidden md:inline">Region: Global-Edge</span>
        </div>
        <div className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.2em]">
          Antrovex Pro • © 2026
        </div>
      </footer>
    </div>
  );
}
