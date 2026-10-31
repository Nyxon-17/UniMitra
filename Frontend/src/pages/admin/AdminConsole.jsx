import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

  // 1. Centralized Institutional Document Repository (with Archive & Delete)
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-GU-001',
      title: 'Undergraduate Examination Ordinances & Passing Criteria',
      university: 'Gauhati University (GU)',
      category: 'University Regulations & Ordinances',
      department: 'Examination Branch',
      academicYear: '2024-2025',
      publicationDate: '15 July 2024',
      pages: 48,
      fileSize: '3.4 MB',
      chunksCount: 284,
      status: 'Indexed', // 'Indexed' | 'Archived' | 'Processing' | 'Failed OCR'
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: false,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      sourceUrl: 'https://gauhati.ac.in/academics/exam-ordinance-2024.pdf'
    },
    {
      id: 'DOC-DU-002',
      title: 'Statutory Regulations on Class Attendance & Medical Condonation',
      university: 'Dibrugarh University (DU)',
      category: 'University Regulations & Ordinances',
      department: 'Academic Council',
      academicYear: '2024-2025',
      publicationDate: '02 August 2024',
      pages: 36,
      fileSize: '2.8 MB',
      chunksCount: 198,
      status: 'Indexed',
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: false,
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sourceUrl: 'https://dibru.ac.in/academic/attendance-ordinance.pdf'
    },
    {
      id: 'DOC-DHE-003',
      title: 'Assam State Combined Merit Scholarship Scheme Guidelines',
      university: 'All Assam Universities',
      category: 'Scholarships & State Grants',
      department: 'Directorate of Higher Education',
      academicYear: '2024-2025',
      publicationDate: '10 September 2024',
      pages: 18,
      fileSize: '1.2 MB',
      chunksCount: 92,
      status: 'Indexed',
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: true,
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      sourceUrl: 'https://dhe.assam.gov.in/schemes/scholarship-circular-2024.pdf'
    },
    {
      id: 'DOC-TU-004',
      title: 'Hostel Allotment & Student Code of Conduct Ordinances',
      university: 'Tezpur University (TU)',
      category: 'Campus Facilities & Hostels',
      department: 'Dean of Students Welfare',
      academicYear: '2024-2025',
      publicationDate: '12 August 2024',
      pages: 26,
      fileSize: '1.9 MB',
      chunksCount: 140,
      status: 'Indexed',
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: false,
      sha256: '7b52009b64fd0a2a49e6d8a939753077792b0554acd5127e0291931855b7022f',
      sourceUrl: 'https://tezu.ernet.in/admin/hostel-regulations.pdf'
    },
    {
      id: 'DOC-GU-005',
      title: 'Career Advancement Scheme (CAS) Guidelines for University Teachers',
      university: 'Gauhati University (GU)',
      category: 'Faculty Ordinances & Workload',
      department: 'Academic Council',
      academicYear: '2024-2025',
      publicationDate: '14 May 2024',
      pages: 64,
      fileSize: '4.2 MB',
      chunksCount: 310,
      status: 'Indexed',
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: false,
      sha256: '38a9d1502447b93a26880bd45c61d56e077c59919f2a009477e60058b76e1a90',
      sourceUrl: 'https://gauhati.ac.in/faculty/cas-guidelines-2024.pdf'
    }
  ]);

  // 2. Upload PDF Documents Form State
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    university: 'Gauhati University (GU)',
    category: 'University Regulations & Ordinances',
    department: 'Examination Branch / Academic Council',
    academicYear: '2024-2025',
    sourceUrl: '',
    enableOcr: true,
    chunkSize: 512,
    chunkOverlap: 64
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepName, setUploadStepName] = useState('');

  // 3. Document Categories State
  const [categories, setCategories] = useState([
    { id: 'CAT-1', name: 'University Regulations & Ordinances', asName: 'বিশ্ববিদ্যালয়ৰ নিয়মাৱলী', count: 48, code: 'REG' },
    { id: 'CAT-2', name: 'Examinations & Evaluation', asName: 'পৰীক্ষা আৰু মূল্যায়ন', count: 34, code: 'EXAM' },
    { id: 'CAT-3', name: 'Scholarships & State Grants', asName: 'ছাত্ৰবৃত্তি আৰু অনুদান', count: 22, code: 'SCHOL' },
    { id: 'CAT-4', name: 'Admissions & Eligibility', asName: 'ভৰ্তি প্ৰক্ৰিয়া আৰু যোগ্যতা', count: 29, code: 'ADM' },
    { id: 'CAT-5', name: 'Campus Facilities & Hostels', asName: 'চৌহদৰ সুবিধা আৰু হোষ্টেল', count: 17, code: 'FACIL' },
    { id: 'CAT-6', name: 'Faculty Ordinances & Workload', asName: 'অধ্যাপক নিয়মাৱলী আৰু কৰ্মভাৰ', count: 19, code: 'FAC_NORM' }
  ]);
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

  // Document Management Actions: Archive, Delete, Restore
  const handleArchiveDoc = (id) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const newStatus = doc.status === 'Archived' ? 'Indexed' : 'Archived';
          return { ...doc, status: newStatus };
        }
        return doc;
      })
    );
    triggerToast('Document archive status toggled successfully.');
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm('Are you sure you want to delete this document from the knowledge base?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      triggerToast('Document deleted from institutional repository.');
    }
  };

  // Category Add
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = {
      id: `CAT-${categories.length + 1}`,
      name: newCatName.trim(),
      asName: newCatName.trim(),
      count: 0,
      code: newCatCode.trim().toUpperCase() || 'GEN'
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatCode('');
    triggerToast('New document category registered.');
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    triggerToast('Category removed.');
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
        setUploadStepName('Storing 1024-d vectors into MongoDB Atlas...');

        setTimeout(() => {
          setUploadProgress(100);
          setUploadStepName('Indexing complete!');

          const newDoc = {
            id: `DOC-INST-${Math.floor(100 + Math.random() * 900)}`,
            title: uploadFormData.title,
            university: uploadFormData.university,
            category: uploadFormData.category,
            department: uploadFormData.department,
            academicYear: uploadFormData.academicYear,
            publicationDate: 'Today',
            pages: 24,
            fileSize: '2.1 MB',
            chunksCount: 164,
            status: 'Indexed',
            processingStage: 'Vector Indexed (100%)',
            ocrApplied: uploadFormData.enableOcr,
            sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
            sourceUrl: uploadFormData.sourceUrl || 'https://university.ac.in/circulars/official.pdf'
          };

          setDocuments((prev) => [newDoc, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setUploadFormData({ ...uploadFormData, title: '', sourceUrl: '' });
          handleTabChange('repository');
          triggerToast('Document successfully chunked, embedded, and indexed!');
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

  const filteredDocs = documents.filter((doc) => {
    const matchUniv = selectedUnivFilter === 'All' || doc.university.includes(selectedUnivFilter.split(' ')[0]);
    const matchCat = selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    const matchSearch =
      !searchDocQuery.trim() ||
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchUniv && matchCat && matchSearch;
  });

  return (
    <div className={`min-h-screen bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] flex flex-col transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1C4412]/95 backdrop-blur-xs border-b border-[#B8CFB3] dark:border-[#728E6D] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-full flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-[#4F6D4B] hover:text-[#15370D] dark:text-[#E5CD82] dark:hover:text-[#FFF2B4] hover:bg-[#B8CFB3]/30 cursor-pointer"
              title="Return to University Portal"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#84A282] text-white flex items-center justify-center shadow-xs">
              <BuildingLibraryIcon className="w-6 h-6 text-[#FEFAF3]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-[#15370D] dark:text-[#FFF2B4]">
                  Uni<span className="text-[#84A282]">Mitra</span>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#F6E2E9] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] font-black text-[10px] tracking-wider uppercase border border-[#B8CFB3] dark:border-[#728E6D]">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] font-semibold">
                Bilingual Knowledge Base & System Governance Console
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] cursor-pointer"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-[#FFF2B4]" /> : <MoonIcon className="w-4 h-4 text-[#15370D]" />}
            </button>

            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-black text-[#15370D] dark:text-[#FFF2B4] cursor-pointer"
            >
              {currentLang === 'en' ? 'অসমীয়া' : 'English'}
            </button>

            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#728E6D] cursor-pointer shadow-xs"
            >
              Exit Console
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 space-y-6">
        
        {/* Toast Alert */}
        {actionAlert && (
          <div className="p-3 rounded-2xl bg-[#B8CFB3]/40 border-2 border-[#84A282] text-xs font-black text-[#15370D] dark:text-[#FFF2B4] flex items-center space-x-2">
            <CheckCircleIcon className="w-4 h-4 text-[#84A282]" />
            <span>{actionAlert}</span>
          </div>
        )}

        {/* 10 Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#B8CFB3] dark:border-[#728E6D]">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#84A282] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] border border-[#B8CFB3] dark:border-[#728E6D] hover:bg-[#B8CFB3]/30'
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
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedUnivFilter}
                  onChange={(e) => setSelectedUnivFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
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
                  className="px-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <SearchIcon className="w-4 h-4 text-[#84A282] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter repository by title or ID..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] text-[#4F6D4B] dark:text-[#E5CD82] font-black uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Document Title & ID</th>
                      <th className="p-4">University & Category</th>
                      <th className="p-4">Pages / Chunks</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8CFB3]/40 dark:divide-[#728E6D]/40 text-[#15370D] dark:text-[#FFF2B4]">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#FEFAF3]/60 dark:hover:bg-[#15370D]/40 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-[10px] text-[#84A282] font-bold block">{doc.id}</span>
                          <span className="font-black text-xs sm:text-sm">{doc.title}</span>
                          <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] block">{doc.department}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold block">{doc.university}</span>
                          <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">{doc.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold">{doc.pages} pages</span>
                          <span className="text-[11px] text-[#84A282] block">{doc.chunksCount} chunks (512-t)</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                            doc.status === 'Indexed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleArchiveDoc(doc.id)}
                            className="px-2.5 py-1 rounded-lg border border-[#B8CFB3] dark:border-[#728E6D] hover:bg-[#B8CFB3]/30 font-bold text-[11px] cursor-pointer"
                          >
                            {doc.status === 'Archived' ? 'Restore' : 'Archive'}
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-900 text-red-600 hover:bg-red-50 font-bold text-[11px] cursor-pointer"
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
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#15370D] dark:text-[#FFF2B4]">
                Upload & Ingest University PDF Document
              </h2>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Upload official gazettes, circulars, or regulations for automated OCR, Multilingual E5 chunk embedding, and vector indexing.
              </p>
            </div>

            {isUploading ? (
              <div className="p-8 text-center space-y-4 bg-[#FEFAF3] dark:bg-[#15370D] rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D]">
                <SparklesIcon className="w-10 h-10 text-[#84A282] animate-spin mx-auto" />
                <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">{uploadStepName}</h3>
                <div className="w-full bg-[#B8CFB3]/40 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                  <div className="bg-[#84A282] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="text-xs font-mono font-bold text-[#84A282]">{uploadProgress}% Complete</span>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Revised Ordinance on CBCS Examination & Evaluation 2024"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Target University *
                    </label>
                    <select
                      value={uploadFormData.university}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                    >
                      <option>Gauhati University (GU)</option>
                      <option>Dibrugarh University (DU)</option>
                      <option>Tezpur University (TU)</option>
                      <option>Assam University (Silchar)</option>
                      <option>All Assam Universities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Document Category *
                    </label>
                    <select
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                    Original Source URL or Circular Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://gauhati.ac.in/academic/notification-2024.pdf"
                    value={uploadFormData.sourceUrl}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, sourceUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="ocr-toggle"
                    checked={uploadFormData.enableOcr}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, enableOcr: e.target.checked })}
                    className="w-4 h-4 text-[#84A282] rounded"
                  />
                  <label htmlFor="ocr-toggle" className="text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] cursor-pointer">
                    Enable Optical Character Recognition (OCR) for scanned Assamese & English PDF pages
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-[#84A282] hover:bg-[#728E6D] transition-all cursor-pointer shadow-sm"
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
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4] mb-4">
                Add New Document Category
              </h3>
              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g. Hostels & Welfare)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                />
                <input
                  type="text"
                  placeholder="Code (e.g. WELFARE)"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className="w-full sm:w-36 px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#728E6D] cursor-pointer"
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
                  className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] flex items-center justify-between shadow-xs"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#84A282] uppercase">{c.code}</span>
                    <h4 className="text-sm font-black text-[#15370D] dark:text-[#FFF2B4]">{c.name}</h4>
                    <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82] font-semibold">{c.count} Documents Ingested</span>
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
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
              Real-Time Document Processing & Embedding Pipeline
            </h3>
            <div className="space-y-3">
              {pipelineJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="p-4 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3]/60 dark:border-[#728E6D] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#84A282]">{job.id} • {job.docName}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      job.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="w-full bg-[#B8CFB3]/40 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#84A282] h-full" style={{ width: `${job.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">
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
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D]">
                <span className="text-xs font-black text-[#4F6D4B] dark:text-[#E5CD82] uppercase">Total Queries</span>
                <p className="text-2xl sm:text-3xl font-black text-[#15370D] dark:text-[#FFF2B4] mt-1">{analyticsData.totalQueries.toLocaleString()}</p>
                <span className="text-[11px] text-green-600 font-bold">+14% this month</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D]">
                <span className="text-xs font-black text-[#4F6D4B] dark:text-[#E5CD82] uppercase">Assamese Language</span>
                <p className="text-2xl sm:text-3xl font-black text-[#84A282] mt-1">{analyticsData.assameseQueries.toLocaleString()}</p>
                <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">42.1% bilingual query ratio</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D]">
                <span className="text-xs font-black text-[#4F6D4B] dark:text-[#E5CD82] uppercase">English Language</span>
                <p className="text-2xl sm:text-3xl font-black text-[#15370D] dark:text-[#FFF2B4] mt-1">{analyticsData.englishQueries.toLocaleString()}</p>
                <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">57.9% bilingual query ratio</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D]">
                <span className="text-xs font-black text-[#4F6D4B] dark:text-[#E5CD82] uppercase">Hallucination Rejection</span>
                <p className="text-2xl sm:text-3xl font-black text-green-600 mt-1">{analyticsData.hallucinationRejectionRate}</p>
                <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">Strict RAG source grounding</span>
              </div>
            </div>

            {/* Top Query Topics */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                Top Inquired Academic & Regulatory Topics
              </h3>
              <div className="space-y-2">
                {analyticsData.topAskedTopics.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FEFAF3] dark:bg-[#15370D] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#15370D] dark:text-[#FFF2B4]">{item.topic}</span>
                      <span className="text-[10px] text-[#84A282] block">{item.univ}</span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#84A282]">{item.count} queries</span>
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
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                Unanswered Queries & Missing Context Queue
              </h3>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Student/Faculty queries where AI lacked official document coverage. Upload the requested circular to fill the knowledge gap.
              </p>
            </div>

            <div className="space-y-3">
              {unansweredList.map((item) => (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3]/60 dark:border-[#728E6D] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-red-500">{item.id} • {item.confidence}</span>
                    <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">{item.university} • {item.attemptedAt}</span>
                  </div>
                  <h4 className="text-sm font-black text-[#15370D] dark:text-[#FFF2B4]">"{item.query}"</h4>
                  <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">Missing Reason: {item.reason}</p>
                  
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setUploadFormData((prev) => ({ ...prev, title: `Circular for ${item.query.slice(0, 40)}`, university: item.university }));
                        handleTabChange('upload');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#728E6D] cursor-pointer"
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
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                Student & Faculty AI Feedback Review
              </h3>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Feedback submitted directly from the bilingual assistant interface.
              </p>
            </div>

            <div className="space-y-3">
              {feedbackList.map((f) => (
                <div 
                  key={f.id}
                  className="p-4 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3]/60 dark:border-[#728E6D] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-[#15370D] dark:text-[#FFF2B4]">{f.user} ({f.role})</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#F6E2E9] dark:bg-[#728E6D]">
                        {f.type}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#84A282]">Rating: {f.rating}/5 ★</span>
                  </div>
                  <p className="text-xs text-[#15370D] dark:text-[#FFF2B4] leading-relaxed">{f.comments}</p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-[#B8CFB3]/40 dark:border-[#728E6D]/40 text-xs">
                    <span className="text-[#4F6D4B] dark:text-[#E5CD82]">Status: <strong>{f.status}</strong></span>
                    <button
                      onClick={() => handleResolveFeedback(f.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold border border-[#84A282] hover:bg-[#84A282] hover:text-white cursor-pointer"
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
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-[#B8CFB3] dark:border-[#728E6D]">
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                User Accounts & Institutional Roles
              </h3>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Verified accounts across Students, Faculty Members (with Unique Member IDs), and Super Administrators.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FEFAF3] dark:bg-[#15370D] border-b border-[#B8CFB3] dark:border-[#728E6D] text-[#4F6D4B] dark:text-[#E5CD82] font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Institutional Role</th>
                    <th className="p-4">Member ID / Code</th>
                    <th className="p-4">Department / Rank</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B8CFB3]/40 dark:divide-[#728E6D]/40 text-[#15370D] dark:text-[#FFF2B4]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FEFAF3]/60 dark:hover:bg-[#15370D]/40">
                      <td className="p-4">
                        <span className="font-black text-sm block">{u.name}</span>
                        <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#F6E2E9] dark:bg-[#728E6D]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-xs text-[#84A282]">{u.identifier}</td>
                      <td className="p-4">
                        <span className="font-bold block">{u.department}</span>
                        {u.designation && <span className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82]">{u.designation}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="px-2.5 py-1 rounded-lg border border-[#B8CFB3] dark:border-[#728E6D] hover:bg-[#B8CFB3]/30 font-bold text-[11px] cursor-pointer"
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
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#4F6D4B] dark:text-[#E5CD82]">FastAPI Microservice</span>
                <p className="text-lg font-black text-green-600">{systemHealth.apiStatus}</p>
                <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">Uptime: {systemHealth.uptime}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#4F6D4B] dark:text-[#E5CD82]">Vector Search Latency</span>
                <p className="text-lg font-black text-[#84A282]">{systemHealth.vectorSearchLatencyMs} ms</p>
                <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">MongoDB Atlas Atlas Index</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#4F6D4B] dark:text-[#E5CD82]">Embedding Inference</span>
                <p className="text-lg font-black text-[#84A282]">{systemHealth.embeddingLatencyMs} ms</p>
                <span className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">{systemHealth.embeddingModel}</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl shadow-xs space-y-3">
              <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                Cluster Resource Allocation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FEFAF3] dark:bg-[#15370D] rounded-xl border border-[#B8CFB3]/40 dark:border-[#728E6D]">
                  <span className="text-[#4F6D4B] dark:text-[#E5CD82] block">RAM Allocation:</span>
                  <strong className="text-sm font-black">{systemHealth.clusterMemoryUsage}</strong>
                </div>
                <div className="p-3 bg-[#FEFAF3] dark:bg-[#15370D] rounded-xl border border-[#B8CFB3]/40 dark:border-[#728E6D]">
                  <span className="text-[#4F6D4B] dark:text-[#E5CD82] block">Active Indexed Chunks:</span>
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
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#15370D] dark:text-[#FFF2B4]">
                LLM Provider & RAG Hyperparameter Configuration
              </h3>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Configure the primary inference backend between Google Gemini and Groq Cloud.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-2">
                  Select Active LLM Engine
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Gemini 1.5 Pro', 'Groq (Llama 3.3 70B)'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setLlmConfig({ ...llmConfig, provider: p })}
                      className={`p-3 rounded-2xl border-2 text-xs font-black cursor-pointer transition-all ${
                        llmConfig.provider === p
                          ? 'bg-[#84A282] text-white border-[#84A282]'
                          : 'bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] border-[#B8CFB3] dark:border-[#728E6D]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
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
                  className="w-full accent-[#84A282] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
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
                  className="w-full accent-[#84A282] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
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
                  className="w-full accent-[#84A282] cursor-pointer"
                />
              </div>

              <div className="p-3 bg-[#FEFAF3] dark:bg-[#15370D] rounded-xl border border-[#B8CFB3]/60 dark:border-[#728E6D] text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                API Status: <strong className="text-green-600">Active & Authorized via Environment Variable</strong>
              </div>

              <button
                type="button"
                onClick={() => triggerToast('LLM Configuration saved and propagated to FastAPI service!')}
                className="w-full py-3 rounded-2xl font-black text-sm text-white bg-[#84A282] hover:bg-[#728E6D] cursor-pointer shadow-sm"
              >
                Save LLM & Retrieval Configuration
              </button>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
