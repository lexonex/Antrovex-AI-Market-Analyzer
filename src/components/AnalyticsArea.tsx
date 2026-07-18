import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  ChevronRight, 
  Scan,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnalysisResult } from '../types/analysis';

interface AnalyticsAreaProps {
  result: AnalysisResult | null;
}

export function AnalyticsArea({ result }: AnalyticsAreaProps) {
  const [showCalibration, setShowCalibration] = useState(false);

  if (!result) {
    return (
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
          Initialize Institutional V7 telemetry to generate dynamic execution signals.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Result Header */}
      <div className="hud-glass p-8 md:p-12 hud-border relative overflow-hidden bg-white shadow-2xl">
        <div className={cn(
          "absolute -top-32 -right-32 w-80 h-80 blur-[140px] transition-colors duration-1000",
          result.signal === 'UP' ? "bg-emerald-500/10" : 
          result.signal === 'DOWN' ? "bg-red-500/10" : "bg-orange-500/10"
        )} />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-8">
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
              <div className="flex items-baseline gap-4">
                <h2 className={cn(
                  "text-7xl md:text-9xl font-black italic tracking-tighter leading-none text-black"
                )}>
                  {result.signal === 'UP' ? 'CALL' : 
                   result.signal === 'DOWN' ? 'PUT' : 'WAIT'}
                </h2>
                {result.signal !== 'NO_TRADE' && (
                  <div className="flex flex-col">
                    <span className="text-orange-500 font-black text-2xl tracking-tighter">{result.expiry}</span>
                    <span className="text-black/20 text-[8px] font-black uppercase tracking-widest">Expiry</span>
                  </div>
                )}
              </div>
              {result.signal === 'NO_TRADE' && result.reason && (
                <p className="text-[10px] font-mono font-bold text-orange-600 mt-2">CAUSE: {result.reason}</p>
              )}
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mb-2 block">Accuracy_Conf</span>
              <div className="flex items-baseline md:justify-end gap-2">
                <span className="text-6xl md:text-7xl font-black tabular-nums text-black">{result.confidence}</span>
                <span className="text-xl md:text-2xl font-bold text-orange-500">%</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded text-[9px] font-black uppercase tracking-widest text-black/40">
                Bias: <span className={cn(
                  result.institutionalBias === 'BULLISH' ? "text-emerald-600" : 
                  result.institutionalBias === 'BEARISH' ? "text-red-600" : "text-orange-600"
                )}>{result.institutionalBias}</span>
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
                 result.validation.passed ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
               )}>
                 {result.validation.passed ? 'Self_Validation: Passed' : 'Self_Validation: Failed'}
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono">
            <SpecCard label="TREND_STRENGTH" value={result.trendStrength} />
            <SpecCard label="EXPIRY_TIME" value={result.expiry} />
            <SpecCard label="MARKET_BIAS" value={result.institutionalBias} />
            <SpecCard label="PRICE_ACTION" value={result.priceActionState} />
            <SpecCard label="MOMENTUM_VE" value={result.momentumState} />
            <SpecCard label="CANDLE_PATTERN" value={result.candlestickPattern} />
            <SpecCard label="CONFLUENCE" value={`${result.confluenceScore}/100`} />
            <SpecCard label="KNOWL_MATCH" value={`${result.knowledgeMatchScore}%`} />
            <SpecCard label="EXPIRY_RULE" value={result.expiryReason} />
            <SpecCard label="VALID_STATUS" value={result.validation.passed ? "PASSED" : "FAILED"} />
          </div>

          <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center">
            <button 
              onClick={() => setShowCalibration(!showCalibration)}
              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
            >
              {showCalibration ? 'Hide_Calibration_Matrix' : 'Show_Calibration_Matrix'}
            </button>
          </div>

          <AnimatePresence>
            {showCalibration && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 space-y-8 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">Engine_Score_Breakdown</h4>
                    <div className="space-y-3">
                      {result.confidenceBreakdown.map(comp => (
                        <div key={comp.name} className="flex flex-col gap-1.5 p-3 bg-black/[0.02] rounded border border-black/5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-black/60">{comp.name}</span>
                            <span className="font-mono text-black/40">Score: {comp.score} | Weight: {comp.weight}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500/40" style={{ width: `${comp.score}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-orange-600">+{comp.contribution.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">Risk_Audit_Factors</h4>
                    <div className="space-y-3">
                      {result.risk.factors.length > 0 ? result.risk.factors.map((factor, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-red-500/[0.02] rounded border border-red-500/10">
                          <span className="text-[10px] font-bold text-black/60">{factor.name}</span>
                          <span className="text-[10px] font-bold text-red-600">-{factor.penalty}%</span>
                        </div>
                      )) : (
                        <div className="p-3 bg-emerald-500/[0.02] rounded border border-emerald-500/10 text-[10px] text-emerald-600 font-bold">
                          NO_RISK_FACTORS_DETECTED
                        </div>
                      )}
                      
                      <div className="pt-4 mt-4 border-t border-black/5">
                        <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">Analysis_Audit_Trail</h4>
                        <div className="space-y-1.5 font-mono text-[9px] text-black/40">
                          {result.audit.map((step, i) => (
                            <div key={i} className="flex gap-2">
                              <span>[{i+1}]</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </motion.div>
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
