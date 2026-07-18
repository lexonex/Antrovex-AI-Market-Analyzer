import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  X, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  Target,
  Scan,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnalysisResult } from '../types/analysis';

export function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("FILE_TOO_LARGE: Please upload an image smaller than 4MB to ensure successful transmission.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    disabled: analyzing
  } as any);

  const analyzeChart = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      // Clean base64 for API
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
        throw new Error(`SERVER_ERROR: Received non-JSON response. Status: ${response.status}. Body: ${text.substring(0, 100)}...`);
      }
      
      if (response.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED: System is currently on a cooldown. Please wait about 60 seconds before trying again.");
      }

      if (!data.success) {
        const errorMsg = typeof data.error === 'string' ? data.error : data.error?.message;
        throw new Error(errorMsg || 'ANALYSIS_INTERRUPTED: CORE_FAILURE');
      }
      
      const analysisData = data.data;
      if (!analysisData.validChart) {
        setError("IMAGE_REJECTED: UNABLE_TO_MAP_MARKET_TELEMETRY");
        return;
      }

      setResult(analysisData);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("REQUEST_TIMEOUT: The server took too long to respond.");
      } else {
        setError(err.message);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Data Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="hud-glass hud-border p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] -rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black/80">Optical_Source_Link</h2>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-black/10 rounded-full" />
                ))}
              </div>
            </div>

            {!preview ? (
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed border-black/10 rounded-xl p-16 text-center cursor-pointer transition-all relative overflow-hidden group/dropzone",
                  isDragActive ? "bg-orange-500/10 border-orange-500/50 scale-[0.99]" : "bg-black/[0.01] hover:bg-black/[0.02]"
                )}
              >
                <input {...getInputProps()} />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white border border-black/5 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover/dropzone:scale-110 group-hover/dropzone:rotate-3 transition-transform duration-500">
                    <Upload className="text-black/20 group-hover/dropzone:text-orange-500 transition-colors" size={32} />
                  </div>
                  <p className="text-black font-black text-[13px] uppercase tracking-[0.3em] mb-3">Initialize_Feed_Sequence</p>
                  <p className="text-black/30 text-[10px] font-mono uppercase tracking-[0.2em]">Drag_Drop_Source // Select_Data_Packet</p>
                </div>
                {isDragActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-orange-500/40 animate-pulse bg-orange-500/10" 
                  />
                )}
              </div>
            ) : (
              <div className="relative rounded-xl border border-black/10 bg-white overflow-hidden shadow-2xl group/preview ring-1 ring-black/5">
                <img src={preview} alt="Buffer" className="w-full h-auto opacity-95 transition-transform duration-1000 group-hover/preview:scale-110" />
                <div className="scanline" />
                
                {/* HUD Corners for Image */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-orange-500" />
                  <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-orange-500" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-orange-500" />
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-orange-500" />
                </div>

                {!analyzing && !result && (
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-red-500 text-white rounded-full border border-white/10 transition-all opacity-0 group-hover/preview:opacity-100 scale-90 group-hover/preview:scale-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 relative z-10">
              {preview && !analyzing && !result && (
                <button 
                  onClick={analyzeChart}
                  className="hud-glow w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black text-[12px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-[0.97]"
                >
                  <Cpu size={16} />
                  Execute_Analysis
                </button>
              )}
              {analyzing && (
                <div className="w-full py-4 bg-black/5 text-black/50 rounded-lg font-black text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 border border-black/10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <Loader2 className="animate-spin" size={16} />
                  Neural_Sync_Active
                </div>
              )}
              {result && (
                <button 
                  onClick={reset}
                  className="w-full py-4 bg-black/5 hover:bg-black/10 text-black/40 rounded-lg font-black text-[12px] uppercase tracking-[0.4em] transition-all border border-black/10"
                >
                  Reset_Matrix
                </button>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-start gap-4"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1.5">System_Interrupt</span>
                  <p className="text-[11px] font-mono leading-relaxed opacity-90">{error}</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="hud-glass p-6 hud-border">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={16} className="text-black/30" />
              <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.25em]">System_Parameters</h3>
            </div>
            <div className="space-y-4 font-mono">
              <SpecRow label="ANALYSIS_TF" value="1M_PRECISION" />
              <SpecRow label="SIGNAL_PROTOCOL" value="BINARY_3M_EXP" />
              <SpecRow label="CO_PROCESSOR" value="INST_V3_ENGINE" />
              <SpecRow label="DATA_STREAM" value="LIVE_TELEMETRY" />
            </div>
          </div>
        </div>

        {/* Right Column: Signal Output */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[580px] flex flex-col items-center justify-center text-center p-12 hud-glass hud-border bg-white/40"
              >
                <div className="relative mb-10">
                  <div className="absolute inset-0 rounded-full bg-orange-500/5 blur-3xl animate-pulse" />
                  <div className="w-24 h-24 border border-black/5 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-orange-500/10 rounded-full animate-[ping_3s_infinite]" />
                    <Target className="text-black/5 relative z-10" size={64} strokeWidth={0.5} />
                  </div>
                </div>
                <h3 className="text-[13px] font-black text-black uppercase tracking-[0.5em] mb-6">Awaiting_Market_Feed</h3>
                <div className="w-20 h-px bg-orange-500/20 mb-6" />
                <p className="text-[11px] font-mono text-black/30 max-w-sm mx-auto leading-loose uppercase tracking-[0.2em]">
                  Initialize Institutional V3 telemetry to generate 3M execution signals.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className="hud-glass p-12 hud-border relative overflow-hidden bg-white shadow-2xl">
                  <div className={cn(
                    "absolute -top-32 -right-32 w-80 h-80 blur-[140px] transition-colors duration-1000",
                    result.signal === 'UP' ? "bg-emerald-500/10" : 
                    result.signal === 'DOWN' ? "bg-red-500/10" : "bg-orange-500/10"
                  )} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-16">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            result.signal === 'UP' ? "bg-emerald-500" : 
                            result.signal === 'DOWN' ? "bg-red-500" : "bg-orange-500"
                          )} />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.3em]",
                            result.signal === 'UP' ? "text-emerald-600" : 
                            result.signal === 'DOWN' ? "text-red-600" : "text-orange-600"
                          )}>Execution_Signal</span>
                        </div>
                        <h2 className={cn(
                          "text-9xl font-black italic tracking-tighter leading-none text-black"
                        )}>
                          {result.signal === 'UP' ? 'CALL' : 
                           result.signal === 'DOWN' ? 'PUT' : 
                           result.signal === 'NO_TRADE' ? 'REJECT' : 'WAIT'}
                        </h2>
                        {result.signal === 'NO_TRADE' && result.noTradeReason && (
                          <p className="text-[10px] font-mono font-bold text-orange-600 mt-2">CAUSE: {result.noTradeReason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mb-2 block">Accuracy_Conf</span>
                        <div className="flex items-baseline justify-end gap-2">
                          <span className="text-7xl font-black tabular-nums text-black">{result.confidence}</span>
                          <span className="text-2xl font-bold text-orange-500">%</span>
                        </div>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded text-[9px] font-black uppercase tracking-widest text-black/40">
                          Quality: <span className={cn(
                            result.signalQuality === 'Excellent' ? "text-emerald-600" : 
                            result.signalQuality === 'Good' ? "text-blue-600" : "text-orange-600"
                          )}>{result.signalQuality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-t border-black/5 pt-12">
                       <MetricValue title="Market_Regime" value={result.marketRegime} />
                       <MetricValue title="Institutional_Structure" value={result.structure} />
                    </div>

                    {/* Probability Engine Output */}
                    <div className="mb-12 border-t border-black/5 pt-8">
                       <div className="flex items-center justify-between mb-4">
                         <h4 className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">Probability_Engine_Output</h4>
                         <div className={cn(
                           "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                           result.selfValidationPassed ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                         )}>
                           {result.selfValidationPassed ? 'Self_Validation: Passed' : 'Self_Validation: Failed'}
                         </div>
                       </div>
                       <div className="grid grid-cols-3 gap-4 font-mono">
                         <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-emerald-600">BULLISH</span>
                             <span>{result.bullishProbability}%</span>
                           </div>
                           <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${result.bullishProbability}%` }} />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-red-600">BEARISH</span>
                             <span>{result.bearishProbability}%</span>
                           </div>
                           <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${result.bearishProbability}%` }} />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-black/40">NEUTRAL</span>
                             <span>{result.neutralProbability}%</span>
                           </div>
                           <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                             <div className="h-full bg-black/20 transition-all duration-1000" style={{ width: `${result.neutralProbability}%` }} />
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-t border-black/5 pt-8 font-mono text-center">
                       <div className="space-y-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Img_Quality</span>
                         <p className={cn("text-[11px] font-bold", result.imageQualityScore > 80 ? "text-emerald-600" : "text-orange-600")}>
                           {result.imageQualityScore}%
                         </p>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Evidence_B/B</span>
                         <p className="text-[11px] font-bold text-black/80">
                           <span className="text-emerald-600">{result.bullishEvidenceCount}</span>
                           <span className="text-black/20 mx-1">/</span>
                           <span className="text-red-600">{result.bearishEvidenceCount}</span>
                         </p>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Contradiction</span>
                         <p className={cn("text-[11px] font-bold", result.contradictionScore > 30 ? "text-red-600" : "text-emerald-600")}>
                           {result.contradictionScore}%
                         </p>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-black/30">Conf_Score</span>
                         <p className="text-[11px] font-bold text-black/80">{result.confluenceScore}/100</p>
                       </div>
                    </div>

                    <div className="p-6 bg-black/[0.01] border-l-4 border-orange-500 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Scan size={14} className="text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/40">Technical_Reasoning</span>
                      </div>
                      <p className="text-[12px] font-mono text-black/70 leading-relaxed italic">
                        "{result.reason}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Grid */}
                <div className="hud-glass p-8 hud-border shadow-sm bg-white/40">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">Institutional_Telemetry</h3>
                    <div className="flex gap-1">
                      <div className="w-8 h-1 bg-orange-500" />
                      <div className="w-4 h-1 bg-black/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                    <SpecCard label="TREND_STRENGTH" value={result.trendStrength} />
                    <SpecCard label="LIQUIDITY_MAP" value={result.liquidityStatus} />
                    <SpecCard label="PRICE_ACTION" value={result.priceActionState} />
                    <SpecCard label="MOMENTUM_VE" value={result.momentumState} />
                    <SpecCard label="RISK_LEVEL" value={result.riskLevel} />
                    <SpecCard label="EXECUTION_RISK" value={result.executionRisk} />
                    <SpecCard label="SUP_STRENGTH" value={result.supportStrength} />
                    <SpecCard label="RES_STRENGTH" value={result.resistanceStrength} />
                    <SpecCard label="KNOWL_MATCH" value={`${result.knowledgeMatchScore}%`} />
                    <SpecCard label="DECISION_FLT" value={result.decisionFilter} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-5 bg-white border border-black/5 group hover:border-orange-500/20 transition-all hover:shadow-md rounded">
      <p className="text-[9px] font-black text-black/20 uppercase mb-3 truncate tracking-tighter group-hover:text-orange-500/40 transition-colors">{label}</p>
      <p className="text-[11px] font-bold text-black/80 line-clamp-2">{value}</p>
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

function MetricValue({ title, value }: { title: string, value: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">{title}</h4>
      <div className="flex gap-3 items-start group">
        <ChevronRight size={10} className="mt-0.5 text-orange-500/40 group-hover:text-orange-500 transition-colors" />
        <p className="text-[12px] font-bold text-black/80 uppercase tracking-tight">{value}</p>
      </div>
    </div>
  );
}
