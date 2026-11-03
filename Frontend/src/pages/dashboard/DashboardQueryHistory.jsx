import { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ShieldCheckIcon 
} from '../../components/common/Icons';
import { chatService } from '../../services/chatService';

export const DashboardQueryHistory = ({ onNavigateTab, currentLang = 'en' }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicHistory = async () => {
      setLoading(true);
      try {
        const sessions = await chatService.getSessions('student');
        const items = [];
        for (const s of (sessions || []).slice(0, 30)) {
          const msgs = await chatService.fetchSessionMessages(s.id, 'student');
          if (msgs && msgs.length > 0) {
            for (let i = 0; i < msgs.length; i++) {
              if (msgs[i].sender === 'user') {
                const userQ = msgs[i].text;
                const nextAi = msgs.slice(i + 1).find(m => m.sender === 'ai');
                items.push({
                  id: msgs[i].id || `hist-${s.id}-${i}`,
                  sessionId: s.id,
                  query: userQ,
                  asQuery: userQ,
                  category: s.title ? s.title.slice(0, 30) : 'Academic Consultation',
                  resolvedAnswer: nextAi?.text || 'Resolved institutional query.',
                  source: nextAi?.source || 'UniMitra Knowledge Base',
                  timestamp: msgs[i].time || (s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent'),
                  status: 'Resolved'
                });
              }
            }
          }
        }
        setHistoryList(items);
      } catch (err) {
        console.warn('Failed to load dynamic query history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDynamicHistory();
  }, []);

  const filteredHistory = historyList.filter((item) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.query && item.query.toLowerCase().includes(q)) ||
      (item.asQuery && item.asQuery.includes(q)) ||
      (item.resolvedAnswer && item.resolvedAnswer.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const handleDelete = (id, sessionId) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
    if (sessionId) {
      chatService.deleteSession(sessionId, 'student');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all recorded query history?')) {
      chatService.clearAllSessions('student');
      setHistoryList([]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
              <ClockIcon className="w-4 h-4" />
              <span>Query Interaction History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'মোৰ প্ৰশ্নোত্তৰ ইতিহাস' : 'Institutional Query History'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'পূৰ্বতে সোধা বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষা আৰু ছাত্ৰবৃত্তিৰ প্ৰশ্ন আৰু প্ৰমাণিত সমাধানসমূহ পুনৰ পৰীক্ষা কৰক।'
                : 'Review your previously resolved institutional queries, citations, and grounded gazette sources.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {historyList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-xs font-black text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
              >
                Clear History
              </button>
            )}
            <button
              onClick={() => onNavigateTab('assistant')}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-[#FAF8FF]" />
              <span>Ask New Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search History */}
      <div className="neo-surface rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within your query history..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
          />
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="neo-surface rounded-3xl p-10 text-center text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
            Loading your verified query history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="neo-surface rounded-3xl p-10 text-center text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
            No queries match your search. Start a new conversation in the AI Assistant.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="neo-surface rounded-3xl p-5 sm:p-6 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-black uppercase text-[#000000]/80 dark:text-[#FFFFFF]/80">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FFE9A9]/40 text-[#000000] dark:bg-[#0A0A0A] dark:text-[#FFFFFF] border border-[#FF933E]/50 dark:border-[#03C988]/50 flex items-center space-x-1">
                    <CheckCircleIcon className="w-3 h-3 text-[#FF933E] dark:text-[#03C988]" />
                    <span>{item.status}</span>
                  </span>
                  <button
                    onClick={() => handleDelete(item.id, item.sessionId)}
                    className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                    title="Delete item"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                  {currentLang === 'as' ? item.asQuery : item.query}
                </h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1.5 leading-relaxed font-semibold">
                  {item.resolvedAnswer}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                <div className="flex items-center space-x-1.5">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                  <span className="font-bold">Grounded Citation: {item.source}</span>
                </div>

                <button
                  onClick={() => onNavigateTab('assistant', { prefillQuery: item.query })}
                  className="text-xs font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ask Follow-up in Assistant ➔</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
