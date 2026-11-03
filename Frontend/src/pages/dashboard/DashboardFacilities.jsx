import { useState, useEffect } from 'react';
import { universityService } from '../../services/universityService';
import { documentService, resolveDocPdfUrl } from '../../services/documentService';
import { pdfStorage } from '../../services/pdfStorage';
import { 
  BuildingOfficeIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EyeIcon
} from '../../components/common/Icons';

export const DashboardFacilities = ({ onNavigateTab, currentLang = 'en' }) => {
  const univProfile = universityService.getProfile();
  const [facilitiesDocs, setFacilitiesDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFacilityDocs = () => {
    const all = documentService.getDocuments();
    // Filter campus facility documents only
    const facilityOnly = all.filter((d) => {
      const cat = (d.category || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      const fn = (d.fileName || '').toLowerCase();
      const isFacility = cat.includes('facilit') || 
                          cat.includes('hostel') || 
                          cat.includes('camp-host') ||
                          cat.includes('residential') || 
                          title.includes('facility') || 
                          title.includes('hostel') || 
                          title.includes('infrastructure') ||
                          fn.includes('hostel') || 
                          fn.includes('facility');
      return isFacility && (d.approvalStatus === 'approved' || d.status === 'Indexed' || d.uploaderRole === 'Admin');
    });
    setFacilitiesDocs(facilityOnly);
  };

  useEffect(() => {
    loadFacilityDocs();
    const handleUpdate = () => loadFacilityDocs();
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

  const filtered = facilitiesDocs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (f.title && f.title.toLowerCase().includes(q)) ||
      (f.asTitle && f.asTitle.includes(q)) ||
      (f.summary && f.summary.toLowerCase().includes(q)) ||
      (f.department && f.department.toLowerCase().includes(q)) ||
      (f.citation && f.citation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>{univProfile.name} • Campus Life & Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? `${univProfile.asName}ৰ চৌহদৰ সুবিধাসমূহ` : `${univProfile.name} Campus Facilities & Hostels`}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? `বিশ্ববিদ্যালয়ৰ চৌহদ সুবিধা, হোষ্টেল আসন আবণ্টন আৰু আৱাসিক নিয়মাৱলীৰ চৰকাৰী জাননীসমূহ।`
                : `Official bylaws, hostel seat matrices, residential guidelines, and infrastructure regulations grounded in institutional PDFs.`}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the hostel allotment rules, distance criteria, and curfew hours at ${univProfile.name}?` })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{currentLang === 'as' ? 'হোষ্টেলৰ বিষয়ে সোধক' : 'Ask AI About Hostels'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search hostels, residential rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
          />
        </div>

        <div className="px-4 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
          {facilitiesDocs.length} Official Document{facilitiesDocs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Documents Grid / Clean Empty State */}
      {filtered.length === 0 ? (
        <div className="neo-surface rounded-3xl p-10 sm:p-14 text-center border border-dashed border-[#73A5CA]/40 space-y-3">
          <BuildingOfficeIcon className="w-12 h-12 mx-auto text-[#FF933E] dark:text-[#03C988]" />
          <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' ? 'কোনো চৌহদ সুবিধাৰ PDF আপলোড হোৱা নাই' : 'No Campus Facility Documents Uploaded Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-md mx-auto leading-relaxed">
            {currentLang === 'as'
              ? 'প্ৰশাসক বা অধ্যাপকে হোষ্টেল বা চৌহদ সুবিধাৰ চৰকাৰী PDF আপলোড কৰিলে সেইসমূহ স্বয়ংক্ৰিয়ভাৱে এই পৃষ্ঠাত প্ৰদৰ্শিত হ’ব।'
              : 'Campus facility guidelines, residential bylaws, and hostel seat matrices will automatically appear here as soon as official PDFs are uploaded by university administrators or faculty.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="neo-surface rounded-3xl p-6 shadow-sm hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                    {doc.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    {doc.department || doc.id}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {doc.title}
                </h2>
                {doc.asTitle && (
                  <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                    {doc.asTitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {doc.summary}
                </p>

                {doc.citation && (
                  <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-xl border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 flex items-center space-x-2 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 font-mono">
                    <DocumentTextIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                    <span className="truncate">{doc.citation}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40/50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleInspectDoc(doc)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs flex items-center space-x-1.5 transition-all"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Inspect Official PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: `Explain the campus facility and hostel rules for: ${doc.title}` })}
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
