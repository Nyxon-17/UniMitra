import { useState, useEffect, useCallback } from 'react';
import { universityService } from '../../services/universityService';
import { documentService } from '../../services/documentService';
import { 
  BanknotesIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  EyeIcon,
  ArrowPathIcon
} from '../../components/common/Icons';

export const DashboardScholarships = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const loadScholarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await documentService.getDocumentsByCategory('SCHOL-AID');
      setDocuments(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching scholarship documents:', err);
      setError(currentLang === 'as' ? 'ছাত্ৰবৃত্তি নথিপত্ৰ ল’ড কৰাত ত্ৰুটি হৈছে।' : 'Failed to load scholarship documents.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  useEffect(() => {
    loadScholarships();

    const handleUnivSync = () => setUnivProfile(universityService.getProfile());
    const handleDocsSync = () => loadScholarships();

    window.addEventListener('unimitra_university_changed', handleUnivSync);
    window.addEventListener('unimitra_documents_changed', handleDocsSync);

    return () => {
      window.removeEventListener('unimitra_university_changed', handleUnivSync);
      window.removeEventListener('unimitra_documents_changed', handleDocsSync);
    };
  }, [loadScholarships]);

  // Extract unique departments for filtering
  const departments = ['All', ...Array.from(new Set(
    documents.map(d => d.department).filter(Boolean)
  ))];

  const filtered = documents.filter((doc) => {
    const matchDept = selectedDept === 'All' || doc.department === selectedDept;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      (doc.title && doc.title.toLowerCase().includes(q)) ||
      (doc.asTitle && doc.asTitle.toLowerCase().includes(q)) ||
      (doc.summary && doc.summary.toLowerCase().includes(q)) ||
      (doc.fileName && doc.fileName.toLowerCase().includes(q)) ||
      (doc.department && doc.department.toLowerCase().includes(q));
    return matchDept && matchSearch;
  });

  const handleOpenPdf = (doc) => {
    const url = doc.sourceUrl || (doc.storagePath ? `${import.meta.env?.VITE_SUPABASE_URL || ''}/storage/v1/object/public/unimitra-documents/${doc.storagePath}` : null);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onNavigateTab('assistant', {
        prefillQuery: currentLang === 'as'
          ? `অনুগ্ৰহ কৰি মোক ${doc.asTitle || doc.title} ৰ সবিশেষ তথ্য আৰু নিৰ্দেশনা বুজাই দিয়ক।`
          : `Please provide all details, eligibility criteria, and requirements for ${doc.title}.`
      });
    }
  };

  const handleAskAiAboutDoc = (doc) => {
    onNavigateTab('assistant', {
      prefillQuery: currentLang === 'as'
        ? `অনুগ্ৰহ কৰি মোক ${doc.asTitle || doc.title} ৰ যোগ্যতা, মাচুল ৰেহাই আৰু আবেদনৰ নিৰ্দেশনাসমূহ বুজাই দিয়ক।`
        : `What are the eligibility criteria, annual award amounts, reservation quotas, and application deadlines specified in ${doc.title}?`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BanknotesIcon className="w-4 h-4" />
              <span>{univProfile?.name || 'University'} • Financial Aid & Grants</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' 
                ? `${univProfile?.asName || 'বিশ্ববিদ্যালয়'}ৰ ছাত্ৰবৃত্তি আৰু অনুদান` 
                : `${univProfile?.name || 'University'} Scholarships & Financial Aid`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'প্ৰমাণিত অধিসূচনা, মেধা ছাত্ৰবৃত্তি, ঈশান উদয়, মাচুল ৰেহাই আৰু আৰ্থিক সাহাৰ্যৰ চৰকাৰী আৰু প্ৰতিষ্ঠানিক নিৰ্দেশনা।'
                : 'Verified circulars, institutional merit scholarships, Ishan Uday, fee waivers, and financial aid documents uploaded by the university.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadScholarships()}
              title="Refresh Documents"
              className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/20 transition-all cursor-pointer shadow-xs"
              aria-label="Refresh Documents"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNavigateTab('assistant', { 
                prefillQuery: currentLang === 'as'
                  ? 'বিশ্ববিদ্যালয়ৰ শেহতীয়া ছাত্ৰবৃত্তি আৰু মাচুল ৰেহাইৰ নিয়মাৱলী কি কি?'
                  : 'What are the current scholarship schemes, eligibility criteria, and fee waiver guidelines available?'
              })}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>{currentLang === 'as' ? 'ছাত্ৰবৃত্তিৰ বিষয়ে সোধক' : 'Ask AI About Grants'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                  selectedDept === dept
                    ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                    : 'bg-white dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'ছাত্ৰবৃত্তিৰ নাম বা নথি বিচাৰক...' : 'Search scholarship notices, PDFs...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E] dark:focus:border-[#03C988]"
            />
          </div>
        </div>
      </div>

      {/* Content Area: Loading / Error / Empty / Dynamic Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/60 dark:bg-[#141414]/60 border-2 border-[#73A5CA]/20 dark:border-[#1C82AD]/20 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-[#73A5CA]/30 dark:bg-[#1C82AD]/30 rounded-md"></div>
                <div className="h-4 w-16 bg-[#73A5CA]/30 dark:bg-[#1C82AD]/30 rounded-md"></div>
              </div>
              <div className="h-6 w-3/4 bg-[#73A5CA]/20 dark:bg-[#1C82AD]/20 rounded-lg"></div>
              <div className="h-16 w-full bg-black/5 dark:bg-white/5 rounded-2xl"></div>
              <div className="h-4 w-1/2 bg-[#73A5CA]/20 dark:bg-[#1C82AD]/20 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#141414] border-2 border-dashed border-red-400/40">
          <BanknotesIcon className="w-10 h-10 mx-auto text-red-500 mb-2" />
          <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">{error}</h3>
          <button
            onClick={() => loadScholarships()}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-black bg-[#FF933E] text-white hover:bg-[#E87A24] cursor-pointer inline-flex items-center space-x-1.5"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            <span>{currentLang === 'as' ? 'পুনৰ চেষ্টা কৰক' : 'Retry'}</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141414] border-2 border-dashed border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFE9A9]/50 dark:bg-[#0A0A0A] flex items-center justify-center text-[#FF933E] dark:text-[#03C988]">
            <DocumentTextIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
            {searchQuery 
              ? (currentLang === 'as' ? 'কোনো ছাত্ৰবৃত্তি পোৱা নগ’ল' : 'No Matching Scholarship Documents')
              : (currentLang === 'as' ? 'কোনো ছাত্ৰবৃত্তি জাননী এতিয়ালৈকে আপলোড কৰা হোৱা নাই' : 'No Scholarship Documents Available Yet')}
          </h3>
          <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? (currentLang === 'as' ? 'অনুগ্ৰহ কৰি সন্ধানৰ শব্দ সলনি কৰি পুনৰ চেষ্টা কৰক।' : 'No uploaded scholarship notices match your search term or department filter.')
              : (currentLang === 'as' 
                  ? 'বিশ্ববিদ্যালয় প্ৰশাসন বা অধ্যাপকসকলে আপলোড কৰা মেধা ছাত্ৰবৃত্তি আৰু মাচুল ৰেহাইৰ PDF জাননীসমূহ ইয়াত স্বয়ংক্ৰিয়ভাৱে দেখা যাব।'
                  : 'Official scholarship circulars, Ishan Uday notifications, and grant PDF documents uploaded by university administrators or faculty will automatically appear here.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id || doc.uuid}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-4 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all flex flex-col justify-between"
            >
              {/* Top Row: Category + Quick Ask AI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FFE9A9]/60 dark:bg-white/10 text-[10px] font-black uppercase text-[#000000] dark:text-[#03C988] tracking-wider border border-[#FFCB56]/50 dark:border-[#03C988]/30">
                    {doc.category || 'Scholarships & Financial Aid'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#000000]/60 dark:text-[#FFFFFF]/60">
                    {doc.fileType || 'PDF'} • {doc.pages || 1} {doc.pages === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>

                {/* Title & Regional Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] leading-snug">
                    {doc.title}
                  </h3>
                  {doc.asTitle && doc.asTitle !== doc.title && (
                    <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-1">
                      {doc.asTitle}
                    </p>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">
                      {currentLang === 'as' ? 'বিভাগ:' : 'Department:'}
                    </span>
                    <span className="font-bold text-[#000000] dark:text-[#FFFFFF] truncate block">
                      {doc.department || 'Student Welfare & Scholarship Cell'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#000000]/60 dark:text-[#FFFFFF]/60 block font-bold">
                      {currentLang === 'as' ? 'প্ৰকাশৰ তাৰিখ:' : 'Published / Uploaded:'}
                    </span>
                    <span className="font-bold text-[#000000] dark:text-[#FFFFFF] truncate block">
                      {doc.publicationDate || doc.uploadedAt || 'Official Notice'}
                    </span>
                  </div>
                </div>

                {/* Summary / Extract from PDF */}
                {doc.summary && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#000000] dark:text-[#FFFFFF] block">
                      {currentLang === 'as' ? 'অধিসূচনাৰ বিৱৰণ:' : 'Notification Summary:'}
                    </span>
                    <p className="text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed text-[11px] line-clamp-3">
                      {doc.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-[#000000]/60 dark:text-[#FFFFFF]/60">
                    Uploaded by {doc.uploaderName || 'Administrator'} ({doc.uploaderRole || 'Admin'})
                  </span>
                  <span className="text-[10px] text-[#03C988] font-bold flex items-center space-x-1">
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    <span>Verified Document</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {/* View/Download PDF Button */}
                  <button
                    onClick={() => handleOpenPdf(doc)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#73A5CA]/50 dark:border-[#1C82AD]/50 hover:bg-[#FFE9A9]/30 dark:hover:bg-white/10 text-[#000000] dark:text-[#FFFFFF] text-xs font-black transition-all cursor-pointer shadow-2xs"
                  >
                    <EyeIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                    <span>{currentLang === 'as' ? 'PDF চাওক' : 'View PDF'}</span>
                  </button>

                  {/* Ask AI Assistant About Document Button */}
                  <button
                    onClick={() => handleAskAiAboutDoc(doc)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-xs font-black transition-all cursor-pointer shadow-2xs"
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>{currentLang === 'as' ? 'AI ক সোধক' : 'Ask AI'}</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
