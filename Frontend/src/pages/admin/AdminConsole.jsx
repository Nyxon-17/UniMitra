import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HomeScreenBackground } from '../../components/common/HomeScreenBackground';
import { documentService } from '../../services/documentService';
import {
  BuildingLibraryIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  SearchIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
  FunnelIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserGroupIcon
} from '../../components/common/Icons';

export const AdminConsole = ({
  onExit,
  currentLang = 'en',
  onToggleLang,
  isDark = false,
  onToggleTheme
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  // 10 Administrator Management Tabs
  // 'repository' | 'upload' | 'categories' | 'processing' | 'analytics' | 'unanswered' | 'feedback' | 'users' | 'health' | 'llm-config'
  const validTabs = ['repository', 'upload', 'categories', 'processing', 'analytics', 'unanswered', 'feedback', 'users', 'health', 'llm-config'];
  const [activeTab, setActiveTab] = useState(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'repository'
  );

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const [selectedUnivFilter, setSelectedUnivFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [inspectDocModal, setInspectDocModal] = useState(null);
  const [actionAlert, setActionAlert] = useState('');

  // 1. Centralized Institutional Document Repository with Live Shared Service
  const [documents, setDocuments] = useState(() => documentService.getDocuments());
  const [categories, setCategories] = useState(() => documentService.getCategories());
  const [selectedApprovalFilter, setSelectedApprovalFilter] = useState('All');

  // Sync with document service updates across components
  const syncWithService = () => {
    setDocuments(documentService.getDocuments());
    setCategories(documentService.getCategories());
  };

  useEffect(() => {
    syncWithService();
    window.addEventListener('unimitra_documents_changed', syncWithService);
    return () => window.removeEventListener('unimitra_documents_changed', syncWithService);
  }, []);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');

  // 4. Processing Pipeline Jobs State
  const [pipelineJobs, setPipelineJobs] = useState([
    { id: 'JOB-901', docName: 'Dibrugarh_Univ_PhD_Ordinance_2024.pdf', stage: 'Embedding with Multilingual E5', progress: 78, status: 'In Progress' },
    { id: 'JOB-902', docName: 'Assam_DHE_Fee_Concession_Order.pdf', stage: 'Chunking (512 tokens / 64 overlap)', progress: 100, status: 'Completed' },
    { id: 'JOB-903', docName: 'Tezpur_Univ_Anti_Ragging_Affidavit.pdf', stage: 'Indexed in MongoDB Vector Search', progress: 100, status: 'Completed' },
    { id: 'JOB-904', docName: 'Scanned_Circular_1998_Ordinance.pdf', stage: 'OCR Scanned Processing', progress: 34, status: 'Needs OCR Review' }
  ]);

  // 5. Chatbot Usage & Analytics Metrics
  const analyticsData = {
    totalQueries: 14820,
    assameseQueries: 6240,
    englishQueries: 8580,
    dailyActiveSessions: 1840,
    hallucinationRejectionRate: '99.8%',
    topAskedTopics: [
      { topic: 'Attendance Condonation (75% rule)', count: 3210, univ: 'Gauhati Univ' },
      { topic: 'CBCS Backlog Clearing Timelines', count: 2840, univ: 'Dibrugarh Univ' },
      { topic: 'DHE Combined Merit Scholarship Eligibility', count: 2610, univ: 'All Assam' },
      { topic: 'Hostel Seat Allotment Merit Criteria', count: 1890, univ: 'Tezpur Univ' },
      { topic: 'CAS Promotion API Score Guidelines', count: 1420, univ: 'All State' }
    ]
  };

  // 6. Unanswered / Low-Confidence Questions Queue
  const [unansweredList, setUnansweredList] = useState([
    {
      id: 'UNANS-1',
      query: 'What is the exact penalty fee for late submission of PhD synopsis in Dibrugarh University?',
      asQuery: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়ত পিএইচডি চিনপচিচ পলমকৈ জমা দিলে মাচুল কিমান?',
      language: 'English',
      attemptedAt: 'Today at 01:14 PM',
      confidence: 'Low (42%)',
      reason: 'Clause on late synopsis penalty not found in indexed 2023 PhD ordinance.',
      university: 'Dibrugarh University (DU)',
      status: 'Awaiting Circular'
    },
    {
      id: 'UNANS-2',
      query: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ মহিলা হোষ্টেলত নিশা প্ৰৱেশৰ সময়সীমা কিমান?',
      asQuery: 'গুৱাহাটী বিশ্ববিদ্যালয়ৰ মহিলা হোষ্টেলত নিশা প্ৰৱেশৰ সময়সীমা কিমান?',
      language: 'Assamese',
      attemptedAt: 'Yesterday at 05:22 PM',
      confidence: 'Missing Document (36%)',
      reason: 'Hostel gate curfew circular for 2024-25 academic year not ingested.',
      university: 'Gauhati University (GU)',
      status: 'Awaiting Circular'
    },
    {
      id: 'UNANS-3',
      query: 'Is there any special fee concession for single girl child in undergraduate admissions?',
      asQuery: 'স্নাতক ভৰ্তিত একক কন্যা সন্তানৰ বাবে মাচুল ৰেহাই আছে নেকি?',
      language: 'English',
      attemptedAt: '2 days ago',
      confidence: 'Partial Context (51%)',
      reason: 'State merit scheme mentions reservation but fee concession gazette missing.',
      university: 'State Directorate (DHE)',
      status: 'Awaiting Circular'
    }
  ]);

  // 7. Review Feedback Queue (Synced with localStorage from Students & Faculty)
  const [feedbackList, setFeedbackList] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unimitra_feedback_submissions');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return [
      {
        id: 'FB-901',
        user: 'Partha Pratim Nath',
        role: 'Student',
        type: 'Outdated Regulation',
        university: 'Dibrugarh University (DU)',
        rating: 4,
        comments: 'The syllabus reference for 3rd semester CBCS was accurate, but please update the 2024 revised attendance condonation circular.',
        submittedAt: 'Yesterday',
        status: 'Pending Admin Review'
      },
      {
        id: 'FB-902',
        user: 'Dr. Diganta Goswami',
        role: 'Faculty Member',
        type: 'Accurate Citation',
        university: 'Gauhati University (GU)',
        rating: 5,
        comments: 'PBAS Table 2 research score breakdown matched the official UGC 2018 gazette exactly.',
        submittedAt: '3 days ago',
        status: 'Reviewed & Resolved'
      }
    ];
  });

  // 8. Manage Users & Roles State
  const [users, setUsers] = useState([
    {
      id: 'USR-01',
      name: 'Ananya Saikia',
      email: 'ananya.student@gauhati.ac.in',
      role: 'Student',
      department: 'Undergraduate Studies',
      identifier: 'STU-2024-082',
      status: 'Active',
      joinedAt: '12 Aug 2024'
    },
    {
      id: 'USR-02',
      name: 'Dr. Diganta Goswami',
      email: 'dr.goswami@gauhati.ac.in',
      role: 'Faculty Member',
      department: 'Computer Science & Engineering',
      identifier: 'UM-FAC-8241',
      designation: 'Associate Professor',
      status: 'Active',
      joinedAt: '04 Jul 2024'
    },
    {
      id: 'USR-03',
      name: 'Prof. Manabendra Sarma',
      email: 'm.sarma@dibru.ac.in',
      role: 'Faculty Member',
      department: 'Mathematics & Statistics',
      identifier: 'UM-FAC-7294',
      designation: 'Professor & HOD',
      status: 'Active',
      joinedAt: '19 Jun 2024'
    },
    {
      id: 'USR-04',
      name: 'System Super User',
      email: 'admin@unimitra.edu.in',
      role: 'Admin',
      department: 'Institutional Governance',
      identifier: 'SUPER-ROOT-01',
      status: 'Active',
      joinedAt: '01 Jan 2024'
    }
  ]);

  // 9. AI System Health State
  const systemHealth = {
    apiStatus: 'Operational (200 OK)',
    vectorDbStatus: 'Connected (MongoDB Atlas Vector Search)',
    embeddingModel: 'Multilingual E5-Large (1024 dimensions)',
    embeddingLatencyMs: 38,
    vectorSearchLatencyMs: 64,
    clusterMemoryUsage: '412 MB / 2048 MB',
    activeChunkCount: 14890,
    uptime: '99.98% (30 days)'
  };

  // 10. LLM Provider Configuration State
  const [llmConfig, setLlmConfig] = useState({
    provider: 'Gemini 1.5 Pro', // 'Gemini 1.5 Pro' | 'Groq (Llama 3.3 70B)'
    temperature: 0.1,
    topP: 0.85,
    topKChunks: 6,
    strictnessThreshold: 0.82,
    enableAssameseFallback: true,
    apiKeyConfigured: true
  });

  const triggerToast = (msg) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(''), 3000);
  };

  // Document Management Actions: Approve, Reject, Archive, Delete
  const handleApproveDoc = (id) => {
    documentService.approveDocument(id, 'Approved by Administrator. Vectorized into Chatbot Knowledge Base.');
    triggerToast('Document approved & vector indexed! Available immediately to students in the AI chatbot.');
  };

  const handleRejectDoc = (id) => {
    const reason = window.prompt('Enter reason for revision request / rejection:', 'Missing official university seal or departmental resolution date.');
    if (reason !== null && reason.trim()) {
      documentService.rejectDocument(id, reason.trim());
      triggerToast('Document rejected. Feedback notification routed to faculty author.');
    }
  };

  const handleArchiveDoc = (id) => {
    documentService.archiveDocument(id);
    triggerToast('Document archive status toggled successfully.');
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this document from institutional storage?')) {
      documentService.deleteDocument(id);
      triggerToast('Document deleted from institutional repository.');
    }
  };

  // Category Taxonomy Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    documentService.addCategory({
      name: newCatName.trim(),
      asName: newCatName.trim(),
      code: newCatCode.trim().toUpperCase() || 'GEN'
    });
    setNewCatName('');
    setNewCatCode('');
    triggerToast('New document category registered in university taxonomy.');
  };

  const handleDeleteCategory = (id) => {
    documentService.deleteCategory(id);
    triggerToast('Category removed from taxonomy.');
  };

  // Upload Document Simulation
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFormData.title.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStepName('Extracting text with PyMuPDF...');

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStepName('Generating chunk embeddings with Multilingual E5...');

      setTimeout(() => {
        setUploadProgress(85);
        setUploadStepName('Storing 1024-d vectors into ChromaDB / MongoDB...');

        setTimeout(() => {
          setUploadProgress(100);
          setUploadStepName('Indexing complete!');

          documentService.uploadAdminDocument({
            title: uploadFormData.title,
            university: uploadFormData.university,
            category: uploadFormData.category,
            department: uploadFormData.department,
            academicYear: uploadFormData.academicYear,
            sourceUrl: uploadFormData.sourceUrl || '',
            ocrApplied: uploadFormData.enableOcr
          });

          setIsUploading(false);
          setUploadProgress(0);
          setUploadFormData({ ...uploadFormData, title: '', sourceUrl: '' });
          handleTabChange('repository');
          triggerToast('Master gazette directly ingested, vectorized, and live for AI chatbot!');
        }, 600);
      }, 700);
    }, 600);
  };

  // Toggle User Status
  const handleToggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u))
    );
    triggerToast('User status updated.');
  };

  // Toggle Feedback Status
  const handleResolveFeedback = (id) => {
    const updated = feedbackList.map((f) =>
      f.id === id ? { ...f, status: f.status === 'Reviewed & Resolved' ? 'Pending Admin Review' : 'Reviewed & Resolved' } : f
    );
    setFeedbackList(updated);
    localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(updated));
    triggerToast('Feedback resolution status updated.');
  };

  const pendingDocs = documents.filter((d) => d.approvalStatus === 'pending');
  const approvedDocs = documents.filter((d) => d.approvalStatus === 'approved' && d.status === 'Indexed');
  const archivedDocs = documents.filter((d) => d.status === 'Archived');
  const rejectedDocs = documents.filter((d) => d.approvalStatus === 'rejected');

  const filteredDocs = documents.filter((doc) => {
    const matchUniv = selectedUnivFilter === 'All' || doc.university.includes(selectedUnivFilter.split(' ')[0]);
    const matchCat = selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    const matchApproval =
      selectedApprovalFilter === 'All' ? true :
        selectedApprovalFilter === 'Pending' ? doc.approvalStatus === 'pending' :
          selectedApprovalFilter === 'Approved' ? (doc.approvalStatus === 'approved' && doc.status === 'Indexed') :
            selectedApprovalFilter === 'Archived' ? doc.status === 'Archived' :
              selectedApprovalFilter === 'Rejected' ? doc.approvalStatus === 'rejected' : true;
    const matchSearch =
      !searchDocQuery.trim() ||
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      (doc.asTitle && doc.asTitle.toLowerCase().includes(searchDocQuery.toLowerCase())) ||
      (doc.uploaderName && doc.uploaderName.toLowerCase().includes(searchDocQuery.toLowerCase())) ||
      doc.id.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchUniv && matchCat && matchApproval && matchSearch;
  });

  return (
    <div className={`relative min-h-screen bg-transparent text-[#000000] dark:text-[#FFFFFF] flex flex-col transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <HomeScreenBackground />

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#00337C]/95 backdrop-blur-xs border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-full flex items-center justify-between h-20">

          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FFFFFF] hover:bg-[#FFE9A9]/40 cursor-pointer"
              title="Return to University Portal"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white flex items-center justify-center shadow-xs">
              <BuildingLibraryIcon className="w-6 h-6 text-white dark:text-[#000000]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
                  Uni<span className="text-[#FF933E] dark:text-[#03C988]">Mitra</span>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] font-black text-[10px] tracking-wider uppercase border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80 font-semibold">
                Bilingual Knowledge Base & System Governance Console
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-[#03C988]" /> : <MoonIcon className="w-4 h-4 text-[#FF933E]" />}
            </button>

            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-black text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
            >
              {currentLang === 'en' ? 'অসমীয়া' : 'English'}
            </button>

            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] dark:hover:bg-[#02B377] cursor-pointer shadow-xs"
            >
              Exit Console
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 space-y-6 relative z-10">

        {/* Toast Alert */}
        {actionAlert && (
          <div className="p-3 rounded-2xl bg-[#FFE9A9]/40 dark:bg-[#00337C] border-2 border-[#FF933E] dark:border-[#03C988] text-xs font-black text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-2 shadow-xs">
            <CheckCircleIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
            <span>{actionAlert}</span>
          </div>
        )}

        {/* 10 Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
          {[
            { id: 'repository', label: '1. Documents & Archives' },
            { id: 'upload', label: '2. Upload PDF' },
            { id: 'categories', label: '3. Categories' },
            { id: 'processing', label: '4. Processing Pipeline' },
            { id: 'analytics', label: '5. Chatbot Usage' },
            { id: 'unanswered', label: '6. Unanswered Queries' },
            { id: 'feedback', label: '7. Review Feedback' },
            { id: 'users', label: '8. Users & Roles' },
            { id: 'health', label: '9. System Health' },
            { id: 'llm-config', label: '10. LLM Config' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
                ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white shadow-xs'
                : 'bg-white dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =================================================================== */}
        {/* 1. DOCUMENT REPOSITORY (DELETE & ARCHIVE)                           */}
        {/* =================================================================== */}
        {activeTab === 'repository' && (
          <div className="space-y-4">

            {/* Pending Faculty Review Alert Banner */}
            {pendingDocs.length > 0 && (
              <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
                    <ClockIcon className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                      {pendingDocs.length} Academic Submission{pendingDocs.length > 1 ? 's' : ''} Awaiting Administrator Review
                    </h4>
                    <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      Uploaded by university faculty members. Require approval & vector indexing before becoming active for students in the AI chatbot.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApprovalFilter('Pending')}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Review Pending Submissions ({pendingDocs.length})
                </button>
              </div>
            )}

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">

              {/* Approval Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/70 mr-1 shrink-0">
                  Workflow:
                </span>
                {[
                  { id: 'All', label: 'All Records', count: documents.length },
                  { id: 'Pending', label: 'Faculty Pending Approval', count: pendingDocs.length, alert: pendingDocs.length > 0 },
                  { id: 'Approved', label: 'Active & Vector Indexed', count: approvedDocs.length },
                  { id: 'Archived', label: 'Archived', count: archivedDocs.length },
                  { id: 'Rejected', label: 'Revision Needed', count: rejectedDocs.length }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedApprovalFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${selectedApprovalFilter === pill.id
                        ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                        : pill.alert
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                          : 'bg-[#FFE9A9]/20 dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
                      }`}
                  >
                    <span>{pill.label}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">
                      {pill.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dropdowns & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#73A5CA]/20 dark:border-[#1C82AD]/20">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedUnivFilter}
                    onChange={(e) => setSelectedUnivFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                  >
                    <option value="All">All Universities</option>
                    <option value="Gauhati">Gauhati University (GU)</option>
                    <option value="Dibrugarh">Dibrugarh University (DU)</option>
                    <option value="Tezpur">Tezpur University (TU)</option>
                    <option value="All Assam">All Assam Universities</option>
                  </select>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full sm:w-72">
                  <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search title, ID, or uploader..."
                    value={searchDocQuery}
                    onChange={(e) => setSearchDocQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>

            {/* Document Table */}
            <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFE9A9]/20 dark:bg-[#13005A] border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000]/70 dark:text-[#FFFFFF]/80 font-black uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Document Title & ID</th>
                      <th className="p-4">Origin & Uploader</th>
                      <th className="p-4">Pages / Vectors</th>
                      <th className="p-4">Governance Status</th>
                      <th className="p-4">Chatbot Clearance</th>
                      <th className="p-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#73A5CA]/20 dark:divide-[#1C82AD]/20 text-[#000000] dark:text-[#FFFFFF]">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#FFE9A9]/10 dark:hover:bg-[#13005A]/40 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-[10px] text-[#FF933E] dark:text-[#03C988] font-bold block">{doc.id}</span>
                          <span className="font-black text-xs sm:text-sm">{doc.title}</span>
                          <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block">{doc.category}</span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold block">{doc.university}</span>
                          <div className="flex items-center space-x-1 mt-0.5">
                            {doc.uploaderRole === 'Faculty' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                                Faculty: {doc.uploaderName}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#73A5CA]/20 dark:bg-[#00337C] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                                Super Admin Direct
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-bold">{doc.pages} pages</span>
                          <span className="text-[11px] text-[#FF933E] dark:text-[#03C988] block">{doc.chunksCount} chunks (512-t)</span>
                        </td>

                        <td className="p-4">
                          {doc.approvalStatus === 'pending' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              <ClockIcon className="w-3.5 h-3.5 animate-pulse" />
                              <span>Pending Review</span>
                            </span>
                          ) : doc.approvalStatus === 'rejected' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                              <XMarkIcon className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </span>
                          ) : doc.status === 'Archived' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9]/40 text-[#000000] dark:bg-[#13005A] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                              Archived
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border border-green-300 dark:border-green-800">
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Vector Indexed</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {doc.availableToChatbot ? (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#03C988]/20 text-[#03C988] border border-[#03C988]/40">
                              Live for Students
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFE9A9]/30 dark:bg-[#13005A] text-[#000000]/70 dark:text-[#FFFFFF]/70 border border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
                              Locked from Chatbot
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {doc.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveDoc(doc.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-black text-[11px] cursor-pointer shadow-xs inline-flex items-center space-x-1"
                                title="Approve & Vector Index into AI Chatbot"
                              >
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                <span>Approve & Ingest</span>
                              </button>
                              <button
                                onClick={() => handleRejectDoc(doc.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-600 hover:bg-red-50 font-bold text-[11px] cursor-pointer inline-flex items-center space-x-1"
                                title="Reject / Request Revisions"
                              >
                                <XMarkIcon className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {doc.approvalStatus === 'approved' && (
                            <button
                              onClick={() => handleArchiveDoc(doc.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 font-bold text-[11px] cursor-pointer"
                            >
                              {doc.status === 'Archived' ? 'Restore' : 'Archive'}
                            </button>
                          )}

                          {doc.approvalStatus === 'rejected' && (
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Approve Override
                            </button>
                          )}

                          <button
                            onClick={() => setInspectDocModal(doc)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 font-bold text-[11px] cursor-pointer"
                          >
                            Inspect
                          </button>

                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-600 hover:bg-red-50 font-bold text-[11px] cursor-pointer"
                          >
                            Delete
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

        {/* =================================================================== */}
        {/* 2. UPLOAD PDF DOCUMENTS                                             */}
        {/* =================================================================== */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
                Upload & Ingest University PDF Document
              </h2>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                Upload official gazettes, circulars, or regulations for automated OCR, Multilingual E5 chunk embedding, and vector indexing.
              </p>
            </div>

            {isUploading ? (
              <div className="p-8 text-center space-y-4 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <SparklesIcon className="w-10 h-10 text-[#FF933E] dark:text-[#03C988] animate-spin mx-auto" />
                <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">{uploadStepName}</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                  <div className="bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">{uploadProgress}% Complete</span>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Revised Ordinance on CBCS Examination & Evaluation 2024"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Target University *
                    </label>
                    <select
                      value={uploadFormData.university}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                    >
                      <option>Gauhati University (GU)</option>
                      <option>Dibrugarh University (DU)</option>
                      <option>Tezpur University (TU)</option>
                      <option>Assam University (Silchar)</option>
                      <option>All Assam Universities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Document Category *
                    </label>
                    <select
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                    Original Source URL or Circular Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://gauhati.ac.in/academic/notification-2024.pdf"
                    value={uploadFormData.sourceUrl}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, sourceUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="ocr-toggle"
                    checked={uploadFormData.enableOcr}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, enableOcr: e.target.checked })}
                    className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] rounded"
                  />
                  <label htmlFor="ocr-toggle" className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] cursor-pointer">
                    Enable Optical Character Recognition (OCR) for scanned Assamese & English PDF pages
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] dark:hover:bg-[#02B377] transition-all cursor-pointer shadow-sm"
                >
                  Start PDF Extraction & Vector Indexing Pipeline
                </button>
              </form>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. MANAGE DOCUMENT CATEGORIES                                       */}
        {/* =================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF] mb-4">
                Add New Document Category
              </h3>
              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g. Hostels & Welfare)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                />
                <input
                  type="text"
                  placeholder="Code (e.g. WELFARE)"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className="w-full sm:w-36 px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] dark:hover:bg-[#02B377] cursor-pointer"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF933E] dark:text-[#03C988] uppercase">{c.code}</span>
                    <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">{c.name}</h4>
                    <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 font-semibold">{c.count} Documents Ingested</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete Category"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. VIEW DOCUMENT PROCESSING STATUS                                  */}
        {/* =================================================================== */}
        {activeTab === 'processing' && (
          <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
              Real-Time Document Processing & Embedding Pipeline
            </h3>
            <div className="space-y-3">
              {pipelineJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">{job.id} • {job.docName}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${job.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] h-full" style={{ width: `${job.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    <span>Stage: {job.stage}</span>
                    <span>{job.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. MONITOR CHATBOT USAGE                                            */}
        {/* =================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <span className="text-xs font-black text-[#000000]/70 dark:text-[#FFFFFF]/80 uppercase">Total Queries</span>
                <p className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] mt-1">{analyticsData.totalQueries.toLocaleString()}</p>
                <span className="text-[11px] text-green-600 font-bold">+14% this month</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <span className="text-xs font-black text-[#000000]/70 dark:text-[#FFFFFF]/80 uppercase">Assamese Language</span>
                <p className="text-2xl sm:text-3xl font-black text-[#FF933E] dark:text-[#03C988] mt-1">{analyticsData.assameseQueries.toLocaleString()}</p>
                <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">42.1% bilingual query ratio</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <span className="text-xs font-black text-[#000000]/70 dark:text-[#FFFFFF]/80 uppercase">English Language</span>
                <p className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] mt-1">{analyticsData.englishQueries.toLocaleString()}</p>
                <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">57.9% bilingual query ratio</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                <span className="text-xs font-black text-[#000000]/70 dark:text-[#FFFFFF]/80 uppercase">Hallucination Rejection</span>
                <p className="text-2xl sm:text-3xl font-black text-green-600 mt-1">{analyticsData.hallucinationRejectionRate}</p>
                <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">Strict RAG source grounding</span>
              </div>
            </div>

            {/* Top Query Topics */}
            <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                Top Inquired Academic & Regulatory Topics
              </h3>
              <div className="space-y-2">
                {analyticsData.topAskedTopics.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{item.topic}</span>
                      <span className="text-[10px] text-[#FF933E] dark:text-[#03C988] block">{item.univ}</span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#FF933E] dark:text-[#03C988]">{item.count} queries</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. VIEW UNANSWERED QUESTIONS                                        */}
        {/* =================================================================== */}
        {activeTab === 'unanswered' && (
          <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                Unanswered Queries & Missing Context Queue
              </h3>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                Student/Faculty queries where AI lacked official document coverage. Upload the requested circular to fill the knowledge gap.
              </p>
            </div>

            <div className="space-y-3">
              {unansweredList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-red-500">{item.id} • {item.confidence}</span>
                    <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">{item.university} • {item.attemptedAt}</span>
                  </div>
                  <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">"{item.query}"</h4>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">Missing Reason: {item.reason}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setUploadFormData((prev) => ({ ...prev, title: `Circular for ${item.query.slice(0, 40)}`, university: item.university }));
                        handleTabChange('upload');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] dark:hover:bg-[#02B377] cursor-pointer"
                    >
                      Upload Circular to Ground This Query ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. REVIEW FEEDBACK                                                  */}
        {/* =================================================================== */}
        {activeTab === 'feedback' && (
          <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                Student & Faculty AI Feedback Review
              </h3>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                Feedback submitted directly from the bilingual assistant interface.
              </p>
            </div>

            <div className="space-y-3">
              {feedbackList.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-[#000000] dark:text-[#FFFFFF]">{f.user} ({f.role})</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FFE9A9] dark:bg-[#13005A]">
                        {f.type}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">Rating: {f.rating}/5 ★</span>
                  </div>
                  <p className="text-xs text-[#000000] dark:text-[#FFFFFF] leading-relaxed">{f.comments}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40/40 text-xs">
                    <span className="text-[#000000]/70 dark:text-[#FFFFFF]/80">Status: <strong>{f.status}</strong></span>
                    <button
                      onClick={() => handleResolveFeedback(f.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold border border-[#FF933E] dark:border-[#03C988] hover:bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:text-white cursor-pointer"
                    >
                      {f.status === 'Reviewed & Resolved' ? 'Mark Pending' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 8. MANAGE USERS AND ROLES                                           */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                User Accounts & Institutional Roles
              </h3>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                Verified accounts across Students, Faculty Members (with Unique Member IDs), and Super Administrators.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFE9A9]/20 dark:bg-[#13005A] border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000]/70 dark:text-[#FFFFFF]/80 font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Institutional Role</th>
                    <th className="p-4">Member ID / Code</th>
                    <th className="p-4">Department / Rank</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#73A5CA]/30 dark:divide-[#1C82AD]/30 text-[#000000] dark:text-[#FFFFFF]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FFE9A9]/20/60 dark:hover:bg-[#1C82AD]/40/40">
                      <td className="p-4">
                        <span className="font-black text-sm block">{u.name}</span>
                        <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#FFE9A9] dark:bg-[#13005A]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-xs text-[#FF933E] dark:text-[#03C988]">{u.identifier}</td>
                      <td className="p-4">
                        <span className="font-bold block">{u.department}</span>
                        {u.designation && <span className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/80">{u.designation}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="px-2.5 py-1 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 font-bold text-[11px] cursor-pointer"
                        >
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 9. VIEW AI SYSTEM HEALTH                                            */}
        {/* =================================================================== */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/80">FastAPI Microservice</span>
                <p className="text-lg font-black text-green-600">{systemHealth.apiStatus}</p>
                <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">Uptime: {systemHealth.uptime}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/80">Vector Search Latency</span>
                <p className="text-lg font-black text-[#FF933E] dark:text-[#03C988]">{systemHealth.vectorSearchLatencyMs} ms</p>
                <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">MongoDB Atlas Atlas Index</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/80">Embedding Inference</span>
                <p className="text-lg font-black text-[#FF933E] dark:text-[#03C988]">{systemHealth.embeddingLatencyMs} ms</p>
                <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">{systemHealth.embeddingModel}</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl shadow-xs space-y-3">
              <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                Cluster Resource Allocation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-xl border border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40">
                  <span className="text-[#000000]/70 dark:text-[#FFFFFF]/80 block">RAM Allocation:</span>
                  <strong className="text-sm font-black">{systemHealth.clusterMemoryUsage}</strong>
                </div>
                <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-xl border border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40">
                  <span className="text-[#000000]/70 dark:text-[#FFFFFF]/80 block">Active Indexed Chunks:</span>
                  <strong className="text-sm font-black">{systemHealth.activeChunkCount.toLocaleString()} Vectors</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 10. CONFIGURE THE LLM PROVIDER                                     */}
        {/* =================================================================== */}
        {activeTab === 'llm-config' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                LLM Provider & RAG Hyperparameter Configuration
              </h3>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                Configure the primary inference backend between Google Gemini and Groq Cloud.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-2">
                  Select Active LLM Engine
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Gemini 1.5 Pro', 'Groq (Llama 3.3 70B)'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setLlmConfig({ ...llmConfig, provider: p })}
                      className={`p-3 rounded-2xl border-2 text-xs font-black cursor-pointer transition-all ${llmConfig.provider === p
                        ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white border-[#FF933E] dark:border-[#03C988]'
                        : 'bg-[#FFE9A9]/20 dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  <span>Temperature (Strict Grounding):</span>
                  <span>{llmConfig.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={llmConfig.temperature}
                  onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-[#FF933E] dark:accent-[#03C988] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  <span>Top-K Retrieved Vector Chunks:</span>
                  <span>{llmConfig.topKChunks}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={llmConfig.topKChunks}
                  onChange={(e) => setLlmConfig({ ...llmConfig, topKChunks: parseInt(e.target.value) })}
                  className="w-full accent-[#FF933E] dark:accent-[#03C988] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                  <span>Grounding Strictness Threshold:</span>
                  <span>{llmConfig.strictnessThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.01"
                  value={llmConfig.strictnessThreshold}
                  onChange={(e) => setLlmConfig({ ...llmConfig, strictnessThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-[#FF933E] dark:accent-[#03C988] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-xl border border-[#73A5CA]/40/60 dark:border-[#1C82AD]/40 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                API Status: <strong className="text-green-600">Active & Authorized via Environment Variable</strong>
              </div>

              <button
                type="button"
                onClick={() => triggerToast('LLM Configuration saved and propagated to FastAPI service!')}
                className="w-full py-3 rounded-2xl font-black text-sm text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#E87A24] dark:hover:bg-[#02B377] cursor-pointer shadow-sm"
              >
                Save LLM & Retrieval Configuration
              </button>
            </div>
          </div>
        )}


        {/* Administrator Inspect Document Modal */}
        {inspectDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">

              <div className="flex items-center justify-between border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 pb-3">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
                  <span className="text-xs font-mono font-bold text-[#FF933E] dark:text-[#03C988]">{inspectDocModal.id}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF]">
                    {inspectDocModal.category}
                  </span>
                </div>
                <button
                  onClick={() => setInspectDocModal(null)}
                  className="p-1 rounded-lg text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/80 dark:hover:text-[#FFFFFF] cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {inspectDocModal.title}
                </h3>
                {inspectDocModal.asTitle && (
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70 mt-0.5">
                    {inspectDocModal.asTitle}
                  </p>
                )}
              </div>

              {/* Status & Governance Banner */}
              <div className="p-3.5 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#13005A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/70 block">
                    Governance Status
                  </span>
                  <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                    {inspectDocModal.approvalStatus === 'approved'
                      ? 'Approved & Vector Indexed (Live for Students)'
                      : inspectDocModal.approvalStatus === 'pending'
                        ? 'Pending Administrator Verification (Locked from Chatbot)'
                        : 'Revision Requested / Rejected'}
                  </span>
                </div>

                {inspectDocModal.approvalStatus === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        handleApproveDoc(inspectDocModal.id);
                        setInspectDocModal(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs cursor-pointer shadow-xs"
                    >
                      Approve & Vectorize
                    </button>
                    <button
                      onClick={() => {
                        handleRejectDoc(inspectDocModal.id);
                        setInspectDocModal(null);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                {inspectDocModal.summary || 'Official academic document uploaded into institutional repository.'}
              </p>

              {/* Metadata Breakdown */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-white dark:bg-[#00337C] rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs">
                <div>
                  <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">University & Dept:</span>
                  <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{inspectDocModal.university} ({inspectDocModal.department || 'General'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">File & Format:</span>
                  <span className="font-black text-[#000000] dark:text-[#FFFFFF]">{inspectDocModal.fileName || inspectDocModal.fileType || 'PDF'} • {inspectDocModal.pages} Pages</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">Vector Ingestion:</span>
                  <span className="font-black text-[#FF933E] dark:text-[#03C988]">{inspectDocModal.chunksCount} Chunks (BGE-M3 Multilingual)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 block font-bold">Uploader:</span>
                  <span className="font-black text-[#000000] dark:text-[#FFFFFF]">
                    {inspectDocModal.uploaderRole === 'Faculty' ? `Faculty: ${inspectDocModal.uploaderName}` : 'Super Administrator'}
                  </span>
                </div>
              </div>

              {inspectDocModal.citation && (
                <div className="p-3 bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-xl text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                  <strong>Official Citation Source:</strong> {inspectDocModal.citation}
                </div>
              )}

              {inspectDocModal.adminFeedback && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300">
                  <strong>Administrator Feedback Note:</strong> {inspectDocModal.adminFeedback}
                </div>
              )}

              {inspectDocModal.sha256 && (
                <div className="text-[10px] font-mono text-[#000000]/60 dark:text-[#FFFFFF]/60 truncate">
                  SHA-256 Digest: {inspectDocModal.sha256}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setInspectDocModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-[#000000] hover:bg-[#E87A24] cursor-pointer shadow-xs"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

      </main>


    </div>
  );
};
