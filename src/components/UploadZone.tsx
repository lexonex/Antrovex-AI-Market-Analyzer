import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadZoneProps {
  onUpload: (base64: string) => void;
  isLoading: boolean;
}

export default function UploadZone({ onUpload, isLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be less than 4MB');
      return;
    }

    setError(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-[#16191E] border border-white/5 rounded-xl p-6 flex-1 flex flex-col min-h-[400px]">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">Market Snapshot</h2>
        
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !isLoading && document.getElementById('file-upload')?.click()}
          className={cn(
            "flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer",
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-[#0A0B0E]/50 hover:border-white/20",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input 
            id="file-upload"
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={onSelect}
            disabled={isLoading}
          />
          
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>
          
          <div className="text-center px-4">
            <p className="text-sm font-medium text-white">Drag & drop chart image</p>
            <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 4MB)</p>
          </div>
          
          <button 
            className="mt-2 px-4 py-2 bg-white text-black text-[10px] font-bold rounded hover:bg-slate-200 transition-colors uppercase tracking-tight"
            disabled={isLoading}
          >
            Select File
          </button>
        </div>

        <AnimatePresence>
          {preview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 bg-[#1F2329] border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded border border-white/5 overflow-hidden">
                  <img src={preview} alt="Thumb" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-white truncate max-w-[120px]">{fileName}</p>
                  <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isLoading ? '70%' : '100%' }}
                      className={cn("h-full rounded-full transition-all duration-500", isLoading ? "bg-blue-400" : "bg-green-500")}
                    ></motion.div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-mono text-green-400">{isLoading ? 'Processing' : '100%'}</span>
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); }} className="text-slate-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-[10px] uppercase font-bold tracking-wider">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>

      <button 
        onClick={() => !isLoading && preview && onUpload(preview)}
        disabled={isLoading || !preview}
        className={cn(
          "w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 uppercase tracking-[0.15em] text-xs transition-all",
          (isLoading || !preview) && "opacity-50 cursor-not-allowed bg-slate-800 shadow-none"
        )}
      >
        {isLoading ? 'Analyzing Structure...' : 'Analyze Market Structure'}
      </button>
    </div>
  );
}
