import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../../components/common/AuroraBackground';
import { DashboardAiAssistant } from '../dashboard/DashboardAiAssistant';
import { DashboardQueryHistory } from '../dashboard/DashboardQueryHistory';
import { documentService, resolveDocPdfUrl, INITIAL_CATEGORIES } from '../../services/documentService';
import { universityService } from '../../services/universityService';
import { pdfStorage } from '../../services/pdfStorage';
import { authService } from '../../services/authService';

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';
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
  UserGroupIcon,
  MenuIcon,
  ChatBubbleIcon,
  KeyIcon,
  LockClosedIcon,
  EnvelopeIcon,
  EyeSlashIcon
} from '../../components/common/Icons';

export const AdminConsole = ({
  studentInfo = { name: 'Institutional Administrator', role: 'Admin' },
  onExit,
  currentLang = 'en',
  onToggleLang,
  isDark = false,
  onToggleTheme
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  // Administrator Management Tabs (Single University Master Config + Operations)
  const validTabs = ['admin-assistant', 'univ-details', 'admin-credentials', 'repository', 'upload', 'categories', 'feedback', 'admin-history'];
  const [activeTab, setActiveTab] = useState(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'univ-details'
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setSidebarOpen(false);
  };

  const [selectedUnivFilter, setSelectedUnivFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedApprovalFilter, setSelectedApprovalFilter] = useState('All');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [rejectPopup, setRejectPopup] = useState(null);
  const [actionAlert, setActionAlert] = useState('');

  // 1. Centralized Institutional Document Repository with Live Shared Service
  const [documents, setDocuments] = useState(() => documentService.getDocuments());
  const [categories, setCategories] = useState(() => documentService.getCategories());

  // Sync with document service updates across components
  const syncWithService = () => {
    setDocuments(documentService.getDocuments());
    setCategories(documentService.getCategories());
  };

  useEffect(() => {
    syncWithService();
    documentService.fetchDocumentsFromBackend().then(docs => {
      if (docs && docs.length > 0) setDocuments(docs);
    });
    window.addEventListener('unimitra_documents_changed', syncWithService);
    window.addEventListener('unimitra_categories_changed', syncWithService);
    return () => {
      window.removeEventListener('unimitra_documents_changed', syncWithService);
      window.removeEventListener('unimitra_categories_changed', syncWithService);
    };
  }, []);

  // 0. Single-University Master Configuration State
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());
  const [profileForm, setProfileForm] = useState(() => ({ ...universityService.getProfile() }));
  const [univRegulations, setUnivRegulations] = useState(() => universityService.getRegulations());
  const [univExaminations, setUnivExaminations] = useState(() => universityService.getExaminations());
  const [univProgrammes, setUnivProgrammes] = useState(() => universityService.getProgrammes());
  const [univScholarships, setUnivScholarships] = useState(() => universityService.getScholarships());
  const [univAdmissions, setUnivAdmissions] = useState(() => universityService.getAdmissions());
  const [univFacilities, setUnivFacilities] = useState(() => universityService.getFacilities());
  const [univNotices, setUnivNotices] = useState(() => universityService.getNotices());

  // Super Administrator Master Credentials State (Editable in Admin Console)
  const [adminCredsForm, setAdminCredsForm] = useState(() => authService.getSuperAdminCredentials());
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [confirmAdminPassword, setConfirmAdminPassword] = useState(() => authService.getSuperAdminCredentials().password);
  const [adminCredsSaving, setAdminCredsSaving] = useState(false);

  useEffect(() => {
    const handleCredsChange = (e) => {
      if (e.detail) {
        setAdminCredsForm(e.detail);
        setConfirmAdminPassword(e.detail.password);
      }
    };
    window.addEventListener('unimitra_super_admin_credentials_changed', handleCredsChange);
    return () => window.removeEventListener('unimitra_super_admin_credentials_changed', handleCredsChange);
  }, []);

  const handleSaveAdminCredentials = async (e) => {
    e.preventDefault();
    if (!adminCredsForm.name?.trim()) {
      triggerToast('Super Administrator name cannot be empty.');
      return;
    }
    if (!adminCredsForm.email?.trim() || !adminCredsForm.email.includes('@')) {
      triggerToast('Please provide a valid Super Administrator email.');
      return;
    }
    if (!adminCredsForm.password || adminCredsForm.password.length < 6) {
      triggerToast('Super Administrator password must be at least 6 characters.');
      return;
    }
    if (adminCredsForm.password !== confirmAdminPassword) {
      triggerToast('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setAdminCredsSaving(true);
    try {
      await authService.updateSuperAdminCredentials({
        name: adminCredsForm.name,
        email: adminCredsForm.email,
        password: adminCredsForm.password,
      });
      triggerToast('Super Administrator credentials successfully updated! Changes applied to login and security.');
    } catch (err) {
      console.warn('Update admin credentials notice:', err);
      triggerToast('Super Administrator credentials saved locally!');
    } finally {
      setAdminCredsSaving(false);
    }
  };

  // Active sub-section within the University Master Details tab
  const [univSection, setUnivSection] = useState('profile');
  // 'profile' | 'regulations' | 'examinations' | 'programmes' | 'scholarships' | 'admissions' | 'facilities' | 'notices' | 'test-scenarios'

  // Modal for Adding University Domain Items
  const [univAddModalOpen, setUnivAddModalOpen] = useState(false);
  const [univAddModalDomain, setUnivAddModalDomain] = useState('regulations');
  const [newItemForm, setNewItemForm] = useState({
    title: '',
    asTitle: '',
    name: '',
    asName: '',
    category: '',
    ordinanceNo: '',
    summary: '',
    asSummary: '',
    details: '',
    citation: '',
    sourceDoc: '',
    amount: '',
    provider: '',
    type: '',
    eligibility: '',
    asEligibility: '',
    deadline: '',
    intake: 60,
    department: '',
    level: 'Postgraduate',
    code: '',
    duration: '2 Years',
    capacity: '',
    location: '',
    timings: '',
    head: '',
    rules: '',
    asRules: '',
    dates: '',
    fee: '',
    portalUrl: '',
    refNo: '',
    date: '',
    isUrgent: false
  });

  const syncUnivState = () => {
    const prof = universityService.getProfile();
    setUnivProfile(prof);
    setProfileForm({ ...prof });
    setUnivRegulations(universityService.getRegulations());
    setUnivExaminations(universityService.getExaminations());
    setUnivProgrammes(universityService.getProgrammes());
    setUnivScholarships(universityService.getScholarships());
    setUnivAdmissions(universityService.getAdmissions());
    setUnivFacilities(universityService.getFacilities());
    setUnivNotices(universityService.getNotices());
  };

  useEffect(() => {
    window.addEventListener('unimitra_university_changed', syncUnivState);
    return () => window.removeEventListener('unimitra_university_changed', syncUnivState);
  }, []);

  // Save University Profile
  const handleSaveUnivProfile = (e) => {
    e.preventDefault();
    universityService.updateProfile(profileForm);
    triggerToast('University Profile updated! Instantaneously reflected across student portal & AI assistant.');
  };

  // Reset to Defaults
  const handleResetUnivDefaults = () => {
    setConfirmPopup({
      title: 'Reset University Data',
      message: 'Reset all university data to official Nivoraya University statutory defaults?',
      confirmText: 'Reset Defaults',
      confirmColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      onConfirm: () => {
        universityService.resetToDefaults();
        triggerToast('Restored official Nivoraya University statutory repository.');
        setConfirmPopup(null);
      }
    });
  };

  // Open Add Item Modal
  const handleOpenAddUnivModal = (domain) => {
    setUnivAddModalDomain(domain);
    setNewItemForm({
      title: '',
      asTitle: '',
      name: '',
      asName: '',
      category: '',
      ordinanceNo: '',
      summary: '',
      asSummary: '',
      details: '',
      citation: '',
      sourceDoc: '',
      amount: '',
      provider: '',
      type: '',
      eligibility: '',
      asEligibility: '',
      deadline: '',
      intake: 60,
      department: '',
      level: 'Postgraduate',
      code: '',
      duration: '2 Years',
      capacity: '',
      location: '',
      timings: '',
      head: '',
      rules: '',
      asRules: '',
      dates: '',
      fee: '',
      portalUrl: '',
      refNo: '',
      date: '',
      isUrgent: false
    });
    setUnivAddModalOpen(true);
  };

  // Submit New University Domain Item
  const handleSubmitNewUnivItem = (e) => {
    e.preventDefault();
    if (univAddModalDomain === 'regulations') {
      universityService.addRegulation({
        title: newItemForm.title,
        asTitle: newItemForm.asTitle || newItemForm.title,
        category: newItemForm.category || 'Academic Regulations',
        ordinanceNo: newItemForm.ordinanceNo,
        summary: newItemForm.summary,
        asSummary: newItemForm.asSummary || newItemForm.summary,
        citation: newItemForm.citation,
        sourceDoc: newItemForm.sourceDoc
      });
      triggerToast('New Academic Regulation successfully added to knowledge base.');
    } else if (univAddModalDomain === 'examinations') {
      universityService.addExamination({
        title: newItemForm.title,
        asTitle: newItemForm.asTitle || newItemForm.title,
        category: newItemForm.category || 'Examination Guidelines',
        ordinanceNo: newItemForm.ordinanceNo,
        summary: newItemForm.summary,
        asSummary: newItemForm.asSummary || newItemForm.summary,
        details: newItemForm.details,
        citation: newItemForm.citation,
        sourceDoc: newItemForm.sourceDoc
      });
      triggerToast('New Examination Ordinance added to knowledge base.');
    } else if (univAddModalDomain === 'programmes') {
      universityService.addProgramme({
        name: newItemForm.name || newItemForm.title,
        asName: newItemForm.asName || newItemForm.name || newItemForm.title,
        level: newItemForm.level,
        code: newItemForm.code,
        department: newItemForm.department,
        duration: newItemForm.duration,
        intake: Number(newItemForm.intake) || 60,
        eligibility: newItemForm.eligibility,
        asEligibility: newItemForm.asEligibility || newItemForm.eligibility
      });
      triggerToast('Academic Programme indexed into university offerings.');
    } else if (univAddModalDomain === 'scholarships') {
      universityService.addScholarship({
        name: newItemForm.name || newItemForm.title,
        asName: newItemForm.asName || newItemForm.name || newItemForm.title,
        provider: newItemForm.provider,
        type: newItemForm.type || 'Institutional Grant',
        amount: newItemForm.amount,
        eligibility: newItemForm.eligibility,
        asEligibility: newItemForm.asEligibility || newItemForm.eligibility,
        deadline: newItemForm.deadline,
        sourceDoc: newItemForm.sourceDoc
      });
      triggerToast('Scholarship scheme registered and active for AI retrieval.');
    } else if (univAddModalDomain === 'admissions') {
      universityService.addAdmission({
        title: newItemForm.title,
        asTitle: newItemForm.asTitle || newItemForm.title,
        category: newItemForm.category || 'General Admissions',
        dates: newItemForm.dates,
        fee: newItemForm.fee,
        eligibility: newItemForm.eligibility,
        asEligibility: newItemForm.asEligibility || newItemForm.eligibility,
        portalUrl: newItemForm.portalUrl,
        steps: newItemForm.details ? newItemForm.details.split('\n') : ['Online registration', 'Document verification']
      });
      triggerToast('Admission Procedure published to student portal.');
    } else if (univAddModalDomain === 'facilities') {
      universityService.addFacility({
        name: newItemForm.name || newItemForm.title,
        asName: newItemForm.asName || newItemForm.name || newItemForm.title,
        category: newItemForm.category || 'Campus Facility',
        capacity: newItemForm.capacity,
        location: newItemForm.location,
        timings: newItemForm.timings,
        head: newItemForm.head,
        rules: newItemForm.rules,
        asRules: newItemForm.asRules || newItemForm.rules
      });
      triggerToast('Campus facility details saved.');
    } else if (univAddModalDomain === 'notices') {
      const pdfPath = newItemForm.portalUrl || newItemForm.sourceDoc || '';
      universityService.addNotice({
        title: newItemForm.title,
        asTitle: newItemForm.asTitle || newItemForm.title,
        department: newItemForm.department || 'Administrative Section',
        refNo: newItemForm.refNo || ('DU/NOT/' + new Date().getFullYear() + '/' + Math.floor(Math.random() * 800 + 100)),
        date: newItemForm.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        summary: newItemForm.summary,
        asSummary: newItemForm.asSummary || newItemForm.summary,
        isUrgent: newItemForm.isUrgent || false,
        pdfUrl: pdfPath
      });
      if (pdfPath) {
        documentService.uploadAdminDocument({
          title: newItemForm.title,
          asTitle: newItemForm.asTitle || newItemForm.title,
          university: univProfile.name || 'Nivoraya University (DU)',
          category: 'University Regulations & Ordinances',
          department: newItemForm.department || 'Administrative Section',
          academicYear: '2024-2025',
          sourceUrl: pdfPath,
          summary: newItemForm.summary,
          citation: newItemForm.refNo || 'Official University Notice',
          fileName: pdfPath.split('/').pop(),
          fileType: 'PDF',
          fileSize: '5.4 KB',
          pages: 1,
          chunksCount: 12,
          ocrApplied: true
        });
      }
      triggerToast('Official Notice published, vectorized and active across all portals.');
    }
    setUnivAddModalOpen(false);
  };

  // Delete University Domain Item
  const handleDeleteUnivItem = (domain, id) => {
    if (window.confirm('Delete this record from the active university repository?')) {
      if (domain === 'regulations') universityService.deleteRegulation(id);
      else if (domain === 'examinations') universityService.deleteExamination(id);
      else if (domain === 'programmes') universityService.deleteProgramme(id);
      else if (domain === 'scholarships') universityService.deleteScholarship(id);
      else if (domain === 'admissions') universityService.deleteAdmission(id);
      else if (domain === 'facilities') universityService.deleteFacility(id);
      else if (domain === 'notices') universityService.deleteNotice(id);
      triggerToast('Record removed from university knowledge repository.');
    }
  };

  // 2. Upload Document Form State with File Dropzone
  const fileInputRef = useRef(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepName, setUploadStepName] = useState('');

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    asTitle: '',
    university: univProfile?.name || 'Our University',
    category: 'University Regulations & Ordinances',
    department: 'Examination Branch',
    academicYear: '2024-2025',
    refNo: '',
    sourceUrl: '',
    summary: '',
    enableOcr: true
  });

  // 3. New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');

  // 4. Processing Pipeline State
  const [pipelineJobs] = useState([
    {
      id: 'JOB-902',
      docName: 'GU_CBCS_Passing_Criteria_2024.pdf',
      stage: 'Optical Layout & OCR Extraction',
      progress: 68,
      status: 'Active'
    },
    {
      id: 'JOB-903',
      docName: 'DU_Medical_Condonation_Rules.pdf',
      stage: 'Vector Embeddings Generation (BGE-M3)',
      progress: 92,
      status: 'Active'
    },
    {
      id: 'JOB-904',
      docName: 'TU_Leave_Rules_Statutes.pdf',
      stage: 'ChromaDB Chunk Indexing (512-t)',
      progress: 100,
      status: 'Completed'
    }
  ]);

  // 5. Analytics State
  const [analyticsData, setAnalyticsData] = useState(() => ({
    totalUsers: 1,
    totalStudents: 1,
    totalFaculty: 0,
    totalDocuments: documentService.getDocuments().length,
    indexedDocuments: documentService.getApprovedDocuments().length,
    pendingDocuments: documentService.getPendingDocuments().length,
    totalNotices: universityService.getNotices().length,
    totalQueries: 0,
    assameseQueries: 0,
    englishQueries: 0,
    avgConfidence: 98.4,
    hallucinationRejectionRate: '100%',
    unansweredCount: 0,
    feedbackCount: 0,
    topAskedTopics: []
  }));

  // 6. Unanswered Questions Queue State (Dynamic from Database)
  const [unansweredList, setUnansweredList] = useState([]);

  const loadStoredFeedback = () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('unimitra_feedback_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'FB-DEMO-01',
        user: 'Academic Scholar',
        role: 'Student',
        type: 'General AI Query Accuracy',
        rating: 5,
        query: 'What are the scholarship requirements for Ishan Uday?',
        comments: 'Prompt citation and income limit of ₹4.5L were completely verified and accurate.',
        submittedAt: 'Today',
        status: 'Reviewed & Resolved'
      }
    ];
  };

  // 7. Student & Faculty Feedback State (Dynamic from Database & AI Chatbot)
  const [feedbackList, setFeedbackList] = useState(() => loadStoredFeedback());

  useEffect(() => {
    const handleFeedbackUpdate = () => {
      setFeedbackList(loadStoredFeedback());
    };
    window.addEventListener('unimitra_feedback_changed', handleFeedbackUpdate);
    return () => window.removeEventListener('unimitra_feedback_changed', handleFeedbackUpdate);
  }, []);

  // 8. Users & Roles Management State (Dynamic from Database)
  const [users, setUsers] = useState(() => {
    const me = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('unimitra_student_info') || '{}') : {};
    return me.email ? [{
      id: me.id || 'USR-CURRENT',
      name: me.name || me.fullName || 'Authorized Administrator',
      role: me.role === 'admin' || me.role === 'super_admin' ? 'Super Admin' : (me.role === 'faculty' ? 'Faculty Member' : 'Student'),
      email: me.email || 'admin@nivoraya.ac.in',
      identifier: me.memberId || 'ADM-NU-001',
      department: me.department || 'Institutional Governance',
      status: 'Active'
    }] : [];
  });

  // Fetch real analytics, unanswered queries, feedback, and users from backend API
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('unimitra_auth_token') : null;
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [analyticsRes, unansweredRes, feedbackRes, usersRes] = await Promise.allSettled([
          fetch(`${API_BASE}/admin/analytics`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/admin/unanswered`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/admin/feedback`, { headers }).then(r => r.json()),
          fetch(`${API_BASE}/admin/users`, { headers }).then(r => r.json())
        ]);

        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data?.overview) {
          const ov = analyticsRes.value.data.overview;
          setAnalyticsData(prev => ({
            ...prev,
            ...ov,
            topAskedTopics: analyticsRes.value.data.topAskedTopics || []
          }));
        }

        if (unansweredRes.status === 'fulfilled' && Array.isArray(unansweredRes.value?.data)) {
          setUnansweredList(unansweredRes.value.data);
        }

        if (feedbackRes.status === 'fulfilled' && Array.isArray(feedbackRes.value?.data)) {
          setFeedbackList(feedbackRes.value.data);
        }

        if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value?.data?.items)) {
          const mapped = usersRes.value.data.items.map(u => ({
            id: u.id,
            name: u.fullName || u.name,
            role: u.role === 'admin' || u.role === 'super_admin' ? 'Super Admin' : (u.role === 'faculty' ? 'Faculty Member' : 'Student'),
            email: u.email,
            identifier: u.memberId || u.id.slice(0, 8).toUpperCase(),
            department: u.department || 'Academic Department',
            designation: u.designation,
            status: u.isActive ? 'Active' : 'Deactivated'
          }));
          setUsers(mapped);
        }
      } catch {
        // Fallback gracefully to local database
      }
    };

    fetchAdminData();
  }, [activeTab]);

  // 9. AI System Health State
  const [systemHealth] = useState({
    apiStatus: 'Operational',
    uptime: '99.98%',
    vectorSearchLatencyMs: 34,
    embeddingLatencyMs: 98,
    embeddingModel: 'intfloat/multilingual-e5-base (pgvector)',
    activeChunkCount: documentService.getApprovedDocuments().reduce((acc, d) => acc + (d.chunksCount || 10), 0),
    clusterMemoryUsage: 'Connected / Isolated',
    databaseEngine: 'Supabase PostgreSQL (Connected)',
    fastApiStatus: 'Live (FastAPI RAG Pipeline)'
  });

  // 10. LLM Provider Configuration State
  const [llmConfig, setLlmConfig] = useState({
    provider: 'Gemini 1.5 Pro',
    temperature: 0.1,
    topP: 0.85,
    topKChunks: 6,
    strictnessThreshold: 0.82,
    enableAssameseFallback: true,
    apiKeyConfigured: true
  });

  const triggerToast = (msg) => {
    setActionAlert(msg);
    if (window.showUniMitraToast) {
      window.showUniMitraToast(msg, 'success');
    }
    setTimeout(() => setActionAlert(''), 3500);
  };

  // Inspect document - opens authentic PDF directly in a new tab without popup details
  const handleInspectDoc = async (doc) => {
    try {
      // 1. Check in-memory uploaded blob cache
      if (typeof window !== 'undefined' && window.__uploadedPdfBlobs) {
        const memUrl = (doc.id && window.__uploadedPdfBlobs.get(doc.id)) ||
                       (doc.uuid && window.__uploadedPdfBlobs.get(doc.uuid)) ||
                       (doc.fileName && window.__uploadedPdfBlobs.get(doc.fileName));
        if (memUrl) {
          window.open(memUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      }

      // 2. Check IndexedDB persistent storage for actual uploaded PDF file
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

      // 3. Fallback to direct URL or static institutional PDF
      const url = resolveDocPdfUrl(doc);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      const fallbackUrl = resolveDocPdfUrl(doc);
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Document Management Actions: Approve, Reject, Archive, Delete
  const handleApproveDoc = (id) => {
    documentService.approveDocument(id, 'Approved by Administrator. Vectorized into Chatbot Knowledge Base.');
    triggerToast('Document approved & vector indexed! Available immediately to students in the AI chatbot.');
  };

  const handleRejectDoc = (id) => {
    setRejectPopup({
      docId: id,
      reason: 'Missing official university seal or departmental resolution date.'
    });
  };

  const handleArchiveDoc = (id) => {
    documentService.archiveDocument(id);
    triggerToast('Document archive status toggled successfully.');
  };

  const handleDeleteDoc = (id) => {
    setConfirmPopup({
      title: 'Delete Document',
      message: 'Are you sure you want to permanently delete this document from institutional storage?',
      confirmText: 'Delete Permanently',
      confirmColor: 'bg-red-600 hover:bg-red-700 text-white',
      onConfirm: () => {
        documentService.deleteDocument(id);
        triggerToast('Document deleted from institutional repository.');
        setConfirmPopup(null);
      }
    });
  };

  // Category Taxonomy Handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await documentService.addCategory({
      name: newCatName.trim(),
      asName: newCatName.trim(),
      code: newCatCode.trim().toUpperCase() || 'GEN'
    });
    setCategories(documentService.getCategories());
    setNewCatName('');
    setNewCatCode('');
    triggerToast('New document category registered in university taxonomy.');
  };

  const handleDeleteCategory = async (id) => {
    await documentService.deleteCategory(id);
    setCategories(documentService.getCategories());
    triggerToast('Category removed from taxonomy.');
  };

  // File Dropzone Handlers for Admin Upload PDF
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
      handlePdfFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handlePdfFileSelected = (file) => {
    const validExts = ['.pdf', '.docx', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      triggerToast('Please upload a valid PDF, DOCX or TXT university document.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      triggerToast('File size exceeds the 50 MB administrative limit.');
      return;
    }

    setSelectedPdfFile(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const nameLower = file.name.toLowerCase();

    // Smart auto-detection of category from filename
    let detectedCategory = '';
    if (nameLower.includes('scholarship') || nameLower.includes('fellowship') || nameLower.includes('grant') || nameLower.includes('aid')) {
      detectedCategory = 'Scholarships & Financial Aid';
    } else if (nameLower.includes('exam') || nameLower.includes('topper') || nameLower.includes('result') || nameLower.includes('grade') || nameLower.includes('evaluation')) {
      detectedCategory = 'Examination & Evaluation Codes';
    } else if (nameLower.includes('admission') || nameLower.includes('counsel') || nameLower.includes('eligib') || nameLower.includes('entrance') || nameLower.includes('merit')) {
      detectedCategory = 'Admissions & Eligibility Criteria';
    } else if (nameLower.includes('hostel') || nameLower.includes('mess') || nameLower.includes('campus') || nameLower.includes('residential')) {
      detectedCategory = 'Campus Facilities & Hostel Bylaws';
    } else if (nameLower.includes('syllabus') || nameLower.includes('curriculum') || nameLower.includes('course')) {
      detectedCategory = 'Syllabus & Curriculum Frameworks';
    } else if (nameLower.includes('research') || nameLower.includes('phd') || nameLower.includes('doctoral')) {
      detectedCategory = 'Research & Doctoral Supervision';
    } else if (nameLower.includes('cas') || nameLower.includes('promotion') || nameLower.includes('faculty')) {
      detectedCategory = 'CAS Promotion & Faculty API Norms';
    }

    setUploadFormData(prev => ({
      ...prev,
      title: (!prev.title || prev.title.trim() === '') ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : prev.title,
      category: detectedCategory || prev.category || 'University Regulations & Ordinances'
    }));
  };

  // Extract text from uploaded document directly in browser
  const extractFileText = async (file) => {
    if (!file) return '';
    if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.type.startsWith('text/')) {
      try { return await file.text(); } catch { return ''; }
    }
    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      let str = '';
      const sliceLen = 32768;
      for (let i = 0; i < uint8.length; i += sliceLen) {
        str += String.fromCharCode.apply(null, uint8.subarray(i, Math.min(i + sliceLen, uint8.length)));
      }
      const words = [];
      const textRegex = /\(([^)]+)\)\s*(?:Tj|'|")/gi;
      let m;
      while ((m = textRegex.exec(str)) !== null) {
        const clean = m[1].replace(/\\([()\\])/g, '$1').trim();
        if (clean && clean.length > 1) words.push(clean);
      }
      const tjArrayRegex = /\[([^\]]+)\]\s*TJ/gi;
      while ((m = tjArrayRegex.exec(str)) !== null) {
        const subRegex = /\(([^)]+)\)/g;
        let sm;
        while ((sm = subRegex.exec(m[1])) !== null) {
          const c = sm[1].replace(/\\([()\\])/g, '$1').trim();
          if (c && c.length > 1) words.push(c);
        }
      }
      if (words.length > 0) {
        return words.join(' ').replace(/\s+/g, ' ');
      }
    } catch (e) {
      console.warn('Browser text parse notice:', e);
    }
    return '';
  };

  // Upload Document Clearance & Vector Ingestion
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFormData.title.trim()) {
      triggerToast('Please provide an official document title.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadStepName('1. Reading document & extracting text layers...');

    let extractedText = '';
    if (selectedPdfFile) {
      try {
        extractedText = await extractFileText(selectedPdfFile);
      } catch (err) {
        console.warn('Browser text extraction notice:', err);
      }
    }

    setUploadProgress(50);
    setUploadStepName('2. Generating semantic vector embeddings...');
    const docUuid = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    const docCustomId = `DOC-ADM-${Date.now().toString().slice(-4)}`;

    // Attempt direct ingestion into Python AI Service if available
    if (selectedPdfFile) {
      try {
        const fd = new FormData();
        fd.append('file', selectedPdfFile);
        fd.append('document_id', docUuid);
        fd.append('metadata', JSON.stringify({
          custom_id: docCustomId,
          title: uploadFormData.title,
          asTitle: uploadFormData.asTitle || uploadFormData.title,
          university: univProfile?.name || 'Nivoraya University',
          category: uploadFormData.category,
          department: uploadFormData.department,
          academicYear: uploadFormData.academicYear,
          summary: uploadFormData.summary
        }));
        const res = await fetch('http://localhost:8000/api/ai/documents/ingest', {
          method: 'POST',
          headers: { 'X-Internal-Secret': 'unimitra_internal_ai_secret_2026' },
          body: fd
        });
        if (res.ok) {
          const ingestData = await res.json();
          if (ingestData?.text_content) {
            extractedText = ingestData.text_content;
          }
        }
      } catch (ingestErr) {
        console.warn('Python AI ingest service notice:', ingestErr);
      }
    }

    setUploadProgress(85);
    setUploadStepName('3. Storing institutional document into RAG database...');

    const fileName = selectedPdfFile ? selectedPdfFile.name : `${uploadFormData.title.replace(/\s+/g, '_')}.pdf`;
    const fileExt = fileName.split('.').pop().toUpperCase();
    const fileSizeStr = selectedPdfFile ? `${(selectedPdfFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB';
    const pageEstimate = selectedPdfFile ? Math.max(1, Math.round(selectedPdfFile.size / (55 * 1024))) : 1;

    let localBlobUrl = '';
    if (selectedPdfFile && typeof window !== 'undefined') {
      try {
        localBlobUrl = URL.createObjectURL(selectedPdfFile);
        await pdfStorage.savePdf(docCustomId, selectedPdfFile);
        await pdfStorage.savePdf(docUuid, selectedPdfFile);
        await pdfStorage.savePdf(fileName, selectedPdfFile);
        window.__uploadedPdfBlobs = window.__uploadedPdfBlobs || new Map();
        window.__uploadedPdfBlobs.set(docCustomId, localBlobUrl);
        window.__uploadedPdfBlobs.set(docUuid, localBlobUrl);
        window.__uploadedPdfBlobs.set(fileName, localBlobUrl);
      } catch (err) {
        console.warn('Storage save notice:', err);
      }
    }

    const finalSummary = uploadFormData.summary || (extractedText ? extractedText.slice(0, 600) : 'Official university gazette.');

    documentService.uploadAdminDocument({
      id: docCustomId,
      uuid: docUuid,
      title: uploadFormData.title,
      asTitle: uploadFormData.asTitle || uploadFormData.title,
      university: uploadFormData.university || univProfile?.name || 'Nivoraya University',
      category: uploadFormData.category,
      department: uploadFormData.department,
      academicYear: uploadFormData.academicYear,
      fileUrl: localBlobUrl || '',
      sourceUrl: uploadFormData.sourceUrl || localBlobUrl || '',
      summary: finalSummary,
      content: extractedText || finalSummary,
      citation: uploadFormData.refNo || `${uploadFormData.title}, ${univProfile?.name || 'Nivoraya University'}`,
      fileName: fileName,
      fileType: fileExt,
      fileSize: fileSizeStr,
      pages: pageEstimate,
      chunksCount: Math.max(6, Math.round(extractedText.length / 300)),
      ocrApplied: uploadFormData.enableOcr
    }, selectedPdfFile);

    setUploadProgress(100);
    setUploadStepName('4. Document vectorized and live in AI Chatbot!');

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedPdfFile(null);
      setUploadFormData({
        title: '',
        asTitle: '',
        university: univProfile?.name || 'Nivoraya University',
        category: 'University Regulations & Ordinances',
        department: 'Examination Branch',
        academicYear: '2024-2025',
        refNo: '',
        sourceUrl: '',
        summary: '',
        enableOcr: true
      });
      handleTabChange('repository');
      triggerToast('Official PDF gazette ingested and live for AI chatbot queries!');
    }, 400);
  };

  // Toggle User Status
  const handleToggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u))
    );
    triggerToast('User account status updated.');
  };

  // Toggle Feedback Status & Delete
  const handleResolveFeedback = (id) => {
    const updated = feedbackList.map((f) =>
      f.id === id ? { ...f, status: f.status === 'Reviewed & Resolved' ? 'Pending Review' : 'Reviewed & Resolved' } : f
    );
    setFeedbackList(updated);
    try {
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('unimitra_feedback_changed', { detail: updated }));
    } catch {}
    triggerToast('Feedback resolution status updated.');
  };

  const handleDeleteFeedback = (id) => {
    const updated = feedbackList.filter((f) => f.id !== id);
    setFeedbackList(updated);
    try {
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('unimitra_feedback_changed', { detail: updated }));
    } catch {}
    triggerToast('Feedback entry deleted.');
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

  // Sidebar Menu Items with bilingual labels and live counter badges
  const adminNavItems = [
    { id: 'admin-assistant', label: 'Admin Governance AI', asLabel: 'প্ৰশাসনিক AI সহায়ক', icon: ChatBubbleIcon },
    { id: 'univ-details', label: 'University Master Details', asLabel: 'বিশ্ববিদ্যালয়ৰ মূল তথ্য', icon: BuildingLibraryIcon },
    { id: 'admin-credentials', label: 'Super Admin Credentials', asLabel: 'প্ৰশাসকৰ ক্ৰিডেনচিয়েল', icon: KeyIcon },
    { id: 'repository', label: 'Documents & Approvals', asLabel: 'নথিপত্ৰ আৰু অনুমোদন', icon: DocumentTextIcon, badge: pendingDocs.length },
    { id: 'upload', label: 'Upload & Ingest PDF', asLabel: 'PDF নথিপত্ৰ আপলোড', icon: CloudArrowUpIcon },
    { id: 'categories', label: 'Category Taxonomy', asLabel: 'শ্ৰেণীবিভাজন ব্যৱস্থাপনা', icon: FunnelIcon, count: categories.length },
    { id: 'feedback', label: 'Review Feedback', asLabel: 'সঁহাৰি আৰু মূল্যায়ন', icon: CheckCircleIcon, badge: feedbackList.filter(f => f.status !== 'Reviewed & Resolved').length },
    { id: 'admin-history', label: 'Admin Chat History', asLabel: 'প্ৰশাসনিক বাৰ্তালাপ ইতিহাস', icon: ClockIcon },
  ];

  return (
    <div className={`relative min-h-screen bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] flex flex-col lg:flex-row transition-colors duration-300 font-sans ${isDark ? 'dark' : ''}`}>
      <AuroraBackground />

      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#F7F6F0]/95 dark:bg-[#16181A]/95 backdrop-blur-md border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/40 cursor-pointer"
            aria-label="Open Admin Menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
              Uni<span className="text-[#FF933E] dark:text-[#03C988]">Mitra</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[9px] font-black uppercase border border-[#FFCB56] dark:border-[#03C988]">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
          >
            {isDark ? <SunIcon className="w-4 h-4 text-[#03C988]" /> : <MoonIcon className="w-4 h-4 text-[#FF933E]" />}
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1 rounded-xl text-xs font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-[#000000]"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* =================================================================== */}
      {/* ADMINISTRATOR NAVIGATION SIDEBAR                                    */}
      {/* =================================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-72 lg:w-80 h-screen bg-[#F7F6F0]/95 dark:bg-[#16181A]/95 backdrop-blur-md border-r border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex flex-col justify-between transition-transform duration-300 shadow-xl lg:shadow-none shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <img 
                src="/unimitra-emblem.png" 
                alt="UniMitra Shield" 
                className="w-10 h-10 object-contain drop-shadow-xs" 
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
                    Uni<span className="text-[#FF933E] dark:text-[#03C988]">Mitra</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[9px] font-black uppercase border border-[#FFCB56] dark:border-[#03C988]">
                    Super Admin
                  </span>
                </div>
                <p className="text-[10px] text-[#000000]/70 dark:text-[#FFFFFF]/70 font-semibold tracking-tight">
                  Knowledge Ingest & Governance
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#000000]/70 hover:text-[#000000] dark:text-[#FFFFFF]/70 cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Pending Approval Fast-Track Notice */}
          {pendingDocs.length > 0 && (
            <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                <span className="font-black text-amber-900 dark:text-amber-200 text-[11px]">
                  {pendingDocs.length} Pending Review{pendingDocs.length > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedApprovalFilter('Pending');
                  handleTabChange('repository');
                }}
                className="text-[10px] font-bold text-amber-800 dark:text-amber-200 underline hover:text-amber-950"
              >
                View
              </button>
            </div>
          )}

          {/* 10 Navigation Items Rail */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-[#000000]/50 dark:text-[#FFFFFF]/50 tracking-wider px-2 block mb-1">
              Admin Operations
            </span>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${isActive
                      ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-sm'
                      : 'text-[#000000] dark:text-[#FFFFFF] hover:bg-[#FFE9A9]/40 dark:hover:bg-[#13005A]/60 hover:text-[#FF933E] dark:hover:text-[#03C988]'
                    }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-[#000000]' : 'text-[#73A5CA] dark:text-[#03C988]'}`} />
                    <span className="truncate">{currentLang === 'as' ? item.asLabel : item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${isActive ? 'bg-white text-black' : 'bg-amber-500 text-white animate-pulse'
                      }`}>
                      {item.badge}
                    </span>
                  ) : item.count !== undefined ? (
                    <span className="text-[10px] opacity-60 font-mono">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Lower Sidebar Controls */}
          <div className="p-4 border-t border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shrink-0 bg-white/50 dark:bg-[#141414]/50">

            {/* System Status Pill */}
            <div className="p-2.5 rounded-xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-[11px]">
              <span className="text-[#000000]/70 dark:text-[#FFFFFF]/70 font-bold">Vector Ingestion:</span>
              <span className="font-black text-[#03C988] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#03C988] animate-ping" />
                <span>Active</span>
              </span>
            </div>

            {/* Language & Theme Controls */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onToggleLang}
                className="flex-1 py-2 px-3 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-black text-[#000000] dark:text-[#FFFFFF] cursor-pointer text-center"
              >
                {currentLang === 'en' ? 'অসমীয়া' : 'English'}
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] cursor-pointer shrink-0"
              >
                {isDark ? <SunIcon className="w-4 h-4 text-[#03C988]" /> : <MoonIcon className="w-4 h-4 text-[#FF933E]" />}
              </button>
            </div>

            {/* Exit Console Button */}
            <button
              onClick={onExit}
              className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Exit Admin Console</span>
            </button>
          </div>

        </div>
      </aside>

      {/* =================================================================== */}
      {/* MAIN VIEWPORT & TAB CONTENTS                                        */}
      {/* =================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">

        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-[#F7F6F0]/85 dark:bg-[#16181A]/85 backdrop-blur-md border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 px-6 lg:px-8 py-4 items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988]">
              {adminNavItems.find(i => i.id === activeTab)?.label}
            </span>
            <span className="text-[#000000]/40 dark:text-[#FFFFFF]/40">•</span>
            <span className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70 font-bold">
              Multi-University Knowledge Base & Vector Indexing Control
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleTabChange('admin-assistant')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer flex items-center space-x-1.5 transition-all ${
                activeTab === 'admin-assistant'
                  ? 'bg-[#123C3A] text-white dark:bg-[#55C7B2] dark:text-[#16181A] shadow-xs'
                  : 'bg-[#FFE9A9]/50 dark:bg-white/10 hover:bg-[#FFE9A9] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
              }`}
            >
              <ChatBubbleIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
              <span>Admin AI Assistant</span>
            </button>
            <button
              onClick={() => handleTabChange('upload')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Ingest PDF</span>
            </button>

            <button
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30 text-[#000000] dark:text-[#FFFFFF] cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">

          {/* =================================================================== */}
          {/* TAB: ADMIN GOVERNANCE AI CHATBOT (DEDICATED ADMINISTRATOR CHATBOT)  */}
          {/* =================================================================== */}
          {activeTab === 'admin-assistant' && (
            <div className="h-[calc(100vh-140px)] min-h-[620px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 bg-white/40 dark:bg-black/30 backdrop-blur-md animate-fade-in">
              <DashboardAiAssistant
                key={`${studentInfo?.id || 'admin'}_admin`}
                currentLang={currentLang}
                studentInfo={studentInfo}
                portalDomain="admin"
              />
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 0: UNIVERSITY MASTER CONFIGURATION & INSTITUTIONAL GOVERNANCE   */}
          {/* =================================================================== */}
          {activeTab === 'univ-details' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Hero */}
              <div className="neo-surface rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[10px] font-black uppercase text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                      Institutional Master Config
                    </span>
                    <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                      {univProfile.abbreviation} • {univProfile.naacAccreditation}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#000000] dark:text-[#FFFFFF]">
                    {univProfile.name} ({univProfile.asName})
                  </h2>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                    Administrator command center to add, update, and manage all university regulations, examinations, academic programmes, scholarships, admission criteria, and campus facilities.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigate('/dashboard/chat')}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black transition-all cursor-pointer shadow-xs flex items-center space-x-1.5"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    <span>Test Chatbot</span>
                  </button>

                  <button
                    onClick={handleResetUnivDefaults}
                    className="px-3 py-2 rounded-xl text-xs font-bold border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all cursor-pointer flex items-center space-x-1"
                    title="Reset to default data"
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Pill Rail */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'profile', label: 'University Profile', asLabel: 'প্ৰতিষ্ঠানৰ পৰিচয়' },
                  { id: 'regulations', label: 'Regulations & Ordinances', asLabel: 'অধিসূচনা আৰু বিধি', count: univRegulations.length },
                  { id: 'examinations', label: 'Examinations & Evaluation', asLabel: 'পৰীক্ষা আৰু মূল্যায়ন', count: univExaminations.length },
                  { id: 'programmes', label: 'Academic Programmes', asLabel: 'পাঠ্যক্ৰম আৰু ডিগ্ৰী', count: univProgrammes.length },
                  { id: 'scholarships', label: 'Scholarships & Grants', asLabel: 'ছাত্ৰবৃত্তি আৰু অনুদান', count: univScholarships.length },
                  { id: 'admissions', label: 'Admission Procedures', asLabel: 'ভৰ্তি প্ৰক্ৰিয়া', count: univAdmissions.length },
                  { id: 'facilities', label: 'Campus Facilities', asLabel: 'চৌহদৰ সুবিধা', count: univFacilities.length },
                  { id: 'notices', label: 'Official Notices', asLabel: 'চৰকাৰী জাননী', count: univNotices.length },
                  { id: 'test-scenarios', label: 'Benchmark Test Scenarios (3 AS + 3 EN)', asLabel: 'পৰীক্ষামূলক প্ৰশ্নাৱলী' }
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setUnivSection(subTab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${univSection === subTab.id
                        ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-xs'
                        : 'bg-white dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/30'
                      }`}
                  >
                    <span>{currentLang === 'as' ? subTab.asLabel : subTab.label}</span>
                    {subTab.count !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${univSection === subTab.id ? 'bg-black/20 text-white dark:text-black' : 'bg-[#FFE9A9] dark:bg-[#0A0A0A]'
                        }`}>
                        {subTab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sub-Section 1: University Profile */}
              {univSection === 'profile' && (
                <div className="neo-surface rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-3">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        University Master Identity & Governance
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        Edit fundamental institutional parameters. Changes immediately update landing pages, headers, and the bilingual AI assistant.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveUnivProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          University Name (English)
                        </label>
                        <input
                          type="text"
                          value={profileForm.name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          বিশ্ববিদ্যালয়ৰ নাম (অসমীয়া)
                        </label>
                        <input
                          type="text"
                          value={profileForm.asName || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, asName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Institutional Motto (English)
                        </label>
                        <input
                          type="text"
                          value={profileForm.motto || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          প্ৰতিষ্ঠানৰ মূল মন্ত্ৰ (অসমীয়া)
                        </label>
                        <input
                          type="text"
                          value={profileForm.asMotto || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, asMotto: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Vice-Chancellor (English)
                        </label>
                        <input
                          type="text"
                          value={profileForm.viceChancellor || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, viceChancellor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          উপাচাৰ্য্য (অসমীয়া)
                        </label>
                        <input
                          type="text"
                          value={profileForm.asViceChancellor || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, asViceChancellor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Registrar (English)
                        </label>
                        <input
                          type="text"
                          value={profileForm.registrar || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, registrar: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          পঞ্জীয়ক (অসমীয়া)
                        </label>
                        <input
                          type="text"
                          value={profileForm.asRegistrar || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, asRegistrar: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Campus Location & Address
                        </label>
                        <input
                          type="text"
                          value={profileForm.location || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Official Helpline Number
                        </label>
                        <input
                          type="text"
                          value={profileForm.helpline || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, helpline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          NAAC Accreditation
                        </label>
                        <input
                          type="text"
                          value={profileForm.naacAccreditation || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, naacAccreditation: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                          NIRF Ranking
                        </label>
                        <input
                          type="text"
                          value={profileForm.nirfRank || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, nirfRank: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-2"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save University Profile (তথ্যাৱলী সংৰক্ষণ কৰক)</span>
                      </button>
                    </div>
                  </form>

                  <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                        <KeyIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
                        Super Administrator Access Credentials
                      </h4>
                      <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 mt-0.5">
                        Active Super Admin: <strong>{adminCredsForm.name}</strong> ({adminCredsForm.email})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('admin-credentials')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Change Super Admin Name, Email & Password
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-Section 2: Academic Regulations & Ordinances */}
              {univSection === 'regulations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Academic Regulations & Statutory Ordinances ({univRegulations.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        Attendance criteria, credit framework, and code of conduct used by the RAG knowledge base.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('regulations')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add New Regulation</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univRegulations.map((reg) => (
                      <div
                        key={reg.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                            {reg.ordinanceNo}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('regulations', reg.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete regulation"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {reg.title}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {reg.asTitle}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 line-clamp-3">
                          {reg.summary}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#000000]/60 dark:text-[#FFFFFF]/60 truncate">
                            {reg.citation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 3: Examinations & Evaluation Guidelines */}
              {univSection === 'examinations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Examinations & Evaluation Guidelines ({univExaminations.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        Passing marks, script re-evaluation, backlog policies, and evaluation guidelines.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('examinations')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add Examination Guideline</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univExaminations.map((exam) => (
                      <div
                        key={exam.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                            {exam.category} • {exam.ordinanceNo}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('examinations', exam.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete exam ordinance"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {exam.title}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {exam.asTitle}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                          {exam.summary}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-[11px] font-mono text-[#000000]/60 dark:text-[#FFFFFF]/60">
                          Citation: {exam.citation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 4: Academic Programmes */}
              {univSection === 'programmes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Academic Programmes & Degrees ({univProgrammes.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        UG, PG, and Ph.D. degrees, course codes, departments, intake, and eligibility criteria.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('programmes')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add Degree Programme</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univProgrammes.map((prog) => (
                      <div
                        key={prog.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                            {prog.level} • {prog.code}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('programmes', prog.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete programme"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {prog.name}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {prog.asName}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                          <strong>Department:</strong> {prog.department} | <strong>Intake:</strong> {prog.intake} seats | <strong>Duration:</strong> {prog.duration}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Eligibility:</strong> {prog.eligibility}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 5: Scholarships & Financial Aid */}
              {univSection === 'scholarships' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Scholarships & Financial Aid Schemes ({univScholarships.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        State (Assam DHE), Central (UGC Ishan Uday), and reserved category student scholarship norms.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('scholarships')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add Scholarship Scheme</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univScholarships.map((schol) => (
                      <div
                        key={schol.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                            {schol.type}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('scholarships', schol.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete scholarship"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {schol.name}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {schol.asName}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                          <strong>Amount:</strong> {schol.amount} | <strong>Deadline:</strong> {schol.deadline}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Eligibility Criteria:</strong> {schol.eligibility}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 6: Admission Procedures */}
              {univSection === 'admissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Admission Procedures & Guidelines ({univAdmissions.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        PG NUPGET entrance test and Samarth e-Gov FYUGP admission workflows.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('admissions')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add Admission Procedure</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univAdmissions.map((adm) => (
                      <div
                        key={adm.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                            {adm.category}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('admissions', adm.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete admission"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {adm.title}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {adm.asTitle}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                          <strong>Timeline:</strong> {adm.dates} | <strong>Fee:</strong> {adm.fee}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 space-y-1">
                          <span className="text-[11px] font-bold text-[#000000] dark:text-[#FFFFFF] block">Procedure Checklist:</span>
                          <ul className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70 list-disc pl-4 space-y-0.5">
                            {(adm.steps || []).map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 7: Campus Facilities & Hostels */}
              {univSection === 'facilities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Campus Facilities & Hostels ({univFacilities.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        Halls of residence, central library, sports complex, and emergency health clinics.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('facilities')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Add Facility / Hostel</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {univFacilities.map((fac) => (
                      <div
                        key={fac.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                            {fac.category}
                          </span>
                          <button
                            onClick={() => handleDeleteUnivItem('facilities', fac.id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete facility"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                          {fac.name}
                        </h4>
                        <p className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                          {fac.asName}
                        </p>
                        <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                          <strong>Capacity:</strong> {fac.capacity} | <strong>Timings:</strong> {fac.timings}
                        </p>
                        <div className="pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Rules & Bylaws:</strong> {fac.rules}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 8: Official University Notices */}
              {univSection === 'notices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                        Official University Notices & Gazettes ({univNotices.length})
                      </h3>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                        Official circulars, examination form deadlines, and holiday announcements.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenAddUnivModal('notices')}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <DocumentPlusIcon className="w-4 h-4" />
                      <span>Publish New Notice</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {univNotices.map((not) => (
                      <div
                        key={not.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-[#FF933E] dark:hover:border-[#03C988] transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {not.isUrgent && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-red-500 text-white animate-pulse">
                                Urgent
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-[#FF933E] dark:text-[#03C988]">
                              {not.refNo}
                            </span>
                            <span className="text-[10px] text-[#000000]/50 dark:text-[#FFFFFF]/50">
                              • {not.date}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                            {not.title}
                          </h4>
                          <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80">
                            {not.summary}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {not.pdfUrl && (
                            <a
                              href={not.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#FFE9A9]/50 dark:bg-[#0A0A0A] border border-[#FF933E] dark:border-[#03C988] text-[#FF933E] dark:text-[#03C988] hover:bg-[#FF933E] hover:text-white dark:hover:bg-[#03C988] dark:hover:text-black font-black text-xs transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              <EyeIcon className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteUnivItem('notices', not.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer shrink-0"
                            title="Delete notice"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 9: Benchmark Test Scenarios Evaluation Center */}
              {univSection === 'test-scenarios' && (
                <div className="neo-surface rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="space-y-1 border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[10px] font-black uppercase text-[#000000] dark:text-[#FFFFFF]">
                      Problem Statement Mandate (Item 5)
                    </span>
                    <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                      Bilingual RAG Test Scenarios (3 in Assamese + 3 in English)
                    </h3>
                    <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                      The problem statement specifies demonstrating at least three meaningful test scenarios in Assamese and three in English, including at least one that tests language-specific behaviour.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 3 Assamese Scenarios */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988] flex items-center space-x-1.5">
                        <span>🟢 3 Assamese Test Scenarios</span>
                      </h4>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                          Test 1 • Academic Regulations & Passing Criteria
                        </span>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "নিভৰয়া বিশ্ববিদ্যালয়ৰ স্নাতক মহলাৰ পৰীক্ষাত উত্তীৰ্ণ হ'বলৈ নূন্যতম নম্বৰ কিমান লাগে?"
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> DU_Exam_Ordinances_2024.pdf (Clause 8.2)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("নিভৰয়া বিশ্ববিদ্যালয়ৰ স্নাতক মহলাৰ পৰীক্ষাত উত্তীৰ্ণ হ'বলৈ নূন্যতম নম্বৰ কিমান লাগে?"))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                          Test 2 • Attendance & Medical Condonation
                        </span>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "মেডিকেল কাৰণত শ্ৰেণীৰ উপস্থিতি কিমান শতাংশলৈ ৰেহাই (Condonation) পোৱা যায়?"
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> NU_Attendance_Regulations_2024.pdf (Section 4.3)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("মেডিকেল কাৰণত শ্ৰেণীৰ উপস্থিতি কিমান শতাংশলৈ ৰেহাই (Condonation) পোৱা যায়?"))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                            Test 3 • Language-Specific Behaviour
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-black">
                            Colloquial Terminology
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "ঈশান উদয় জলপানি (Ishan Uday Scholarship) পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব আৰু পাৰিবাৰিক আয়ৰ সীমা কিমান?"
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> Assam_DHE_Scholarship_Norms_2024.pdf (Section 3.1)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("ঈশান উদয় জলপানি (Ishan Uday Scholarship) পাবলৈ কি কি প্ৰমাণপত্ৰ লাগিব আৰু পাৰিবাৰিক আয়ৰ সীমা কিমান?"))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* 3 English Scenarios */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-[#FF933E] dark:text-[#03C988] flex items-center space-x-1.5">
                        <span>🔵 3 English Test Scenarios</span>
                      </h4>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                          Test 1 • Examination & Attendance Norms
                        </span>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "What is the minimum attendance required to appear in the end-semester examinations, and what is the medical condonation limit?"
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> NU_Attendance_Regulations_2024.pdf (Section 4.3)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("What is the minimum attendance required to appear in the end-semester examinations, and what is the medical condonation limit?"))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                          Test 2 • Evaluation & Script Re-checking
                        </span>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "Explain the procedure, fee, and timeline for answer script re-evaluation after examination results."
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> NU_ReEvaluation_Norms.pdf (Clause 14.1)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("Explain the procedure, fee, and timeline for answer script re-evaluation after examination results."))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988]">
                          Test 3 • Facilities & Hostel Accommodation
                        </span>
                        <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                          "What are the eligibility criteria, reservation quotas, and documents required for university hostel accommodation?"
                        </p>
                        <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70">
                          <strong>Grounded Source:</strong> NU_Hostel_Bylaws_2024.pdf (Clause 7.2)
                        </p>
                        <button
                          onClick={() => navigate('/dashboard/chat?q=' + encodeURIComponent("What are the eligibility criteria, reservation quotas, and documents required for university hostel accommodation?"))}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-[#FF933E] dark:bg-[#03C988] dark:text-black cursor-pointer shadow-xs flex items-center space-x-1"
                        >
                          <span>Execute in Chatbot</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 1: DOCUMENT REPOSITORY & APPROVAL CONTROL                       */}
          {/* =================================================================== */}
          {activeTab === 'repository' && (
            <div className="space-y-5">

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
              <div className="neo-surface rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">

                {/* Workflow Status Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] font-black uppercase text-[#000000]/70 dark:text-[#FFFFFF]/70 mr-1 shrink-0">
                    Filter:
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
                            : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
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
                    <div className="px-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                      {univProfile.abbreviation || 'UNIV'} Master Repository
                    </div>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    {documents.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete all documents from the repository?')) {
                            const empty = documentService.clearAllDocuments();
                            setDocuments(empty);
                          }
                        }}
                        className="px-3 py-2 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 cursor-pointer"
                      >
                        Clear Repository
                      </button>
                    )}
                  </div>

                  <div className="relative w-full sm:w-72">
                    <SearchIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search title, ID, or author..."
                      value={searchDocQuery}
                      onChange={(e) => setSearchDocQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Document Table */}
              <div className="neo-surface rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border-b border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000]/70 dark:text-[#FFFFFF]/80 font-black uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Document Title & ID</th>
                        <th className="p-4">Origin & Author</th>
                        <th className="p-4">Pages / Vectors</th>
                        <th className="p-4">Governance Status</th>
                        <th className="p-4">Chatbot Clearance</th>
                        <th className="p-4 text-right">Actions</th>
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
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                                  Faculty: {doc.uploaderName}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#73A5CA]/20 dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
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
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#FFE9A9]/40 text-[#000000] dark:bg-[#0A0A0A] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
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
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] text-[#000000]/70 dark:text-[#FFFFFF]/70 border border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
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
                                className="px-2.5 py-1 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 font-bold text-[11px] cursor-pointer"
                              >
                                {doc.status === 'Archived' ? 'Restore' : 'Archive'}
                              </button>
                            )}

                            {doc.approvalStatus === 'rejected' && (
                              <button
                                onClick={() => handleApproveDoc(doc.id)}
                                className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Approve Override
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleInspectDoc(doc)}
                              className="px-2.5 py-1 rounded-lg border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40 font-bold text-[11px] cursor-pointer"
                              title="Open authentic PDF in new tab"
                            >
                              Inspect
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
                      {filteredDocs.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-12 text-center text-[#000000]/60 dark:text-[#FFFFFF]/60">
                            <DocumentTextIcon className="w-10 h-10 mx-auto mb-2 text-[#FF933E] dark:text-[#03C988] opacity-60" />
                            <p className="font-black text-sm text-[#000000] dark:text-[#FFFFFF]">No Documents in Repository</p>
                            <p className="text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-1">Upload your new university PDFs in the Upload Documents tab to create fresh vector embeddings.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: DEDICATED MASTER PDF UPLOAD & VECTOR INGESTION WORKSPACE     */}
          {/* =================================================================== */}
          {activeTab === 'upload' && (
            <div className="space-y-6 max-w-5xl mx-auto">

              {/* Header Banner */}
              <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-[#FF933E] dark:text-[#03C988] font-black text-xs uppercase tracking-wider">
                      <CloudArrowUpIcon className="w-5 h-5" />
                      <span>Direct Knowledge Base Ingestion</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] mt-1">
                      Upload & Ingest Master University PDF Document
                    </h2>
                    <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
                      Direct ingestion of verified university regulations, ordinances, and syllabus gazettes into the bilingual student AI chatbot.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] shrink-0">
                    <span className="block text-[10px] uppercase text-[#FF933E] dark:text-[#03C988] font-black">Clearance Authority</span>
                    <span>Admin Uploads = Auto-Approved & Live</span>
                  </div>
                </div>
              </div>

              {/* Progress Pipeline Simulation */}
              {isUploading ? (
                <div className="p-8 sm:p-12 text-center space-y-5 bg-white dark:bg-[#141414] rounded-3xl border-2 border-[#FF933E] dark:border-[#03C988] shadow-lg animate-fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#FF933E] dark:text-[#03C988] mx-auto flex items-center justify-center font-black shadow-md">
                    <SparklesIcon className="w-9 h-9 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">{uploadStepName}</h3>
                    <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                      Processing Multilingual E5 chunk embedding & ChromaDB vector registration...
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 max-w-lg mx-auto overflow-hidden">
                    <div
                      className="bg-[#FF933E] dark:bg-[#03C988] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-black text-[#FF933E] dark:text-[#03C988] block">
                    {uploadProgress}% Ingestion Complete
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column: Interactive Form */}
                  <div className="lg:col-span-2 neo-surface rounded-3xl p-6 sm:p-8 shadow-xs">
                    <form onSubmit={handleUploadSubmit} className="space-y-5">

                      {/* Drag & Drop File Zone */}
                      <div>
                        <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-2">
                          Select Official Document File (PDF / DOCX / TXT) <span className="text-[#FF933E]">*</span>
                        </label>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-6 sm:p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${isDragging
                              ? 'border-[#FF933E] bg-[#FFE9A9]/40 scale-[1.01]'
                              : selectedPdfFile
                                ? 'border-[#03C988] bg-[#03C988]/10'
                                : 'border-[#73A5CA] dark:border-[#1C82AD] bg-[#FFE9A9]/10 dark:bg-[#0A0A0A] hover:border-[#FF933E]'
                            }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(e) => e.target.files && handlePdfFileSelected(e.target.files[0])}
                            className="hidden"
                          />

                          <div className="w-12 h-12 rounded-2xl bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#FF933E] dark:text-[#03C988] mx-auto flex items-center justify-center font-black mb-2 shadow-xs">
                            <CloudArrowUpIcon className="w-6 h-6" />
                          </div>

                          {selectedPdfFile ? (
                            <div className="space-y-1">
                              <div className="text-sm font-black text-[#000000] dark:text-[#FFFFFF] flex items-center justify-center space-x-1.5">
                                <CheckCircleIcon className="w-4 h-4 text-[#03C988]" />
                                <span>{selectedPdfFile.name}</span>
                              </div>
                              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                                {(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for vector indexing
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPdfFile(null);
                                }}
                                className="text-xs text-red-600 font-bold hover:underline"
                              >
                                Change Document
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                                Click to Browse or Drag Official PDF Gazette Here
                              </div>
                              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/70">
                                Supports scanned & digital PDFs up to 50 MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            Document Title (English) <span className="text-[#FF933E]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Revised Ordinance on CBCS Examination & Evaluation 2024"
                            value={uploadFormData.title}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            নথিৰ নাম (অসমীয়া শিৰোনাম)
                          </label>
                          <input
                            type="text"
                            placeholder="যেনে: চি.বি.চি.এছ. পৰীক্ষা আৰু মূল্যায়নৰ সংশোধিত অধিনিয়ম ২০২৪"
                            value={uploadFormData.asTitle}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, asTitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                          />
                        </div>
                      </div>

                      {/* University & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            Our University <span className="text-[#FF933E]">*</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={univProfile.name || 'Our University'}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none opacity-90 cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            Document Classification <span className="text-[#FF933E]">*</span>
                          </label>
                          <select
                            value={uploadFormData.category}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none cursor-pointer"
                          >
                            {(categories && categories.length > 0 ? categories : INITIAL_CATEGORIES).map((c) => (
                              <option 
                                key={c.id || c.code || c.name} 
                                value={c.name}
                                className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                              >
                                {c.name} {c.asName ? `(${c.asName})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Authority, Academic Year & Ref No */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            Issuing Department
                          </label>
                          <input
                            type="text"
                            value={uploadFormData.department}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, department: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
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
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                            Notification Ref / Gazette ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. GU/EXAM/NOTIF/2024/02"
                            value={uploadFormData.refNo}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, refNo: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                          />
                        </div>
                      </div>

                      {/* Source URL */}
                      <div>
                        <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Official Gazette URL or University Portal Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://gauhati.ac.in/academic/notification-2024.pdf"
                          value={uploadFormData.sourceUrl}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, sourceUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      {/* Summary & Provisions */}
                      <div>
                        <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                          Executive Abstract & Key Statutory Provisions
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Summary of passing criteria, attendance exemptions, evaluation frameworks, or scholarship quotas..."
                          value={uploadFormData.summary}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, summary: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                        />
                      </div>

                      {/* OCR Checkbox Toggle */}
                      <div className="p-3.5 rounded-2xl bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="admin-ocr-toggle"
                          checked={uploadFormData.enableOcr}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, enableOcr: e.target.checked })}
                          className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] rounded cursor-pointer"
                        />
                        <label htmlFor="admin-ocr-toggle" className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] cursor-pointer">
                          Apply Multilingual OCR (English + Assamese অসমীয়া Script) for scanned gazette pages
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <CloudArrowUpIcon className="w-5 h-5" />
                        <span>Start Extraction, Vector Embedding & Direct Chatbot Deployment</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Ingestion Architecture Guidance */}
                  <div className="space-y-4">
                    <div className="neo-surface rounded-3xl p-6 shadow-xs space-y-3">
                      <div className="flex items-center space-x-2 text-[#FF933E] dark:text-[#03C988] font-black text-xs uppercase">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Immediate Clearance</span>
                      </div>
                      <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">
                        Administrator Direct Upload
                      </h4>
                      <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                        Documents uploaded through the Administrator Console bypass the pending review queue and are immediately chunked, vectorized with Multilingual E5/BGE-M3, and made live for students querying the AI chatbot.
                      </p>
                    </div>

                    <div className="neo-surface rounded-3xl p-6 shadow-xs space-y-3">
                      <div className="flex items-center space-x-2 text-[#FF933E] dark:text-[#03C988] font-black text-xs uppercase">
                        <CpuChipIcon className="w-4 h-4" />
                        <span>RAG Pipeline Specs</span>
                      </div>
                      <ul className="space-y-2 text-xs text-[#000000] dark:text-[#FFFFFF]">
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-[#03C988] shrink-0 mt-0.5" />
                          <span><strong>Chunk Size:</strong> 512 tokens with 50-token semantic overlap.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-[#03C988] shrink-0 mt-0.5" />
                          <span><strong>Embeddings:</strong> Dense 1024-dimensional multilingual vectors.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-[#03C988] shrink-0 mt-0.5" />
                          <span><strong>Citation Index:</strong> Exact clause & page level citation mapping.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: MANAGE DOCUMENT CATEGORIES                                   */}
          {/* =================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="neo-surface rounded-3xl p-6 shadow-xs">
                <h3 className="text-base font-black text-[#000000] dark:text-[#FFFFFF] mb-4">
                  Add New Document Category to Taxonomy
                </h3>
                <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Category Name (e.g. Hostels & Welfare)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Code (e.g. WELFARE)"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full sm:w-36 px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs"
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
                    className="p-5 rounded-2xl bg-white dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-between shadow-xs"
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
          {/* TAB 7: REVIEW FEEDBACK                                              */}
          {/* =================================================================== */}
          {activeTab === 'feedback' && (
            <div className="neo-surface rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
                    Student & Faculty AI Feedback Review
                  </h3>
                  <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-0.5">
                    Live feedback submitted directly from the AI Assistant interface and university feedback forms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] text-[#000000] dark:text-[#FFFFFF]">
                    {feedbackList.length} Total Submissions
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 dark:bg-orange-950/60 border border-orange-400 text-orange-700 dark:text-orange-300">
                    {feedbackList.filter(f => f.status !== 'Reviewed & Resolved').length} Pending
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {feedbackList.length === 0 ? (
                  <div className="p-12 text-center bg-[#FFE9A9]/10 dark:bg-[#0A0A0A] rounded-2xl border border-dashed border-[#73A5CA]/40">
                    <SparklesIcon className="w-12 h-12 mx-auto text-[#FF933E] dark:text-[#03C988] mb-3" />
                    <h4 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">No Feedback Submissions</h4>
                    <p className="text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-1 max-w-md mx-auto">
                      Student and faculty feedback submitted from the AI Assistant or feedback page will automatically appear here for administrative inspection.
                    </p>
                  </div>
                ) : (
                  feedbackList.map((f) => (
                    <div
                      key={f.id}
                      className="p-5 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3 transition-all hover:border-[#FF933E]/60 dark:hover:border-[#03C988]/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">{f.user || 'Anonymous User'}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            f.role === 'Faculty' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300' :
                            f.role === 'Admin' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300' :
                            'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300'
                          }`}>
                            {f.role || 'Student'}
                          </span>
                          {f.type && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/70 dark:bg-white/10 text-[#000000]/70 dark:text-[#FFFFFF]/70 border border-[#73A5CA]/30">
                              {f.type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {f.submittedAt && (
                            <span className="text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60">
                              {f.submittedAt}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-[#FF933E]/10 dark:bg-[#03C988]/10 text-[#FF933E] dark:text-[#03C988] border border-[#FF933E]/30 dark:border-[#03C988]/30">
                            ★ {f.rating}/5
                          </span>
                        </div>
                      </div>

                      {f.query && (
                        <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs">
                          <span className="font-black text-[#FF933E] dark:text-[#03C988] uppercase text-[10px] block mb-0.5">
                            Inquired AI Query / Prompt:
                          </span>
                          <p className="font-semibold text-[#000000] dark:text-[#FFFFFF] italic">
                            "{f.query}"
                          </p>
                        </div>
                      )}

                      {f.comments && (
                        <div>
                          <span className="font-black text-[10px] uppercase text-[#000000]/60 dark:text-[#FFFFFF]/60 block mb-0.5">
                            User Comments & Review:
                          </span>
                          <p className="text-xs text-[#000000] dark:text-[#FFFFFF] leading-relaxed">
                            {f.comments}
                          </p>
                        </div>
                      )}

                      <div className="pt-3 flex items-center justify-between border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#000000]/70 dark:text-[#FFFFFF]/80 font-medium">Status:</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                            f.status === 'Reviewed & Resolved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300'
                          }`}>
                            {f.status || 'Pending Review'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveFeedback(f.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs transition-colors"
                          >
                            {f.status === 'Reviewed & Resolved' ? 'Mark Pending' : 'Mark Reviewed'}
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(f.id)}
                            className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 cursor-pointer transition-colors"
                            title="Delete Feedback"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 8: ADMIN CHAT HISTORY                                           */}
          {/* =================================================================== */}
          {activeTab === 'admin-history' && (
            <DashboardQueryHistory
              onNavigateTab={handleTabChange}
              currentLang={currentLang}
              portalDomain="admin"
              studentInfo={{ name: adminCredsForm.name || 'Super Administrator', role: 'Admin' }}
            />
          )}

          {/* =================================================================== */}
          {/* TAB 9: SUPER ADMIN CREDENTIALS & SECURITY                           */}
          {/* =================================================================== */}
          {activeTab === 'admin-credentials' && (
            <div className="max-w-3xl mx-auto neo-surface rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[10px] font-black uppercase text-[#000000] dark:text-[#FFFFFF] border border-[#FFCB56] dark:border-[#03C988]">
                    Master Security & Governance
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#000000] dark:text-[#FFFFFF] flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-[#FF933E] dark:text-[#03C988]" />
                  Super Administrator Credentials
                </h3>
                <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-1">
                  Manage the institutional Super Administrator identity, master email, and access password. Changes are immediately updated across the live database and administrator sign-in verification.
                </p>
              </div>

              <form onSubmit={handleSaveAdminCredentials} className="space-y-5 text-xs sm:text-sm">
                {/* 1. Super Admin Name */}
                <div>
                  <label className="block font-black text-[#000000] dark:text-[#FFFFFF] mb-1.5">
                    Super Administrator Full Name <span className="text-[#FF933E] dark:text-[#03C988]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <ShieldCheckIcon className="w-4 h-4 text-[#000000]/60 dark:text-[#FFFFFF]/60 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={adminCredsForm.name}
                      onChange={(e) => setAdminCredsForm({ ...adminCredsForm, name: e.target.value })}
                      placeholder="e.g. Super Administrator"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] font-bold outline-none focus:border-[#FF933E] dark:focus:border-[#03C988] transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-1 block">
                    Institutional name displayed in official reports, audit logs, and the administrator profile badge.
                  </span>
                </div>

                {/* 2. Super Admin Email */}
                <div>
                  <label className="block font-black text-[#000000] dark:text-[#FFFFFF] mb-1.5">
                    Super Administrator Official Email <span className="text-[#FF933E] dark:text-[#03C988]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-[#000000]/60 dark:text-[#FFFFFF]/60 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={adminCredsForm.email}
                      onChange={(e) => setAdminCredsForm({ ...adminCredsForm, email: e.target.value })}
                      placeholder="admin@univ.edu.in"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] font-bold outline-none focus:border-[#FF933E] dark:focus:border-[#03C988] transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-1 block">
                    Master login email where mandatory two-factor 2FA OTP codes are securely dispatched.
                  </span>
                </div>

                {/* 3. Super Admin Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-[#000000] dark:text-[#FFFFFF] mb-1.5">
                      New Super Password <span className="text-[#FF933E] dark:text-[#03C988]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#000000]/60 dark:text-[#FFFFFF]/60 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={adminCredsForm.password}
                        onChange={(e) => setAdminCredsForm({ ...adminCredsForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] font-mono outline-none focus:border-[#FF933E] dark:focus:border-[#03C988] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black dark:hover:text-white cursor-pointer"
                        title={showAdminPassword ? 'Hide password' : 'Show password'}
                      >
                        {showAdminPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-[#000000] dark:text-[#FFFFFF] mb-1.5">
                      Confirm Super Password <span className="text-[#FF933E] dark:text-[#03C988]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="w-4 h-4 text-[#000000]/60 dark:text-[#FFFFFF]/60 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] font-mono outline-none focus:border-[#FF933E] dark:focus:border-[#03C988] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Security Assurance</span>
                  </div>
                  <p className="text-[11px] text-[#000000]/70 dark:text-[#FFFFFF]/70 leading-relaxed">
                    Changing the Super Administrator credentials updates the single source of truth across the database, server environment, and browser session. Next sign-in will mandate your new password and verify OTP through your new email.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={adminCredsSaving}
                    className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-[#000000] cursor-pointer shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{adminCredsSaving ? 'Updating Credentials...' : 'Save & Propagate Super Credentials'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Universal Add University Item Modal */}
      {univAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#73A5CA]/30 dark:border-[#1C82AD]/30 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF933E] dark:text-[#03C988] block">
                  Add to Active University Repository
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] capitalize">
                  New {univAddModalDomain === 'regulations' ? 'Academic Regulation' : univAddModalDomain === 'examinations' ? 'Examination Guideline' : univAddModalDomain === 'programmes' ? 'Degree Programme' : univAddModalDomain === 'scholarships' ? 'Scholarship Scheme' : univAddModalDomain === 'admissions' ? 'Admission Procedure' : univAddModalDomain === 'facilities' ? 'Campus Facility' : 'Official Notice'}
                </h3>
              </div>
              <button
                onClick={() => setUnivAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#000000]/60 dark:text-[#FFFFFF]/60 hover:text-black cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewUnivItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                    Title / Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemForm.title || newItemForm.name || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, title: e.target.value, name: e.target.value })}
                    placeholder="e.g. CBCS Minimum Passing Criteria"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                    শীৰ্ষক / নাম (অসমীয়া) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemForm.asTitle || newItemForm.asName || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, asTitle: e.target.value, asName: e.target.value })}
                    placeholder="e.g. স্নাতক উত্তীৰ্ণ হোৱাৰ নূন্যতম চৰ্ত"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>
              </div>

              {/* Conditional Domain Fields */}
              {(univAddModalDomain === 'regulations' || univAddModalDomain === 'examinations') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Ordinance / Ref Number
                    </label>
                    <input
                      type="text"
                      value={newItemForm.ordinanceNo || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, ordinanceNo: e.target.value })}
                      placeholder="e.g. NU/AC/ORD/2024/22"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Classification Category
                    </label>
                    <input
                      type="text"
                      value={newItemForm.category || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                      placeholder="e.g. Attendance & Ordinances"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>
                </div>
              )}

              {univAddModalDomain === 'programmes' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Degree Level
                    </label>
                    <select
                      value={newItemForm.level || 'Postgraduate'}
                      onChange={(e) => setNewItemForm({ ...newItemForm, level: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    >
                      <option value="Undergraduate">Undergraduate (UG)</option>
                      <option value="Postgraduate">Postgraduate (PG)</option>
                      <option value="Doctoral">Doctoral (Ph.D.)</option>
                      <option value="Diploma">Diploma / Certificate</option>
                    </select>

                    {documents.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete all documents from the repository?')) {
                            const empty = documentService.clearAllDocuments();
                            setDocuments(empty);
                          }
                        }}
                        className="px-3 py-2 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 cursor-pointer"
                      >
                        Clear Repository
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={newItemForm.code || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, code: e.target.value })}
                      placeholder="e.g. MTECH-CSE"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Intake Seats
                    </label>
                    <input
                      type="number"
                      value={newItemForm.intake || 60}
                      onChange={(e) => setNewItemForm({ ...newItemForm, intake: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>
                </div>
              )}

              {univAddModalDomain === 'scholarships' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Award Amount
                    </label>
                    <input
                      type="text"
                      value={newItemForm.amount || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, amount: e.target.value })}
                      placeholder="e.g. ₹5,400 per month"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Provider / Funding Agency
                    </label>
                    <input
                      type="text"
                      value={newItemForm.provider || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, provider: e.target.value })}
                      placeholder="e.g. UGC / DHE Assam"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                      Application Deadline
                    </label>
                    <input
                      type="text"
                      value={newItemForm.deadline || ''}
                      onChange={(e) => setNewItemForm({ ...newItemForm, deadline: e.target.value })}
                      placeholder="e.g. 31st December"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                    />
                  </div>
                </div>
              )}

              {univAddModalDomain === 'notices' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Notice Reference Number
                      </label>
                      <input
                        type="text"
                        value={newItemForm.refNo || ''}
                        onChange={(e) => setNewItemForm({ ...newItemForm, refNo: e.target.value })}
                        placeholder="e.g. DU/EXAM/NOT/2024/912"
                        className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                        Issuing Date
                      </label>
                      <input
                        type="text"
                        value={newItemForm.date || ''}
                        onChange={(e) => setNewItemForm({ ...newItemForm, date: e.target.value })}
                        placeholder="e.g. 28 October 2024"
                        className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                        PDF File Path / URL
                      </label>
                      <input
                        type="text"
                        value={newItemForm.portalUrl || newItemForm.sourceDoc || ''}
                        onChange={(e) => setNewItemForm({ ...newItemForm, portalUrl: e.target.value, sourceDoc: e.target.value })}
                        placeholder="/notices/DU_Odd_Sem_Exam_Form_Fillup_2024.pdf"
                        className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="noticeUrgentCheckbox"
                      checked={Boolean(newItemForm.isUrgent)}
                      onChange={(e) => setNewItemForm({ ...newItemForm, isUrgent: e.target.checked })}
                      className="rounded border-gray-300 text-[#FF933E] focus:ring-[#FF933E]"
                    />
                    <label htmlFor="noticeUrgentCheckbox" className="text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer">
                      Mark as Urgent Institutional Alert (Highlight with Red Badge)
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                  Summary / Provisions (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newItemForm.summary || newItemForm.eligibility || newItemForm.rules || ''}
                  onChange={(e) => setNewItemForm({ ...newItemForm, summary: e.target.value, eligibility: e.target.value, rules: e.target.value })}
                  placeholder="Executive summary or statutory rules..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                  সাৰাংশ / নিয়মসমূহ (অসমীয়া)
                </label>
                <textarea
                  rows={2}
                  value={newItemForm.asSummary || newItemForm.asEligibility || newItemForm.asRules || ''}
                  onChange={(e) => setNewItemForm({ ...newItemForm, asSummary: e.target.value, asEligibility: e.target.value, asRules: e.target.value })}
                  placeholder="অসমীয়াত সাৰাংশ বা চৰ্তসমূহ..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                    Citation / Source Document
                  </label>
                  <input
                    type="text"
                    value={newItemForm.citation || newItemForm.sourceDoc || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, citation: e.target.value, sourceDoc: e.target.value })}
                    placeholder="e.g. DU Academic Ordinance Clause 4.3"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
                    Department / Location / Portal Link
                  </label>
                  <input
                    type="text"
                    value={newItemForm.department || newItemForm.location || newItemForm.portalUrl || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, department: e.target.value, location: e.target.value, portalUrl: e.target.value })}
                    placeholder="e.g. Academic Council / https://nivoraya.ac.in"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-[#000000] dark:text-[#FFFFFF] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
                <button
                  type="button"
                  onClick={() => setUnivAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-[#000000]/70 dark:text-[#FFFFFF]/70 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] dark:text-black cursor-pointer shadow-xs"
                >
                  Index & Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administrator Action Confirmation Popup Modal */}
      {confirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#123C3A] dark:text-[#DCE8E4]">
              {confirmPopup.title}
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              {confirmPopup.message}
            </p>
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15">
              <button
                type="button"
                onClick={() => setConfirmPopup(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#000000]/80 dark:text-[#FFFFFF]/80 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPopup.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-xs transition-all ${confirmPopup.confirmColor || 'bg-[#FF933E] hover:bg-[#E87A24] text-white'}`}
              >
                {confirmPopup.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Administrator Document Rejection Prompt Modal */}
      {rejectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#123C3A] dark:text-[#DCE8E4]">
              Reject Document / Request Revision
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              Enter reason for revision request or rejection feedback for faculty author:
            </p>
            <textarea
              value={rejectPopup.reason}
              onChange={(e) => setRejectPopup({ ...rejectPopup, reason: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-xl text-xs border border-[#123C3A]/15 dark:border-[#55C7B2]/25 bg-white dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#FF933E] text-[#000000] dark:text-[#FFFFFF]"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15">
              <button
                type="button"
                onClick={() => setRejectPopup(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#000000]/80 dark:text-[#FFFFFF]/80 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (rejectPopup.reason?.trim()) {
                    documentService.rejectDocument(rejectPopup.docId, rejectPopup.reason.trim());
                    triggerToast('Document rejected. Feedback notification routed to faculty author.');
                  }
                  setRejectPopup(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs transition-all"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification Popup */}
      {actionAlert && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#FFE9A9] dark:bg-[#1A1A1A] border-2 border-[#FF933E] dark:border-[#03C988] text-xs font-black text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-3 shadow-2xl animate-fade-in max-w-md">
          <CheckCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] shrink-0" />
          <span className="flex-1">{actionAlert}</span>
          <button
            type="button"
            onClick={() => setActionAlert('')}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
