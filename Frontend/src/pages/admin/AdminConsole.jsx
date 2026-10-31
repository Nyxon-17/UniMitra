import { useState } from 'react';
import { 
  AcademicCapIcon, 
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
  LanguageIcon
} from '../../components/common/Icons';

export const AdminConsole = ({ 
  onExit, 
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme 
}) => {
  const [activeTab, setActiveTab] = useState('repository'); // 'repository' | 'upload' | 'crawler' | 'vector-search' | 'regulations'
  const [selectedUnivFilter, setSelectedUnivFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [inspectDocModal, setInspectDocModal] = useState(null);
  
  // Interactive Upload Pipeline States
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    university: 'Gauhati University (GU)',
    category: 'Curriculum & Syllabus',
    course: 'BCA (Computer Applications)',
    semester: 'Semester 3',
    subject: 'Database Management Systems',
    academicYear: '2024-2025',
    sourceUrl: 'https://gauhati.ac.in/academic/syllabus/bca',
    enableOcr: true,
    chunkSize: 512,
    chunkOverlap: 64
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepName, setUploadStepName] = useState('');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Retrieval Test Playground State
  const [testQuery, setTestQuery] = useState('What is BCNF and how does it differ from 3NF in DBMS?');
  const [retrievalResults, setRetrievalResults] = useState(null);
  const [isSearchingVector, setIsSearchingVector] = useState(false);

  // Centralized Document Knowledge Base Repository
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-GU-001',
      title: 'BCA CBCS Core Syllabus & Course Regulations',
      university: 'Gauhati University (GU)',
      category: 'Curriculum & Syllabus',
      course: 'BCA (Computer Applications)',
      semester: 'Semesters 1-6',
      subject: 'All Core Discipline Papers',
      academicYear: '2024-2025',
      publicationDate: '15 July 2024',
      pages: 84,
      fileSize: '4.2 MB',
      chunksCount: 348,
      status: 'Indexed',
      ocrApplied: false,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      sourceUrl: 'https://gauhati.ac.in/academics/bca-cbcs-2024.pdf'
    },
    {
      id: 'DOC-DU-002',
      title: 'BCA Curriculum & Examination Ordinances',
      university: 'Dibrugarh University (DU)',
      category: 'Curriculum & Syllabus',
      course: 'BCA (Computer Applications)',
      semester: 'Semesters 1-6',
      subject: 'Computer Science & Software Tech',
      academicYear: '2024-2025',
      publicationDate: '02 August 2024',
      pages: 76,
      fileSize: '3.8 MB',
      chunksCount: 312,
      status: 'Indexed',
      ocrApplied: false,
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      sourceUrl: 'https://dibru.ac.in/academic/syllabus/bca-ordinance.pdf'
    },
    {
      id: 'DOC-TU-003',
      title: 'B.Tech Computer Science & Engineering Ordinances',
      university: 'Tezpur University (TU)',
      category: 'Curriculum & Syllabus',
      course: 'B.Tech (CSE)',
      semester: 'Semesters 3-4',
      subject: 'Algorithms, Data Structures & OS',
      academicYear: '2024-2025',
      publicationDate: '10 June 2024',
      pages: 112,
      fileSize: '6.1 MB',
      chunksCount: 468,
      status: 'Indexed',
      ocrApplied: true,
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      sourceUrl: 'https://tezu.ernet.in/programs/btech-cse-curriculum.pdf'
    },
    {
      id: 'DOC-CU-004',
      title: 'Cotton University UG CBCS Examination Guidelines',
      university: 'Cotton University (CU)',
      category: 'Regulations & Guidelines',
      course: 'All UG Degree Programs',
      semester: 'All Semesters',
      subject: 'Grading, Attendance & Sessional Rules',
      academicYear: '2024-2025',
      publicationDate: '20 September 2024',
      pages: 32,
      fileSize: '1.9 MB',
      chunksCount: 144,
      status: 'Indexed',
      ocrApplied: false,
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      sourceUrl: 'https://cottonuniversity.ac.in/regulations/cbcs-exam-ug.pdf'
    },
    {
      id: 'DOC-GU-005',
      title: 'State Merit Post-Matric Scholarship Scheme Circular',
      university: 'All Assam Universities',
      category: 'Scholarships & Grants',
      course: 'General & Professional Degrees',
      semester: 'All Semesters',
      subject: 'Directorate of Higher Education Scheme',
      academicYear: '2024-2025',
      publicationDate: '01 October 2024',
      pages: 18,
      fileSize: '1.1 MB',
      chunksCount: 78,
      status: 'Indexed',
      ocrApplied: true,
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      sourceUrl: 'https://dhe.assam.gov.in/schemes/scholarship-circular-2024.pdf'
    },
    {
      id: 'DOC-BU-006',
      title: 'Bodoland University Hostel & Campus Facility Norms',
      university: 'Bodoland University (BU)',
      category: 'Campus Facilities',
      course: 'All Enrolled Scholars',
      semester: 'Annual',
      subject: 'Hostel Allotment & Code of Conduct',
      academicYear: '2024-2025',
      publicationDate: '12 August 2024',
      pages: 24,
      fileSize: '1.4 MB',
      chunksCount: 96,
      status: 'Indexed',
      ocrApplied: false,
      sha256: 'bc94d4f4e24eb4b62f4e85743a1fd8d03c628e9d6d5eb5b23d9b897973715c0e',
      sourceUrl: 'https://bodolanduniversity.ac.in/campus/facilities-rules.pdf'
    }
  ]);

  // University Web Ingestion Crawler Nodes
  const [crawlerNodes, setCrawlerNodes] = useState([
    {
      id: 'CRAWL-GU',
      university: 'Gauhati University (GU)',
      targetUrl: 'https://gauhati.ac.in/academic/syllabus',
      lastSynced: 'Today, 08:30 AM',
      frequency: 'Every 24 Hours',
      status: 'Active',
      discoveredDocs: 42,
      pendingReview: 1
    },
    {
      id: 'CRAWL-DU',
      university: 'Dibrugarh University (DU)',
      targetUrl: 'https://dibru.ac.in/curriculum/cbcs',
      lastSynced: 'Yesterday, 11:15 PM',
      frequency: 'Every 24 Hours',
      status: 'Active',
      discoveredDocs: 38,
      pendingReview: 0
    },
    {
      id: 'CRAWL-TU',
      university: 'Tezpur University (TU)',
      targetUrl: 'https://tezu.ernet.in/programs/academic-documents',
      lastSynced: 'Yesterday, 06:45 PM',
      frequency: 'Every 12 Hours',
      status: 'Active',
      discoveredDocs: 51,
      pendingReview: 2
    },
    {
      id: 'CRAWL-CU',
      university: 'Cotton University (CU)',
      targetUrl: 'https://cottonuniversity.ac.in/academics/syllabi',
      lastSynced: '2 days ago',
      frequency: 'Every 24 Hours',
      status: 'Active',
      discoveredDocs: 29,
      pendingReview: 0
    }
  ]);

  const universitiesList = [
    'All',
    'Gauhati University (GU)',
    'Dibrugarh University (DU)',
    'Tezpur University (TU)',
    'Cotton University (CU)',
    'Bodoland University (BU)',
    'Assam Science and Technology University (ASTU)',
    'Assam University (Silchar)'
  ];

  const categoriesList = [
    'All',
    'Curriculum & Syllabus',
    'Regulations & Guidelines',
    'Scholarships & Grants',
    'Campus Facilities',
    'Admission Notifications'
  ];

  // Filtering documents
  const filteredDocs = documents.filter((doc) => {
    const matchesUniv = selectedUnivFilter === 'All' || doc.university.includes(selectedUnivFilter);
    const matchesCat = selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.course.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchesUniv && matchesCat && matchesSearch;
  });

  // Handle Document Ingestion Simulation
  const handleStartIngest = (e) => {
    e.preventDefault();
    if (!uploadFormData.title.trim()) {
      alert("Please provide an official document title.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStepName('Calculating SHA-256 Checksum & Verifying Duplicates...');

    setTimeout(() => {
      setUploadProgress(35);
      setUploadStepName('PyMuPDF Text Extraction & Layout Parsing...');
    }, 700);

    setTimeout(() => {
      setUploadProgress(60);
      setUploadStepName(uploadFormData.enableOcr ? 'Tesseract OCR Processing for Scanned Tables & Assamese Script...' : 'Extracting Text Chunks (Size: 512, Overlap: 64)...');
    }, 1500);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStepName('Multilingual E5 Embedding Model Generating 768-dim Vectors...');
    }, 2200);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStepName('MongoDB Atlas Vector Search Index Synced Successfully!');
      
      const newDoc = {
        id: `DOC-GEN-${Math.floor(100 + Math.random() * 900)}`,
        title: uploadFormData.title,
        university: uploadFormData.university,
        category: uploadFormData.category,
        course: uploadFormData.course,
        semester: uploadFormData.semester,
        subject: uploadFormData.subject || 'Verified Ingestion',
        academicYear: uploadFormData.academicYear,
        publicationDate: 'Just now',
        pages: 48,
        fileSize: '3.1 MB',
        chunksCount: 192,
        status: 'Indexed',
        ocrApplied: uploadFormData.enableOcr,
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        sourceUrl: uploadFormData.sourceUrl
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setIsUploading(false);
      setUploadSuccessAlert(true);
      setTimeout(() => setUploadSuccessAlert(false), 4000);
      setActiveTab('repository');
    }, 3000);
  };

  // Handle Vector Search Test Simulation
  const handleTestRetrieval = (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsSearchingVector(true);
    setTimeout(() => {
      setRetrievalResults({
        query: testQuery,
        executionTime: '42ms',
        dimension: 768,
        chunksMatched: 3,
        results: [
          {
            score: '0.942',
            sourceDoc: 'GU_BCA_CBCS_Syllabus.pdf',
            university: 'Gauhati University (GU)',
            page: 'Page 42, Module 3',
            chunkText: 'Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF. A relation schema R is in BCNF with respect to a set F of functional dependencies if, for every functional dependency X -> Y in F+, either Y is a subset of X (trivial dependency) or X is a superkey of R. Unlike 3NF, BCNF does not allow transitive dependencies on any candidate key.'
          },
          {
            score: '0.898',
            sourceDoc: 'DU_BCA_Regulation_Syllabus.pdf',
            university: 'Dibrugarh University (DU)',
            page: 'Page 29, Section 4.1',
            chunkText: 'Normal Forms Comparison: While every relation in BCNF is guaranteed to be in 3NF, the reverse is not always true. In 3NF, the condition allows non-prime attributes to be determined by candidate keys or if the RHS attribute is prime. In BCNF, strict determinant superkey condition is enforced.'
          },
          {
            score: '0.841',
            sourceDoc: 'GU_CBCS_Regulations_UG.pdf',
            university: 'Gauhati University (GU)',
            page: 'Page 18, Appendix C',
            chunkText: 'Prescribed DBMS references: Silberschatz, Korth, Sudarshan (7th Edition) Chapters 7 and 8 provide canonical proofs for BCNF decomposition and loss-less join guarantees.'
          }
        ]
      });
      setIsSearchingVector(false);
    }, 600);
  };

  return (
    <div className={`min-h-screen bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 flex flex-col transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111C2E]/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          
          {/* Logo with Admin Console Badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Return to Student Portal"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7F50] to-[#118AB2] flex items-center justify-center text-white shadow-md">
              <AcademicCapIcon className="w-6 h-6 text-[#FFD166]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-[#073B4C] dark:text-white">
                  Uni<span className="text-[#FF7F50]">Mitra</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#FF7F50]/15 text-[#FF7F50] font-black text-[10px] tracking-wider uppercase border border-[#FF7F50]/30">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Centralized RAG Knowledge Base & Document Ingestion Suite
              </p>
            </div>
          </div>

          {/* Right Tools: System Pulse, Theme & Exit */}
          <div className="flex items-center space-x-3">
            {/* Live Pipeline Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Atlas Vector Search: Healthy (768d)</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {currentLang === 'as' ? 'অসমীয়া' : 'English'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {isDark ? <SunIcon className="w-4 h-4 text-[#FFD166]" /> : <MoonIcon className="w-4 h-4" />}
            </button>

            {/* Return to Student Hub */}
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] transition-colors cursor-pointer shadow-elevated-cerulean shrink-0"
            >
              Exit to Student Hub
            </button>
          </div>

        </div>
      </header>

      {/* Main Administrative Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Top 4 3D Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Ingested Docs</span>
              <div className="w-8 h-8 rounded-xl bg-[#E7F3F7] dark:bg-slate-800 text-[#118AB2] flex items-center justify-center">
                <DocumentTextIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{documents.length} Files</div>
            <span className="text-[11px] font-semibold text-[#06D6A0]">100% Verified Syllabuses</span>
          </div>

          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Knowledge Chunks</span>
              <div className="w-8 h-8 rounded-xl bg-[#E6FBF5] dark:bg-slate-800 text-[#06D6A0] flex items-center justify-center">
                <CircleStackIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">1,446 Chunks</div>
            <span className="text-[11px] font-semibold text-[#118AB2] dark:text-[#FFD166]">Atlas Vector Search</span>
          </div>

          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Embedding Engine</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] dark:bg-slate-800 text-[#FF7F50] flex items-center justify-center">
                <CpuChipIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">Multilingual E5</div>
            <span className="text-[11px] font-semibold text-[#FF7F50]">Assamese + English</span>
          </div>

          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm card-3d">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Crawler Sync</span>
              <div className="w-8 h-8 rounded-xl bg-[#FFF9E6] dark:bg-slate-800 text-[#D9A300] flex items-center justify-center">
                <GlobeAltIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">4 University Nodes</div>
            <span className="text-[11px] font-semibold text-[#06D6A0]">Scheduled Ingestion Active</span>
          </div>

        </div>

        {/* Console Tab Navigation Bar */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('repository')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'repository'
                ? 'bg-[#118AB2] text-white shadow-elevated-cerulean'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CircleStackIcon className="w-4 h-4" />
            <span>Document Repository ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-[#FF7F50] text-white shadow-elevated-coral'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Ingest New PDF Document</span>
          </button>

          <button
            onClick={() => setActiveTab('crawler')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'crawler'
                ? 'bg-[#06D6A0] text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GlobeAltIcon className="w-4 h-4" />
            <span>Official University Web Crawlers</span>
          </button>

          <button
            onClick={() => setActiveTab('vector-search')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vector-search'
                ? 'bg-[#118AB2] text-white shadow-elevated-cerulean'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>RAG Vector Search Inspector</span>
          </button>
        </div>

        {/* TAB 1: Centralized Document Knowledge Base Repository */}
        {activeTab === 'repository' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search query input */}
                <div className="relative flex-1 w-full">
                  <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by title, course, subject code, or document ID..."
                    value={searchDocQuery}
                    onChange={(e) => setSearchDocQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                  />
                </div>

                {/* University dropdown filter */}
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <select
                    value={selectedUnivFilter}
                    onChange={(e) => setSelectedUnivFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    {universitiesList.map((u) => (
                      <option key={u} value={u}>{u === 'All' ? 'All Universities' : u}</option>
                    ))}
                  </select>

                  {/* Category dropdown filter */}
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Document Categories' : c}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setActiveTab('upload')}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-colors cursor-pointer shadow-elevated-coral shrink-0"
                  >
                    <DocumentPlusIcon className="w-4 h-4" />
                    <span>Upload PDF</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Document Ingestion Table */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm card-3d">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider font-black">
                    <tr>
                      <th className="py-4 px-6">Document Details</th>
                      <th className="py-4 px-6">University Source</th>
                      <th className="py-4 px-6">Course & Category</th>
                      <th className="py-4 px-6">Chunks & OCR</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No official documents match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          
                          {/* Document Details */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="font-mono text-[10px] font-bold text-[#118AB2] dark:text-[#FFD166] bg-[#E7F3F7] dark:bg-slate-800 px-2 py-0.5 rounded">
                                {doc.id}
                              </span>
                              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                {doc.title}
                              </p>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                                <span>{doc.pages} Pages</span>
                                <span>•</span>
                                <span>{doc.fileSize}</span>
                                <span>•</span>
                                <span>{doc.academicYear}</span>
                              </div>
                            </div>
                          </td>

                          {/* University */}
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {doc.university}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Published: {doc.publicationDate}
                            </span>
                          </td>

                          {/* Category & Course */}
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 block w-fit mb-1">
                              {doc.category}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                              {doc.course}
                            </span>
                          </td>

                          {/* Chunks & OCR */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="font-bold text-[#118AB2] dark:text-[#06D6A0]">
                                {doc.chunksCount} Vectors
                              </span>
                              <div>
                                {doc.ocrApplied ? (
                                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                                    OCR Applied
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Digital Text</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 w-fit">
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>{doc.status}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => setInspectDocModal(doc)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#118AB2] dark:hover:text-white cursor-pointer"
                              title="Inspect Metadata & Chunks"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                alert(`Triggering re-indexing pipeline for ${doc.id}`);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#06D6A0] cursor-pointer"
                              title="Re-index Chunks"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${doc.title} from the knowledge base?`)) {
                                  setDocuments(documents.filter((d) => d.id !== doc.id));
                                }
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                              title="Delete Document"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Manual PDF Ingestion Pipeline */}
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-elevated-cerulean card-3d space-y-6">
              <div>
                <span className="text-xs font-black tracking-wider uppercase text-[#FF7F50]">
                  Official Document Processing Pipeline
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Ingest University PDF into Central Knowledge Base
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Upload official syllabuses, ordinances, regulations, and academic circulars. Documents are verified with SHA-256 duplicate detection and indexed with Multilingual E5 embeddings.
                </p>
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-[#118AB2]/40 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#118AB2]/10 text-[#118AB2] mx-auto flex items-center justify-center">
                  <CloudArrowUpIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop official university PDF, or <span className="text-[#118AB2] underline cursor-pointer">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts official PDF documents up to 50 MB
                  </p>
                </div>
              </div>

              {/* Metadata Entry Form */}
              <form onSubmit={handleStartIngest} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gauhati University BCA CBCS Core Syllabus 2024"
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      University Source (Metadata Tag) *
                    </label>
                    <select
                      value={uploadFormData.university}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    >
                      {universitiesList.filter(u => u !== 'All').map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Document Category *
                    </label>
                    <select
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    >
                      {categoriesList.filter(c => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Programme / Degree
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BCA, B.Sc, B.Tech, B.Com"
                      value={uploadFormData.course}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, course: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Semester
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Semester 3 or All Semesters"
                      value={uploadFormData.semester}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, semester: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2024-2025"
                      value={uploadFormData.academicYear}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, academicYear: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Official Source URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={uploadFormData.sourceUrl}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, sourceUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                    />
                  </div>

                </div>

                {/* Advanced OCR and Chunking Options */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        Enable OCR for Scanned PDFs & Assamese Typography
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Applies Tesseract OCR on raster image pages to extract non-searchable tables and Assamese script.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={uploadFormData.enableOcr}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, enableOcr: e.target.checked })}
                      className="w-5 h-5 accent-[#118AB2] rounded cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">CHUNK SIZE</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{uploadFormData.chunkSize} Tokens</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">CHUNK OVERLAP</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{uploadFormData.chunkOverlap} Tokens</span>
                    </div>
                  </div>
                </div>

                {/* Live Progress Bar if Ingesting */}
                {isUploading && (
                  <div className="space-y-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{uploadStepName}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF7F50] via-[#118AB2] to-[#06D6A0] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('repository')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    <span>{isUploading ? 'Ingesting Document...' : 'Start Document Ingestion'}</span>
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* TAB 3: Official University Web Crawler Nodes */}
        {activeTab === 'crawler' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-[#06D6A0]">
                    Official Portal Ingestion Nodes
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Approved University Academic Crawlers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Scheduled crawlers inspect authorized university websites for syllabus changes, CBCS updates, and new academic notifications.
                  </p>
                </div>

                <button
                  onClick={() => alert("All 4 crawler nodes scheduled for immediate crawl cycle.")}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-white bg-[#06D6A0] hover:bg-[#05b88a] text-slate-900 transition-colors cursor-pointer shadow-sm text-xs sm:text-sm shrink-0"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Sync All Portals Now</span>
                </button>
              </div>

              {/* Crawler Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {crawlerNodes.map((node) => (
                  <div 
                    key={node.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black text-[#118AB2] dark:text-[#FFD166]">
                          {node.university}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {node.targetUrl}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {node.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block">LAST SYNC</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{node.lastSynced}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block">DISCOVERED</span>
                        <span className="font-bold text-[#118AB2]">{node.discoveredDocs} PDFs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block">FREQUENCY</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{node.frequency}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {node.pendingReview > 0 ? `⚠️ ${node.pendingReview} doc update pending SHA check` : '✓ All hashes verified'}
                      </span>
                      <button
                        onClick={() => alert(`Starting crawl for ${node.university}`)}
                        className="text-xs font-bold text-[#118AB2] dark:text-[#06D6A0] hover:underline cursor-pointer"
                      >
                        Crawl Now ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: Vector Search & RAG Pipeline Inspector */}
        {activeTab === 'vector-search' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-6">
              <div>
                <span className="text-xs font-black tracking-wider uppercase text-[#118AB2]">
                  Retrieval-Augmented Generation Diagnostics
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Vector Retrieval & Grounded Citation Inspector
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Test semantic similarity queries against MongoDB Atlas Vector Search. Verify that only official university documents are retrieved with exact page numbers.
                </p>
              </div>

              {/* Live Query Tester */}
              <form onSubmit={handleTestRetrieval} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter an academic query in English or Assamese (e.g. DBMS Normalization, passing marks)..."
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#118AB2]"
                />
                <button
                  type="submit"
                  disabled={isSearchingVector}
                  className="px-6 py-3 rounded-2xl font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] transition-all cursor-pointer shadow-elevated-cerulean text-xs sm:text-sm shrink-0 flex items-center justify-center space-x-2"
                >
                  <SparklesIcon className="w-4 h-4 text-[#FFD166]" />
                  <span>{isSearchingVector ? 'Querying Atlas...' : 'Execute Vector Search'}</span>
                </button>
              </form>

              {/* Retrieval Results Card */}
              {retrievalResults && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-500">
                    <span>Query: "{retrievalResults.query}"</span>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span>Latency: <strong className="text-emerald-500">{retrievalResults.executionTime}</strong></span>
                      <span>Dimension: <strong className="text-[#118AB2]">{retrievalResults.dimension}d</strong></span>
                      <span>Matched: <strong className="text-[#FF7F50]">{retrievalResults.chunksMatched} Chunks</strong></span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {retrievalResults.results.map((res, idx) => (
                      <div 
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-[#118AB2] dark:text-[#FFD166]">
                              {res.university}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {res.sourceDoc}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-xs font-bold text-[#FF7F50]">
                              {res.page}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Similarity: {res.score}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          "{res.chunkText}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Document Detailed Inspection Modal */}
      {inspectDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative card-3d space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#118AB2] dark:text-[#FFD166]">
                  {inspectDocModal.id} • {inspectDocModal.university}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {inspectDocModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setInspectDocModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px]">PROGRAMME & SEMESTER</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{inspectDocModal.course} ({inspectDocModal.semester})</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-bold block text-[10px]">PAGES & CHUNK COUNT</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{inspectDocModal.pages} Pages ({inspectDocModal.chunksCount} Vectors)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-bold block text-[10px]">SHA-256 INTEGRITY CHECKSUM</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all block">
                  {inspectDocModal.sha256}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-bold block text-[10px]">OFFICIAL SOURCE URL</span>
                <a 
                  href={inspectDocModal.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[11px] text-[#118AB2] dark:text-[#06D6A0] hover:underline break-all"
                >
                  {inspectDocModal.sourceUrl}
                </a>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 font-medium">
                ✓ Vector status: Vector Indexed in MongoDB Atlas (Collection: `academic_knowledge_base`).
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={() => setInspectDocModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Re-indexing triggered for ${inspectDocModal.id}`);
                  setInspectDocModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#118AB2] hover:bg-[#0E7292] cursor-pointer shadow-elevated-cerulean"
              >
                Re-Index Chunks
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

