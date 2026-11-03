import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { documentService, resolveDocPdfUrl } from '../../services/documentService';
import { pdfStorage } from '../../services/pdfStorage';
import { 
  BuildingLibraryIcon, 
  ClipboardDocumentCheckIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  SearchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EyeIcon
} from '../../components/common/Icons';

export const DashboardFacultyExams = ({ onNavigateTab, currentLang = 'en', studentInfo }) => {
  const univProfile = universityService.getProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState(() => documentService.getApprovedDocuments());

  const loadExamDocs = () => {
    const all = documentService.getDocuments();
    // Examination documents: category includes exam or evaluation, or title/filename contains exam, topper, result
    const examOnly = all.filter(d => {
      const cat = (d.category || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      const fn = (d.fileName || '').toLowerCase();
      const isExam = cat.includes('exam') || 
                     cat.includes('eval') || 
                     title.includes('exam') || 
                     title.includes('topper') || 
                     title.includes('evaluation') || 
                     title.includes('result') || 
                     fn.includes('exam') || 
                     fn.includes('topper');
      return isExam && (d.approvalStatus === 'approved' || d.status === 'Indexed' || d.uploaderRole === 'Faculty');
    });
    setDocuments(examOnly);
  };

  useEffect(() => {
    loadExamDocs();
    const handleUpdate = () => loadExamDocs();
    window.addEventListener('unimitra_documents_changed', handleUpdate);
    return () => window.removeEventListener('unimitra_documents_changed', handleUpdate);
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

  const filtered = documents.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.asTitle && d.asTitle.includes(q)) ||
      (d.summary && d.summary.toLowerCase().includes(q)) ||
      (d.department && d.department.toLowerCase().includes(q)) ||
      (d.fileName && d.fileName.toLowerCase().includes(q)) ||
      (d.citation && d.citation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988]">
              {currentLang === 'as' ? 'অধ্যাপক আৰু পৰীক্ষক নিৰ্দেশনা' : 'Faculty & Examiner Directives'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' ? 'পৰীক্ষা আৰু মূল্যায়নৰ প্ৰতিষ্ঠানিক বিধি' : 'Examination Guidelines & Evaluation Norms'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              Official university examination notices, evaluation bylaws, and merit lists. Grounded in institutional gazettes.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: 'What are the official university examination passing criteria and evaluation codes?' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
            <span>Consult Faculty AI</span>
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search evaluation norms, exam notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
          />
        </div>

        <div className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-1.5">
          <span>{univProfile.name || 'Our University'} Examination Authority</span>
        </div>
      </div>

      {/* Documents Grid */}
      {filtered.length === 0 ? (
        <div className="neo-surface rounded-3xl p-10 text-center border border-dashed border-[#73A5CA]/40">
          <ClipboardDocumentCheckIcon className="w-10 h-10 mx-auto text-[#FF933E] dark:text-[#03C988] mb-2" />
          <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' ? 'কোনো পৰীক্ষা নিৰ্দেশনা পোৱা নগ’ল' : 'No Examination Guidelines Found'}
          </h3>
          <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1 max-w-md mx-auto">
            {currentLang === 'as'
              ? 'প্ৰশাসক বা অধ্যাপকে পৰৱৰ্তী পৰীক্ষাৰ PDF আপলোড কৰিলে এই পৃষ্ঠাত স্বয়ংক্ৰিয়ভাৱে প্ৰদৰ্শিত হ’ব।'
              : 'As soon as new official examination PDFs or evaluation gazettes are ingested, they will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className="neo-surface rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    {item.department || item.id}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {item.title}
                </h2>
                {item.asTitle && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                    {item.asTitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {item.summary}
                </p>

                {item.citation && (
                  <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-xl border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 flex items-center space-x-2 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 font-mono">
                    <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                    <span className="truncate">{item.citation}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40/50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleInspectDoc(item)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs flex items-center space-x-1.5 transition-all"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Inspect Official PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: `Explain the rules, guidelines, and passing criteria in: ${item.title}` })}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30 text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1 transition-all"
                >
                  <span>Ask AI</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
