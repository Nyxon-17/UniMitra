import { useState } from 'react';
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
  ShieldCheckIcon
} from '../../components/common/Icons';

export const AdminConsole = ({ 
  onExit, 
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme 
}) => {
  const [activeTab, setActiveTab] = useState('repository'); // 'repository' | 'upload' | 'crawler' | 'vector-search'
  const [selectedUnivFilter, setSelectedUnivFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [inspectDocModal, setInspectDocModal] = useState(null);
  
  // Interactive Upload Pipeline States
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    university: 'Gauhati University (GU)',
    category: 'University Regulations & Ordinances',
    department: 'Examination Branch / Academic Council',
    academicYear: '2024-2025',
    sourceUrl: 'https://gauhati.ac.in/academic/regulations/ug-ordinance',
    enableOcr: true,
    chunkSize: 512,
    chunkOverlap: 64
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepName, setUploadStepName] = useState('');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Retrieval Test Playground State
  const [testQuery, setTestQuery] = useState('What are the passing criteria and attendance condonation rules for university examinations?');
  const [retrievalResults, setRetrievalResults] = useState(null);
  const [isSearchingVector, setIsSearchingVector] = useState(false);

  // Centralized Institutional Document Repository
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
      status: 'Indexed',
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
      ocrApplied: false,
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      sourceUrl: 'https://tezu.ernet.in/regulations/hostel-ordinance.pdf'
    }
  ]);

  // University Web Ingestion Crawler Nodes
  const [crawlerNodes, setCrawlerNodes] = useState([
    {
      id: 'CRAWL-GU',
      university: 'Gauhati University (GU)',
      targetUrl: 'https://gauhati.ac.in/academic/notifications',
      lastSynced: 'Today, 08:30 AM',
      frequency: 'Every 24 Hours',
      status: 'Active',
      discoveredDocs: 34,
      pendingReview: 1
    },
    {
      id: 'CRAWL-DU',
      university: 'Dibrugarh University (DU)',
      targetUrl: 'https://dibru.ac.in/gazettes/ordinances',
      lastSynced: 'Yesterday, 11:15 PM',
      frequency: 'Every 24 Hours',
      status: 'Active',
      discoveredDocs: 28,
      pendingReview: 0
    },
    {
      id: 'CRAWL-DHE',
      university: 'Directorate of Higher Education (DHE)',
      targetUrl: 'https://dhe.assam.gov.in/latest-circulars',
      lastSynced: 'Yesterday, 06:45 PM',
      frequency: 'Every 12 Hours',
      status: 'Active',
      discoveredDocs: 19,
      pendingReview: 2
    }
  ]);

  // Delete Document
  const handleDeleteDoc = (id) => {
    if (window.confirm(`Are you sure you want to remove document ${id} from the centralized index?`)) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  // Upload Simulation
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFormData.title.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStepName('Extracting institutional PDF clauses with OCR...');

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStepName('Generating Multilingual E5 vector embeddings...');
    }, 900);

    setTimeout(() => {
      setUploadProgress(80);
      setUploadStepName('Synchronizing with MongoDB Atlas Vector Index...');
    }, 1800);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStepName('Document successfully indexed!');
      
      const newDoc = {
        id: `DOC-NEW-${Date.now().toString().slice(-4)}`,
        title: uploadFormData.title,
        university: uploadFormData.university,
        category: uploadFormData.category,
        department: uploadFormData.department,
        academicYear: uploadFormData.academicYear,
        publicationDate: 'Just now',
        pages: 32,
        fileSize: '2.5 MB',
        chunksCount: Math.round(32 * (512 / uploadFormData.chunkSize) * 3),
        status: 'Indexed',
        ocrApplied: uploadFormData.enableOcr,
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        sourceUrl: uploadFormData.sourceUrl
      };

      setDocuments([newDoc, ...documents]);
      setIsUploading(false);
      setUploadSuccessAlert(true);
      setTimeout(() => setUploadSuccessAlert(false), 3000);
      setActiveTab('repository');
    }, 2600);
  };

  // Semantic Vector Retrieval Test Simulation
  const handleTestRetrieval = (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsSearchingVector(true);
    setTimeout(() => {
      setRetrievalResults({
        query: testQuery,
        executionTime: '38ms',
        dimension: 768,
        chunksMatched: 2,
        results: [
          {
            score: '0.954',
            sourceDoc: 'GU_Examination_Regulations_2024.pdf',
            university: 'Gauhati University (GU)',
            page: 'Page 14, Clause 8.2',
            chunkText: 'Candidates must secure a minimum of 40% aggregate in both In-Semester Internal Assessment (Sessional) and End-Semester Final Examinations separately to clear course credits. Back papers can be cleared in subsequent sessions within N+2 years.'
          },
          {
            score: '0.912',
            sourceDoc: 'DU_Attendance_Statutes_Gazette.pdf',
            university: 'Dibrugarh University (DU)',
            page: 'Page 9, Section 4.3',
            chunkText: 'Statutory 75% attendance is mandatory in theory lectures and lab sessions. Absence due to illness supported by registered medical officer certificate may be condoned up to 10% (allowing 65% minimum) upon recommendation of the Departmental Head.'
          }
        ]
      });
      setIsSearchingVector(false);
    }, 600);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchUniv = selectedUnivFilter === 'All' || doc.university.includes(selectedUnivFilter.split(' ')[0]);
    const matchCat = selectedCategoryFilter === 'All' || doc.category === selectedCategoryFilter;
    const matchSearch = !searchDocQuery.trim() || 
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
                  Ingestion Admin
                </span>
              </div>
              <p className="text-[11px] text-[#4F6D4B] dark:text-[#E5CD82] font-semibold">
                Centralized Institutional Regulations & Circulars Ingestion Suite
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
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage"
            >
              Exit to Portal ➔
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#B8CFB3] dark:border-[#728E6D] pb-3">
          {[
            { id: 'repository', label: 'Institutional Repository' },
            { id: 'upload', label: 'Upload Document / Circular' },
            { id: 'crawler', label: 'University Crawler Nodes' },
            { id: 'vector-search', label: 'Vector Search Benchmark' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#84A282] text-white shadow-elevated-sage'
                  : 'bg-white dark:bg-[#1C4412] text-[#15370D] dark:text-[#FFF2B4] border border-[#B8CFB3] dark:border-[#728E6D] hover:bg-[#B8CFB3]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {uploadSuccessAlert && (
          <div className="p-4 rounded-2xl bg-[#B8CFB3]/40 border-2 border-[#84A282] text-[#15370D] dark:text-[#FFF2B4] font-black text-xs sm:text-sm flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-[#84A282]" />
            <span>Document successfully chunked, embedded via Multilingual E5, and indexed into MongoDB Atlas!</span>
          </div>
        )}

        {/* TAB 1: REPOSITORY */}
        {activeTab === 'repository' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedUnivFilter}
                  onChange={(e) => setSelectedUnivFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
                >
                  <option>All Universities</option>
                  <option>Gauhati University (GU)</option>
                  <option>Dibrugarh University (DU)</option>
                  <option>Tezpur University (TU)</option>
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
                >
                  <option value="All">All Categories</option>
                  <option value="University Regulations & Ordinances">Regulations & Ordinances</option>
                  <option value="Scholarships & State Grants">Scholarships & Grants</option>
                  <option value="Campus Facilities & Hostels">Campus Facilities</option>
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <SearchIcon className="w-4 h-4 text-[#84A282] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search repository..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4]"
                />
              </div>
            </div>

            {/* Document Table */}
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#B8CFB3]/30 dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] font-black border-b border-[#B8CFB3] dark:border-[#728E6D]">
                    <tr>
                      <th className="p-4">Doc ID & Title</th>
                      <th className="p-4">University</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Chunks</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8CFB3]/30 dark:divide-[#728E6D]">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#B8CFB3]/10">
                        <td className="p-4">
                          <span className="font-mono text-[10px] text-[#84A282] dark:text-[#FFF2B4] block">{doc.id}</span>
                          <span className="font-black text-[#15370D] dark:text-[#FFF2B4]">{doc.title}</span>
                        </td>
                        <td className="p-4 font-bold text-[#15370D] dark:text-[#E5CD82]">{doc.university}</td>
                        <td className="p-4">{doc.category}</td>
                        <td className="p-4 font-mono font-bold text-[#84A282] dark:text-[#FFF2B4]">{doc.chunksCount}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-lg bg-[#B8CFB3]/40 text-[#15370D] dark:bg-[#15370D] dark:text-[#FFF2B4] text-[10px] font-black border border-[#84A282]/30">
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setInspectDocModal(doc)}
                            className="p-1.5 rounded-lg hover:bg-[#B8CFB3]/30 text-[#84A282] dark:text-[#FFF2B4] cursor-pointer"
                            title="Inspect metadata"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                            title="Delete document"
                          >
                            <TrashIcon className="w-4 h-4" />
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

        {/* TAB 2: UPLOAD & INGEST PIPELINE */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#15370D] dark:text-[#FFF2B4]">
                Upload Institutional Gazette or Notification
              </h2>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Extract, chunk, and embed official university regulations into the centralized vector index.
              </p>
            </div>

            {isUploading ? (
              <div className="p-8 text-center space-y-4">
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
                    placeholder="e.g. Cotton University Examination Ordinances 2024"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs sm:text-sm font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      University *
                    </label>
                    <select
                      value={uploadFormData.university}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, university: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                    >
                      <option>Gauhati University (GU)</option>
                      <option>Dibrugarh University (DU)</option>
                      <option>Tezpur University (TU)</option>
                      <option>Cotton University (CU)</option>
                      <option>Assam University (Silchar)</option>
                      <option>Bodoland University (BU)</option>
                      <option>All Assam Universities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#15370D] dark:text-[#FFF2B4] mb-1">
                      Document Domain *
                    </label>
                    <select
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
                    >
                      <option>University Regulations & Ordinances</option>
                      <option>Examinations & Evaluation Guidelines</option>
                      <option>Academic Programs & Admissions</option>
                      <option>Scholarships & State Grants</option>
                      <option>Campus Facilities & Hostels</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-[#B8CFB3] dark:border-[#728E6D] rounded-2xl text-center bg-[#FEFAF3] dark:bg-[#15370D] space-y-2">
                  <CloudArrowUpIcon className="w-8 h-8 text-[#84A282] mx-auto" />
                  <span className="text-xs font-black text-[#15370D] dark:text-[#FFF2B4] block">
                    Drag and drop official gazette PDF here or click to browse
                  </span>
                  <span className="text-[10px] text-[#4F6D4B] dark:text-[#E5CD82] block">
                    Supported: PDF (up to 50MB). Auto-OCR for scanned Assamese & English documents enabled.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-sm"
                >
                  Start Institutional Ingestion & Embedding Pipeline ➔
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CRAWLER NODES */}
        {activeTab === 'crawler' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">
                  Automated University Notice Crawlers
                </h3>
                <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                  Periodic scrapers that detect newly published ordinances and circulars from official university portals.
                </p>
              </div>
              <button
                onClick={() => alert("Triggered manual sync on all crawler nodes.")}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] cursor-pointer"
              >
                Sync All Nodes Now
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crawlerNodes.map((node) => (
                <div key={node.id} className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-[#84A282] dark:text-[#FFF2B4]">{node.id}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {node.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#15370D] dark:text-[#FFF2B4]">{node.university}</h4>
                  <p className="text-[11px] font-mono text-[#4F6D4B] dark:text-[#E5CD82] truncate">{node.targetUrl}</p>
                  <div className="pt-2 border-t border-[#B8CFB3]/40 dark:border-[#728E6D] flex items-center justify-between text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                    <span>Discovered: <strong>{node.discoveredDocs} Docs</strong></span>
                    <span>{node.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VECTOR SEARCH TEST BENCH */}
        {activeTab === 'vector-search' && (
          <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#15370D] dark:text-[#FFF2B4]">
                Multilingual E5 Vector Retrieval Playground
              </h2>
              <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                Test semantic query match scores against MongoDB Atlas 768-dimensional vector chunks.
              </p>
            </div>

            <form onSubmit={handleTestRetrieval} className="flex gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs sm:text-sm font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
              />
              <button
                type="submit"
                disabled={isSearchingVector}
                className="px-6 py-3 rounded-2xl bg-[#84A282] hover:bg-[#6F8E6D] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs shrink-0"
              >
                {isSearchingVector ? 'Computing Vectors...' : 'Execute Vector Search'}
              </button>
            </form>

            {retrievalResults && (
              <div className="space-y-4 pt-4 border-t border-[#B8CFB3]/50 dark:border-[#728E6D]">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#84A282]">
                  <span>Execution: {retrievalResults.executionTime} • Dim: {retrievalResults.dimension}</span>
                  <span>Matched: {retrievalResults.chunksMatched} Chunks</span>
                </div>

                <div className="space-y-3">
                  {retrievalResults.results.map((r, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-[#15370D] dark:text-[#FFF2B4]">{r.sourceDoc} ({r.page})</span>
                        <span className="px-2 py-0.5 rounded bg-[#84A282] text-white font-mono font-bold">Score: {r.score}</span>
                      </div>
                      <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed font-semibold">
                        {r.chunkText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Document Metadata Inspector Modal */}
      {inspectDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FEFAF3] dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8CFB3] dark:border-[#728E6D]">
              <span className="text-xs font-mono font-black text-[#84A282]">{inspectDocModal.id}</span>
              <button
                onClick={() => setInspectDocModal(null)}
                className="text-xs font-black text-[#4F6D4B] hover:text-[#15370D] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <h3 className="text-base font-black text-[#15370D] dark:text-[#FFF2B4]">{inspectDocModal.title}</h3>
            <div className="space-y-2 text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
              <div><strong>University:</strong> {inspectDocModal.university}</div>
              <div><strong>Category:</strong> {inspectDocModal.category}</div>
              <div><strong>Pages:</strong> {inspectDocModal.pages} ({inspectDocModal.chunksCount} chunks)</div>
              <div><strong>SHA-256 Checksum:</strong> <span className="font-mono text-[10px] block break-all">{inspectDocModal.sha256}</span></div>
              <div><strong>Official Source URL:</strong> <a href={inspectDocModal.sourceUrl} target="_blank" rel="noreferrer" className="text-[#84A282] underline block truncate">{inspectDocModal.sourceUrl}</a></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
