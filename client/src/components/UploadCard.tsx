import React, { useState, useRef } from 'react';
import { Info, CloudUpload, Sparkles } from 'lucide-react';

interface UploadCardProps {
  onAnalyze: (data: string) => void;
  isLoading: boolean;
}

const SAMPLE_DATA = [
  { "url": "youtube.com", "visitCount": 10 },
  { "url": "github.com", "visitCount": 5 },
  { "url": "instagram.com", "visitCount": 8 },
  { "url": "leetcode.com", "visitCount": 4 }
];

export const UploadCard: React.FC<UploadCardProps> = ({ onAnalyze, isLoading }) => {
  const [inputData, setInputData] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUseSample = () => {
    setInputData(JSON.stringify(SAMPLE_DATA, null, 2));
  };

  const handleAnalyze = () => {
    if (!inputData.trim()) return;
    onAnalyze(inputData);
  };

  const processFile = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      alert("Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setInputData(content);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-2xl p-6 sm:p-8 transition-all">
        <input 
          type="file" 
          accept=".json,application/json" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center mb-8 transition-all duration-200 cursor-pointer group
            ${isDragging 
              ? 'border-[var(--color-accent)] bg-indigo-50/50 scale-[1.02]' 
              : 'border-slate-200 hover:border-[var(--color-accent)] hover:bg-indigo-50/30'
            }`}
        >
          <div className={`w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 transition-transform duration-200 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
            <CloudUpload className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1">
            {isDragging ? 'Drop JSON file now' : 'Click or drag JSON file to upload'}
          </h3>
          <p className="text-[14px] text-[var(--color-text-secondary)]">
            Supports standard Chrome history export formats
          </p>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-[var(--color-border)]"></div>
          <span className="text-[13px] text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">or paste directly</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--color-border)] to-[var(--color-border)]"></div>
        </div>
        <div className="mb-6 relative">
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='[\n  {\n    "url": "youtube.com",\n    "visitCount": 6\n  }\n]'
            className="w-full h-36 bg-slate-50/50 border border-[var(--color-border)] rounded-xl p-4 text-[14px] font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] focus:bg-white resize-none shadow-inner transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUseSample}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[var(--color-border)] shadow-sm hover:bg-slate-50 hover:border-slate-300 text-[var(--color-text-primary)] text-[14px] font-medium rounded-xl transition-all"
          >
            Use sample data
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputData.trim()}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 text-white text-[15px] font-medium rounded-xl disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isLoading ? 'Analyzing History...' : 'Analyze Browsing'}
          </button>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <div className="mt-0.5 shrink-0">
          <Info className="w-4 h-4 text-indigo-500" />
        </div>
        <p className="text-[13px] text-indigo-700 leading-relaxed font-medium">
          Time is estimated based on browsing frequency, not exact tracking. Each visit is treated as ~2 minutes of engagement.
        </p>
      </div>
    </div>
  );
};
