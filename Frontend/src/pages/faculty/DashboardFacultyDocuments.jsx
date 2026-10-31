import { useState, useEffect, useRef } from 'react';
import { 
  BuildingLibraryIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  SearchIcon, 
  EyeIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon
} from '../../components/common/Icons';
import { documentService } from '../../services/documentService';

export const DashboardFacultyDocuments = ({ onNavigateTab, currentLang = 'en', studentInfo }) => {
  // Navigation tabs: 'repository' | 'upload' | 'my-submissions'
  const [activeTab, setActiveTab] = useState('repository');
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUniv, setSelectedUniv] = useState('All');
  const [activeModalDoc, setActiveModalDoc] = useState(null);
  const [toastAlert, setToastAlert] = useState('');

  // Upload Form State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    asTitle: '',
    university: 'Gauhati University (GU)',
    category: 'Syllabus & Curriculum Frameworks',
    department: studentInfo?.department || 'Computer Science & Engineering',
    academicYear: '2024-2025',
    summary: '',
    citation: '',
    isPublicForStudents: true
  });

  // Load and subscribe to document changes
  const loadDocs = () => {
    setDocuments(documentService.getDocuments());
    setCategories(documentService.getCategories());
  };

  useEffect(() => {
    loadDocs();
    const handleUpdate = () => loadDocs();
    window.addEventListener('unimitra_documents_changed', handleUpdate);
    return () => window.removeEventListener('unimitra_documents_changed', handleUpdate);
  }, []);

  const triggerToast = (msg) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(''), 4000);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const validExts = ['.pdf', '.docx', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      triggerToast('Please upload a valid PDF, DOCX or TXT document.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      triggerToast('File size exceeds the 25 MB institutional limit.');
      return;
    }

    setSelectedFile(file);
    // Pre-fill titles if empty
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (!uploadFormData.title) {
      setUploadFormData(prev => ({
        ...prev,
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      }));
    }
  };

  // Submit and simulate OCR / parsing
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      triggerToast('Please select a PDF or academic document to upload.');
      return;
    }
    if (!uploadFormData.title.trim()) {
      triggerToast('Please specify the official document title.');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(15);
    setProcessingStage('1. Ingesting binary stream & virus sanitization...');

    setTimeout(() => {
      setUploadProgress(45);
      setProcessingStage('2. Optical Layout Parsing & Assamese/English text extraction...');
    }, 600);

    setTimeout(() => {
      setUploadProgress(78);
      setProcessingStage('3. Recursive semantic chunking (512-token windows with 50-token overlap)...');
    }, 1200);

    setTimeout(() => {
      setUploadProgress(100);
      setProcessingStage('4. Dispatching to Administrator Approval Queue for knowledge clearance...');
      
      const fileExt = selectedFile.name.split('.').pop().toUpperCase();
      const fileSizeStr = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
      const estimatedPages = Math.max(1, Math.round(selectedFile.size / (60 * 1024)));

      documentService.uploadFacultyDocument({
        title: uploadFormData.title,
        asTitle: uploadFormData.asTitle || uploadFormData.title,
        university: uploadFormData.university,
        category: uploadFormData.category,
        department: uploadFormData.department,
        academicYear: uploadFormData.academicYear,
        summary: uploadFormData.summary || 'Academic syllabus / departmental notice submitted by authorized university faculty member.',
        citation: uploadFormData.citation || `${uploadFormData.university} Faculty Submission Ref. ${new Date().getFullYear()}`,
        fileName: selectedFile.name,
        fileType: fileExt,
        fileSize: fileSizeStr,
        pages: estimatedPages,
        chunksCount: estimatedPages * 5,
        uploaderRole: 'Faculty',
        uploaderName: studentInfo?.name || 'Dr. J. K. Sarma, Associate Professor',
        uploaderEmail: studentInfo?.email || 'faculty@university.ac.in',
        ocrApplied: true
      });

      setIsProcessing(false);
      setSelectedFile(null);
      setUploadFormData({
        title: '',
        asTitle: '',
        university: 'Gauhati University (GU)',
        category: 'Syllabus & Curriculum Frameworks',
        department: studentInfo?.department || 'Computer Science & Engineering',
        academicYear: '2024-2025',
        summary: '',
        citation: '',
        isPublicForStudents: true
      });

      triggerToast('Document submitted! Routed to Administrator review before chatbot activation.');
      setActiveTab('my-submissions');
    }, 1800);
  };

  // Filter approved/authorized repository docs
  const authorizedDocs = documents.filter(d => d.approvalStatus === 'approved' && d.status === 'Indexed');
  
  const filteredAuthorizedDocs = authorizedDocs.filter(doc => {
    const matchCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchUniv = selectedUniv === 'All' || doc.university.includes(selectedUniv);
    const matchSearch = !searchQuery.trim() || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.asTitle && doc.asTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchUniv && matchSearch;
  });

  // Filter faculty's own submissions
  const facultySubmissions = documents.filter(d => d.uploaderRole === 'Faculty');

  return (
    <div className="space-y-6">
      
      {/* Faculty Quick Access Hub */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                {currentLang === 'as' ? 'অধ্যাপক আৰু গৱেষক পৰ্টেল' : 'Faculty Research & Academic Hub'}
              </span>
              <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70">
                {studentInfo?.department || 'Department of Higher Education'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {currentLang === 'as' ? 'শৈক্ষিক নথিপত্ৰ আপলোড আৰু প্ৰতিষ্ঠানিক বিধি' : 'Academic PDF Ingestion & Institutional Statues'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              Upload course syllabi, departmental evaluation circulars, and research ordinances. Access UGC CAS guidelines, examination moderation rules, and grounded AI assistance.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: 'What are UGC CAS promotion criteria for Associate Professor?' })}
              className="p-3 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] hover:bg-[#FFCB56]/30 text-left transition-all cursor-pointer group"
              title="Ask Academic Questions"
            >
              <SparklesIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-[#000000] dark:text-[#FFFFFF]">Ask AI</div>
              <div className="text-[9px] text-[#000000]/70 dark:text-[#FFFFFF]/70">Institutional Q&A</div>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('regulations')}
              className="p-3 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] hover:bg-[#FFCB56]/30 text-left transition-all cursor-pointer group"
              title="Search Regulations"
            >
              <BuildingLibraryIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-[#000000] dark:text-[#FFFFFF]">Regulations</div>
              <div className="text-[9px] text-[#000000]/70 dark:text-[#FFFFFF]/70">Statutory Codes</div>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('faculty-exams')}
              className="p-3 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] hover:bg-[#FFCB56]/30 text-left transition-all cursor-pointer group"
              title="Examination Guidelines"
            >
              <DocumentTextIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-[#000000] dark:text-[#FFFFFF]">Exams</div>
              <div className="text-[9px] text-[#000000]/70 dark:text-[#FFFFFF]/70">Moderation Norms</div>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('faculty-saved')}
              className="p-3 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] hover:bg-[#FFCB56]/30 text-left transition-all cursor-pointer group"
              title="Saved Conversations"
            >
              <ShieldCheckIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-black text-[#000000] dark:text-[#FFFFFF]">Saved</div>
              <div className="text-[9px] text-[#000000]/70 dark:text-[#FFFFFF]/70">Research Records</div>
            </button>
          </div>
        </div>

        {/* Global Toast Message */}
        {toastAlert && (
          <div className="mt-4 p-3 rounded-2xl bg-[#FFE9A9] dark:bg-[#0A0A0A] border-2 border-[#FF933E] dark:border-[#03C988] text-xs font-black text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-2 animate-fade-in">
            <CheckCircleIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
            <span>{toastAlert}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="mt-6 pt-4 border-t border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('repository')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'repository'
                ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-sm'
                : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
            }`}
          >
            <BuildingLibraryIcon className="w-4 h-4" />
            <span>Authorized Institutional Repository ({authorizedDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'upload'
                ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-sm'
                : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
            }`}
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Upload Academic Document (PDF / DOCX)</span>
          </button>

          <button
            onClick={() => setActiveTab('my-submissions')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'my-submissions'
                ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-sm'
                : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            <span>My Submissions & Approval Tracker ({facultySubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: AUTHORIZED INSTITUTIONAL REPOSITORY                          */}
      {/* =================================================================== */}
      {activeTab === 'repository' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search CAS, API scores, PhD rules, workload..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]"
              >
                <option value="All">All Universities</option>
                <option value="Gauhati">Gauhati University (GU)</option>
                <option value="Dibrugarh">Dibrugarh University (DU)</option>
                <option value="Tezpur">Tezpur University (TU)</option>
                <option value="All Universities">State-Wide Gazettes</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAuthorizedDocs.map((doc) => (
              <div 
                key={doc.id}
                className="neo-surface rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                      {doc.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">
                      {doc.id}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] leading-snug">
                    {currentLang === 'as' && doc.asTitle ? doc.asTitle : doc.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                    {doc.summary}
                  </p>

                  <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-2xl border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      <span>Authority: {doc.university}</span>
                      <span>{doc.pages} Pages ({doc.chunksCount} chunks)</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#FF933E] dark:text-[#03C988] truncate">
                      Source: {doc.fileName || doc.title}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40/50 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    <ShieldCheckIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] shrink-0" />
                    <span className="truncate max-w-[180px]" title={doc.citation}>
                      {doc.citation}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalDoc(doc)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30 text-[#000000] dark:text-[#FFFFFF] cursor-pointer flex items-center space-x-1"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateTab && onNavigateTab('assistant', { prefillQuery: `What are the official provisions and citations in: ${doc.title}?` })}
                      className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                    >
                      <span>Ask AI</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: FACULTY PDF & DOCUMENT INGESTION FORM                        */}
      {/* =================================================================== */}
      {activeTab === 'upload' && (
        <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 pb-4">
            <div className="flex items-center space-x-2 text-[#FF933E] dark:text-[#03C988] font-black text-xs uppercase tracking-wider">
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>Multi-Format Academic Ingestor (PDF, DOCX, TXT)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#000000] dark:text-[#FFFFFF] mt-1">
              Submit Academic Syllabus, Circulars & Examination Notices
            </h2>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              Upload institutional documents for OCR extraction, vector chunking, and administrative governance clearance.
            </p>
          </div>

          {/* Institutional Governance Notice Banner */}
          <div className="p-4 rounded-2xl bg-[#FFE9A9]/40 dark:bg-[#0A0A0A] border-2 border-[#FFCB56] dark:border-[#03C988] flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] shrink-0 mt-0.5" />
            <div className="text-xs text-[#000000] dark:text-[#FFFFFF] leading-relaxed">
              <strong className="block font-black uppercase text-[11px] text-[#FF933E] dark:text-[#03C988] mb-0.5">
                Institutional Quality & Verification Clearance
              </strong>
              In accordance with university regulations, documents uploaded by faculty members enter the 
              <span className="font-bold underline mx-1">Administrator Review Queue</span>. 
              Once reviewed and approved by the System Administrator, the document is vectorized and becomes actively queryable by students through the bilingual AI chatbot.
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            
            {/* Drag & Drop File Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-[#FF933E] bg-[#FFE9A9]/40 scale-[1.01]' 
                  : selectedFile 
                    ? 'border-[#03C988] bg-[#03C988]/10' 
                    : 'border-[#73A5CA] dark:border-[#1C82AD] bg-[#FFE9A9]/10 dark:bg-[#0A0A0A] hover:border-[#FF933E]'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".pdf,.docx,.txt" 
                onChange={handleFileChange} 
                className="hidden" 
              />

              <div className="w-14 h-14 rounded-2xl bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#FF933E] dark:text-[#03C988] mx-auto flex items-center justify-center font-black mb-3 shadow-xs">
                <CloudArrowUpIcon className="w-7 h-7" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <div className="text-sm font-black text-[#000000] dark:text-[#FFFFFF] flex items-center justify-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-[#03C988]" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for institutional processing
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-red-600 font-bold hover:underline pt-1"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                    Drag & Drop official university PDF, DOCX, or TXT
                  </div>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                    Supports syllabus blueprints, examination regulations, and circulars (Max: 25 MB)
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-xl text-xs font-bold text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-[#000000]">
                    Browse Computer
                  </span>
                </div>
              )}
            </div>

            {/* Document Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Official Document Title (English) <span className="text-[#FF933E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc. Data Science Syllabus & Ordinance 2024"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  নথিৰ শিৰোনাম (অসমীয়া - বৈকল্পিক)
                </label>
                <input
                  type="text"
                  placeholder="যেনে: এম.এছচি. ডাটা চাইন্স পাঠ্যক্ৰম আৰু নিৰ্দেশনাৱলী ২০২৪"
                  value={uploadFormData.asTitle}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, asTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  University / Academic Institution <span className="text-[#FF933E]">*</span>
                </label>
                <select
                  value={uploadFormData.university}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, university: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                >
                  <option value="Gauhati University (GU)">Gauhati University (GU)</option>
                  <option value="Dibrugarh University (DU)">Dibrugarh University (DU)</option>
                  <option value="Tezpur University (TU)">Tezpur University (TU)</option>
                  <option value="Assam University (Silchar)">Assam University (Silchar)</option>
                  <option value="Cotton University">Cotton University</option>
                  <option value="All Universities of Assam">State-Wide Higher Education Council</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Classification / Category <span className="text-[#FF933E]">*</span>
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Department / School <span className="text-[#FF933E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadFormData.department}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={uploadFormData.academicYear}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, academicYear: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Executive Abstract & Core Provisions
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of ordinances, passing thresholds, attendance condonation, or syllabus modules covered..."
                value={uploadFormData.summary}
                onChange={(e) => setUploadFormData({ ...uploadFormData, summary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]"
              />
            </div>

            {/* OCR & Ingestion Pipeline Progress */}
            {isProcessing && (
              <div className="p-5 rounded-2xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] border-2 border-[#FF933E] dark:border-[#03C988] space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#000000] dark:text-[#FFFFFF]">
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] animate-spin" />
                    <span>{processingStage}</span>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full bg-[#FF933E] dark:bg-[#03C988] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || !selectedFile}
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-[#000000] hover:bg-[#E87A24] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>{isProcessing ? 'Processing Academic Document...' : 'Submit Document to Administrator Approval Queue'}</span>
            </button>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: MY SUBMISSIONS & APPROVAL TRACKER                            */}
      {/* =================================================================== */}
      {activeTab === 'my-submissions' && (
        <div className="space-y-6">
          <div className="neo-surface rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
              Departmental Submissions & Governance Workflow
            </h2>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
              Track the verification clearance of academic documents uploaded by faculty. Once approved by the administrator, documents automatically sync into the bilingual student AI chatbot.
            </p>
          </div>

          <div className="neo-surface rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000]/70 dark:text-[#FFFFFF]/80 font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Submission ID & Title</th>
                    <th className="p-4">University & Dept</th>
                    <th className="p-4">Pages / Chunks</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4">Chatbot Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#73A5CA]/20 dark:divide-[#1C82AD]/20 text-[#000000] dark:text-[#FFFFFF]">
                  {facultySubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#FFE9A9]/10 dark:hover:bg-[#13005A]/40 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-[10px] text-[#FF933E] dark:text-[#03C988] font-bold block">{sub.id}</span>
                        <span className="font-black text-sm">{sub.title}</span>
                        <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block">{sub.fileName} • {sub.fileSize}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold block">{sub.university}</span>
                        <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">{sub.department}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold">{sub.pages} Pages</span>
                        <span className="text-[10px] text-[#FF933E] dark:text-[#03C988] block">{sub.chunksCount} chunks (512-t)</span>
                      </td>

                      <td className="p-4">
                        {sub.approvalStatus === 'approved' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            <span>Approved & Indexed</span>
                          </span>
                        ) : sub.approvalStatus === 'rejected' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <XMarkIcon className="w-3.5 h-3.5" />
                            <span>Revision Needed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <ClockIcon className="w-3.5 h-3.5 animate-pulse" />
                            <span>Pending Admin Review</span>
                          </span>
                        )}
                        {sub.adminFeedback && (
                          <p className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1 italic">
                            Note: {sub.adminFeedback}
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        {sub.availableToChatbot ? (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#03C988]/20 text-[#03C988] border border-[#03C988]/40">
                            Active in Chatbot
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            Blocked until Clearance
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveModalDoc(sub)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/20 text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Document Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="neo-surface rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 pb-3">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
                <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">{activeModalDoc.id}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A]">
                  {activeModalDoc.approvalStatus}
                </span>
              </div>
              <button
                onClick={() => setActiveModalDoc(null)}
                className="p-1 rounded-lg text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FFFFFF] cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">{activeModalDoc.title}</h3>
            
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              {activeModalDoc.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs">
              <div>
                <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">University & Dept:</span>
                <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{activeModalDoc.university} ({activeModalDoc.department})</span>
              </div>
              <div>
                <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">File Information:</span>
                <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{activeModalDoc.fileName} • {activeModalDoc.pages} Pages</span>
              </div>
              <div>
                <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">Vector Ingestion:</span>
                <span className="font-black text-[#FF933E] dark:text-[#03C988]">{activeModalDoc.chunksCount} Chunks (Bilingual BGE-M3)</span>
              </div>
              <div>
                <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">Submitted By:</span>
                <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{activeModalDoc.uploaderName}</span>
              </div>
            </div>

            <div className="p-3 bg-[#E0D4FD]/25 dark:bg-[#0A0A0A] rounded-xl text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
              <strong>Institutional Citation:</strong> {activeModalDoc.citation}
            </div>

            {activeModalDoc.sha256 && (
              <div className="text-[10px] font-mono text-[#000000]/60 dark:text-[#FFFFFF]/60 truncate">
                SHA-256: {activeModalDoc.sha256}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const doc = activeModalDoc;
                  setActiveModalDoc(null);
                  if (onNavigateTab) {
                    onNavigateTab('assistant', { prefillQuery: `Explain the detailed provisions and guidelines in: ${doc.title}` });
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-[#000000] hover:bg-[#E87A24] cursor-pointer shadow-xs"
              >
                Ask Assistant About This Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
