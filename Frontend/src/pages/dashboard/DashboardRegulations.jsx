import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { documentService, resolveDocPdfUrl } from '../../services/documentService';
import { pdfStorage } from '../../services/pdfStorage';
import { 
  BuildingLibraryIcon, 
  SearchIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClipboardDocumentCheckIcon, 
  ChevronDownIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EyeIcon
} from '../../components/common/Icons';

export const DashboardRegulations = ({ 
  onNavigateTab, 
  currentLang = 'en'
}) => {
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [regulationsList, setRegulationsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRegulations = () => {
    setUnivProfile(universityService.getProfile());
    const all = documentService.getDocuments();
    // Filter institutional regulations & statutory circulars
    const regs = all.filter(d => {
      const cat = (d.category || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      const fn = (d.fileName || '').toLowerCase();
      const isReg = cat.includes('regulat') || 
                    cat.includes('ordinan') || 
                    cat.includes('syllabus') || 
                    cat.includes('curriculum') || 
                    cat.includes('attendance') ||
                    title.includes('ordinance') || 
                    title.includes('regulation') || 
                    title.includes('attendance') || 
                    title.includes('syllabus') || 
                    fn.includes('attendance') || 
                    fn.includes('ordinance');
      return isReg && (d.approvalStatus === 'approved' || d.status === 'Indexed' || d.uploaderRole === 'Admin');
    });
    setRegulationsList(regs);
  };

  useEffect(() => {
    loadRegulations();
    const handleSync = () => loadRegulations();
    window.addEventListener('unimitra_documents_changed', handleSync);
    window.addEventListener('unimitra_university_changed', handleSync);
    return () => {
      window.removeEventListener('unimitra_documents_changed', handleSync);
      window.removeEventListener('unimitra_university_changed', handleSync);
    };
  }, []);

  const handleInspectDoc = async (doc) => {
    try {
      if (typeof window !== 'undefined' && window.__uploadedPdfBlobs) {
        const memUrl = (doc.id && window.__uploadedPdfBlobs.get(doc.id)) ||
                       (doc.uuid && window.__uploadedPdfBlobs.get(doc.uuid)) ||
                       (doc.fileName && window.__uploadedPdfBlobs.get(doc.fileName));
        if (memUrl) {
          window.open(memUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      }

      let fileBlob = await pdfStorage.getPdf(doc.id);
      if (!fileBlob && doc.uuid) fileBlob = await pdfStorage.getPdf(doc.uuid);
      if (!fileBlob && doc.fileName) fileBlob = await pdfStorage.getPdf(doc.fileName);

      if (fileBlob) {
        const blobUrl = URL.createObjectURL(fileBlob);
        if (typeof window !== 'undefined') {
          window.__uploadedPdfBlobs = window.__uploadedPdfBlobs || new Map();
          if (doc.id) window.__uploadedPdfBlobs.set(doc.id, blobUrl);
          if (doc.uuid) window.__uploadedPdfBlobs.set(doc.uuid, blobUrl);
          if (doc.fileName) window.__uploadedPdfBlobs.set(doc.fileName, blobUrl);
        }
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      const url = resolveDocPdfUrl(doc);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      const fallbackUrl = resolveDocPdfUrl(doc);
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const filteredRegulations = regulationsList.filter((reg) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (reg.title && reg.title.toLowerCase().includes(q)) ||
      (reg.asTitle && reg.asTitle.includes(q)) ||
      (reg.summary && reg.summary.toLowerCase().includes(q)) ||
      (reg.department && reg.department.toLowerCase().includes(q)) ||
      (reg.citation && reg.citation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BuildingLibraryIcon className="w-4 h-4" />
              <span>{univProfile.name} • Statutory Ordinances</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ বিধিবদ্ধ নিয়মাৱলী` : `${univProfile.name} Regulations & Ordinances`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `প্ৰতিষ্ঠানিক অধিনিয়ম, পৰীক্ষাৰ মূল্যায়ন, শ্ৰেণী উপস্থিতিৰ চৰ্ত আৰু আইনী অধিসূচনাসমূহ অন্বেষণ কৰক। সকলো তথ্য AI সহায়কৰ দ্বাৰা প্ৰমাণিত।`
                : `Browse verified statutory regulations, attendance rules, condonation limits, and academic council ordinances of ${univProfile.name}. Grounded in verified university gazettes.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `Summarize ${univProfile.name} class attendance condonation and passing criteria regulations.` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI to Explain'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clauses, ordinances, attendance rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
          />
        </div>

        <div className="px-4 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
          {regulationsList.length} Verified Statutory Document{regulationsList.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filteredRegulations.length === 0 ? (
          <div className="neo-surface rounded-3xl p-10 text-center border border-dashed border-[#73A5CA]/40">
            <BuildingLibraryIcon className="w-10 h-10 mx-auto text-[#FF933E] dark:text-[#03C988] mb-2" />
            <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'কোনো বিধিবদ্ধ নিয়মাৱলী পোৱা নগ’ল' : 'No Statutory Regulations Found'}
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1 max-w-md mx-auto">
              {currentLang === 'as' 
                ? 'প্ৰশাসকে পৰৱৰ্তী অধিনিয়মৰ PDF আপলোড কৰিলে এই পৃষ্ঠাত স্বয়ংক্ৰিয়ভাৱে প্ৰদৰ্শিত হ’ব।' 
                : 'As soon as new official regulation or ordinance PDFs are uploaded by administrators, they will automatically appear here.'}
            </p>
          </div>
        ) : (
          filteredRegulations.map((reg) => (
            <div
              key={reg.id}
              className="neo-surface rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#000000] dark:text-[#FFFFFF]">
                    {reg.department || reg.id}
                  </span>
                  <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                    {reg.category}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('assistant', { prefillQuery: currentLang === 'as' ? reg.asTitle || reg.title : reg.title })}
                  className="px-3 py-1.5 rounded-xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] text-xs font-black text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FF933E] hover:text-white dark:hover:bg-[#03C988] dark:hover:text-black transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {reg.title}
                </h3>
                {reg.asTitle && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] mt-0.5">
                    {reg.asTitle}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-2 leading-relaxed">
                  {reg.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 font-mono text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                  <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                  <span>Citation: {reg.citation}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleInspectDoc(reg)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs flex items-center space-x-1.5 transition-all"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Inspect Official PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
