import { motion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Minus, 
  AlertTriangle, Download, Copy
} from 'lucide-react';
import { AnalysisResult } from '../types/analysis';
import { cn } from '../lib/utils';

interface AnalysisDisplayProps {
  data: AnalysisResult;
}

export default function AnalysisDisplay({ data }: AnalysisDisplayProps) {
  if (!data.validChart) {
    return (
      <section className="col-span-8 bg-[#16191E] border border-white/5 rounded-xl flex flex-col h-full items-center justify-center p-12 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6 opacity-50" />
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Invalid Chart Data</h2>
        <p className="text-slate-400 max-w-md">
          The AI was unable to identify a standard trading chart in this image. Please ensure your screenshot includes candlesticks or clear price action.
        </p>
      </section>
    );
  }

  const getPredictionColor = () => {
    switch (data.prediction) {
      case 'UP': return 'text-green-500';
      case 'DOWN': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getPredictionIcon = () => {
    switch (data.prediction) {
      case 'UP': return <TrendingUp className="w-8 h-8 text-green-500" />;
      case 'DOWN': return <TrendingDown className="w-8 h-8 text-red-500" />;
      default: return <Minus className="w-8 h-8 text-slate-400" />;
    }
  };

  const getRiskColor = (risk: string | undefined) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-500 border-white/10';
    }
  };

  return (
    <section className="col-span-8 bg-[#16191E] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
      {/* Result Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F1115]/50">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Analysis Summary</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">
            AI Logic Verification • Confidence: <span className="text-green-400 font-bold">{data.confidence}%</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-1">Risk Rating</div>
          <span className={cn("px-3 py-1 rounded border font-bold text-[10px] uppercase tracking-wider", getRiskColor(data.risk))}>
            {data.risk}
          </span>
        </div>
      </div>

      {/* Analysis Scrollable Content */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6 overflow-y-auto custom-scrollbar bg-[#16191E]">
        {/* Key Prediction */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-[#0A0B0E] p-6 rounded-lg border border-white/5 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Primary Bias</span>
            <div className="flex items-center gap-3">
              {getPredictionIcon()}
              <span className={cn("text-3xl font-black tracking-tighter", getPredictionColor())}>
                {data.prediction === 'UP' ? 'BULLISH (BUY)' : data.prediction === 'DOWN' ? 'BEARISH (SELL)' : 'NEUTRAL'}
              </span>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-white/10 hidden md:block"></div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Scenario</span>
            <span className="text-sm text-white font-semibold">{data.primaryScenario?.split(': ')[0]}</span>
          </div>
        </motion.div>

        {/* Technical Details Grid */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Market Structure</h3>
            <div className="flex flex-wrap gap-2">
              {data.analysis?.marketStructure?.slice(0, 3).map((item, i) => (
                <span key={i} className="bg-blue-500/10 text-blue-300 text-[9px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase">
                  {item}
                </span>
              ))}
              {data.analysis?.trend?.slice(0, 1).map((item, i) => (
                <span key={i} className="bg-purple-500/10 text-purple-300 text-[9px] font-bold px-2 py-1 rounded border border-purple-500/20 uppercase">
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg border border-white/5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Logic Explanation</h3>
            <p className="text-[11px] leading-relaxed text-slate-300 italic">
              "{data.reason}"
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1F2329] p-4 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 font-bold block mb-2 uppercase tracking-widest">Support</span>
              <ul className="text-[11px] font-mono text-green-400 space-y-1.5">
                {data.analysis?.support?.slice(0, 2).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#1F2329] p-4 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 font-bold block mb-2 uppercase tracking-widest">Resistance</span>
              <ul className="text-[11px] font-mono text-red-400 space-y-1.5">
                {data.analysis?.resistance?.slice(0, 2).map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg">
            <h3 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">Alternative Scenario</h3>
            <p className="text-[11px] text-yellow-200/70 leading-relaxed">{data.alternativeScenario}</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-[#0F1115] border-t border-white/5 flex justify-end gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 border border-white/10 rounded hover:bg-white/5 transition-all uppercase tracking-tight">
          <Download className="w-3 h-3" />
          Download PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-white bg-blue-600 rounded hover:bg-blue-500 transition-all uppercase tracking-tight shadow-lg shadow-blue-900/20">
          <Copy className="w-3 h-3" />
          Copy Insights
        </button>
      </div>
    </section>
  );
}
