import React from 'react';

export interface AIAnalysisResponse {
  productivityScore: number;
  totalTime: number;
  productiveTime: number;
  distractingTime: number;
  topDistractions: string[];
  insights: string[];
  suggestions: string[];
}

interface ResultsDashboardProps {
  data: AIAnalysisResponse;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data }) => {
  const isExcellent = data.productivityScore >= 80;
  const isGood = data.productivityScore >= 50 && data.productivityScore < 80;
  const statusColor = isExcellent ? 'text-[#059669] bg-[#059669]/10' : isGood ? 'text-[#D97706] bg-[#D97706]/10' : 'text-[#DC2626] bg-[#DC2626]/10';
  const statusText = isExcellent ? 'Excellent' : isGood ? 'Needs Focus' : 'Distracted';

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-12 items-start">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-[14px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Productivity Score</h3>
              <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
                {statusText}
              </span>
            </div>
            
            <div>
              <div className="text-[56px] font-semibold text-[var(--color-text-primary)] leading-none mb-4 group-hover:scale-105 transform origin-left transition-transform duration-300">
                {data.productivityScore}
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-[var(--color-accent)] transition-all duration-1000 ease-out rounded-full relative overflow-hidden" 
                  style={{ width: `${data.productivityScore}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 flex flex-col">
            <h3 className="text-[14px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-6">Time Breakdown</h3>
            <div className="flex flex-col flex-1 justify-end gap-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-[14px] text-[var(--color-text-secondary)]">Total Logged Time</span>
                <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">{formatTime(data.totalTime)}</span>
              </div>
              
              <div className="flex items-center gap-4 pb-3 border-b border-slate-100 group cursor-default">
                <span className="text-[14px] text-[var(--color-text-secondary)] w-24">Productive</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors" style={{ width: `${(data.productiveTime / Math.max(data.totalTime, 1)) * 100}%` }} />
                </div>
                <span className="text-[14px] font-medium text-[var(--color-text-primary)] min-w-[40px] text-right">{formatTime(data.productiveTime)}</span>
              </div>

              <div className="flex items-center gap-4 group cursor-default">
                <span className="text-[14px] text-[var(--color-text-secondary)] w-24">Distracting</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 group-hover:bg-rose-500 transition-colors" style={{ width: `${(data.distractingTime / Math.max(data.totalTime, 1)) * 100}%` }} />
                </div>
                <span className="text-[14px] font-medium text-[var(--color-text-primary)] min-w-[40px] text-right">{formatTime(data.distractingTime)}</span>
              </div>

            </div>
          </div>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <h3 className="text-[14px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-6">Behavioral Insights</h3>
          <div className="flex flex-col gap-5">
            {data.insights.map((insight, index) => (
              <div key={index} className="flex gap-3 items-start group">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 shrink-0 flex items-center justify-center text-[11px] font-semibold text-[var(--color-accent)] mt-0.5 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <p className="text-[14.5px] text-[var(--color-text-primary)] leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <h3 className="text-[14px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">Top Distractions</h3>
          <div className="flex flex-col">
            {data.topDistractions.length > 0 ? (
              data.topDistractions.map((site, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-md last:border-0 last:pb-3">
                  <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{site}</span>
                  <span className="text-[12px] font-semibold text-[var(--color-text-secondary)] bg-white shadow-sm px-2.5 py-0.5 rounded-md border border-slate-200">
                    #{index + 1}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[14px] text-[var(--color-text-secondary)] py-2">No significant distractions found. Great job!</div>
            )}
          </div>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <h3 className="text-[14px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-6">Suggestions</h3>
          <div className="flex flex-col gap-5">
            {data.suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-3 items-start group">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 shrink-0 flex items-center justify-center text-[11px] font-semibold text-emerald-600 mt-0.5 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <p className="text-[14.5px] text-[var(--color-text-primary)] leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
