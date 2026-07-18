import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'motion/react';
import { Upload, X, Cpu, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadAreaProps {
  preview: string | null;
  analyzing: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  onAnalyze: () => void;
  onReset: () => void;
  error: string | null;
}

export function UploadArea({ 
  preview, 
  analyzing, 
  onDrop, 
  onAnalyze, 
  onReset, 
  error 
}: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    disabled: analyzing
  } as any);

  return (
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
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-orange-500" />
            <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-orange-500" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-orange-500" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-orange-500" />
          </div>

          {!analyzing && (
            <button 
              onClick={onReset}
              className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-red-500 text-white rounded-full border border-white/10 transition-all opacity-0 group-hover/preview:opacity-100 scale-90 group-hover/preview:scale-100"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 relative z-10">
        {preview && !analyzing && (
          <button 
            onClick={onAnalyze}
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
  );
}
