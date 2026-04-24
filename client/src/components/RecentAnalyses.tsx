import React from 'react';
import { History, ArrowRight } from 'lucide-react';

interface RecentAnalysis {
  _id: string;
  productivityScore: number;
  topDistractions: string[];
  createdAt: string;
}

interface RecentAnalysesProps {
  analyses: RecentAnalysis[];
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ analyses }) => {
  if (!analyses || analyses.length === 0) return null;

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-2xl p-6 mt-8 animate-fade-in-slow">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <History className="w-5 h-5 text-indigo-500" />
        <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] tracking-tight">Recent Analyses</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {analyses.map((analysis) => {
          const date = new Date(analysis.createdAt);
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }).format(date);

          const isExcellent = analysis.productivityScore >= 75;
          const isGood = analysis.productivityScore >= 50 && analysis.productivityScore < 75;
          const scoreColor = isExcellent ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : isGood ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-rose-600 bg-rose-50 border-rose-100';

          return (
            <div key={analysis._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-col shrink-0 ${scoreColor}`}>
                  <span className="text-[16px] font-bold leading-none">{analysis.productivityScore}</span>
                  <span className="text-[9px] font-medium uppercase mt-0.5 opacity-80">Score</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-[var(--color-text-primary)]">
                    {analysis.topDistractions.length > 0 ? `Distracted by ${analysis.topDistractions[0]}` : 'Highly focused session'}
                  </span>
                  <span className="text-[12px] text-slate-500 mt-0.5">
                    {formattedDate}
                  </span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-[var(--color-accent)] hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
