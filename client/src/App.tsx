import { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCard } from './components/UploadCard';
import { ResultsDashboard, type AIAnalysisResponse } from './components/ResultsDashboard';
import { ChatInterface } from './components/ChatInterface';
import { RecentAnalyses } from './components/RecentAnalyses';
import { Target, Sparkles, LayoutDashboard, ArrowLeft } from 'lucide-react';

function App() {
  const [results, setResults] = useState<AIAnalysisResponse | null>(null);
  const [rawHistoryData, setRawHistoryData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchRecentAnalyses = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setRecentAnalyses(res.data);
    } catch (err) {
      console.error("Failed to fetch recent analyses:", err);
    }
  };
  useEffect(() => {
    fetchRecentAnalyses();
  }, []);
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#results') {
        setResults(null);
        setRawHistoryData(null);
        setError(null);
        fetchRecentAnalyses(); // Refresh history when going back
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAnalyze = async (dataStr: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setRawHistoryData(null);
    
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(dataStr);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your input.", { cause: e });
      }
      if (!Array.isArray(parsedData)) {
        throw new Error("Data must be a JSON array of objects.");
      }

      setRawHistoryData(parsedData);
      const response = await axios.post<AIAnalysisResponse>(`${API_URL}/analyze`, parsedData);
      setResults(response.data);
      window.history.pushState({ page: 'results' }, '', '#results');
      fetchRecentAnalyses();

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (window.location.hash === '#results') {
      window.history.back();
    } else {
      setResults(null);
      setRawHistoryData(null);
      setError(null);
      fetchRecentAnalyses();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col font-sans">
      <header className="w-full bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[17px] font-semibold text-[var(--color-text-primary)] tracking-tight">
              BrowseSense AI
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[13px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">Your attention is your most valuable asset.</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Productivity Dashboard</h2>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-0.5">Upload your Chrome history to get AI-powered insights.</p>
            </div>
          </div>
          
          {results && (
            <button 
              onClick={goBack}
              className="hidden sm:flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-[var(--color-accent)] bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze New File
            </button>
          )}
        </div>
        
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[14px] shadow-sm flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
            {error}
          </div>
        )}
        {!results ? (
          <div className="w-full max-w-3xl mx-auto">
            <UploadCard onAnalyze={handleAnalyze} isLoading={isLoading} />
            <RecentAnalyses analyses={recentAnalyses} />
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-fade-in-slow">
            <button 
              onClick={goBack}
              className="sm:hidden flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-[var(--color-accent)] self-start transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze New File
            </button>
            <ResultsDashboard data={results} />
            {rawHistoryData && (
              <div className="mt-4">
                <ChatInterface historyData={rawHistoryData} />
              </div>
            )}
            <RecentAnalyses analyses={recentAnalyses} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
