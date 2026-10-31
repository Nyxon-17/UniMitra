// Centralized Institutional Document & Ingestion Management Service
// Supports bilingual (English & Assamese) documents, multi-tenancy, and 
// role-based workflow: Faculty uploads require Administrator approval before vector indexing.

const STORAGE_KEY = 'unimitra_institutional_documents';
const CATEGORIES_KEY = 'unimitra_document_categories';

export const INITIAL_CATEGORIES = [
  { id: 'CAT-01', name: 'University Regulations & Ordinances', asName: 'বিশ্ববিদ্যালয়ৰ অধিনিয়ম আৰু বিধি', code: 'REG-ORD', count: 6 },
  { id: 'CAT-02', name: 'Examination & Evaluation Codes', asName: 'পৰীক্ষা আৰু মূল্যায়ন নীতিমালা', code: 'EXAM-EVAL', count: 5 },
  { id: 'CAT-03', name: 'Syllabus & Curriculum Frameworks', asName: 'পাঠ্যক্ৰম আৰু শৈক্ষিক ৰূপৰেখা', code: 'SYLL-CURR', count: 8 },
  { id: 'CAT-04', name: 'CAS Promotion & Faculty API Norms', asName: 'অধ্যাপক পদোন্নতি আৰু চি.এ.এছ. বিধি', code: 'FAC-CAS', count: 4 },
  { id: 'CAT-05', name: 'Research & Doctoral Supervision', asName: 'গৱেষণা আৰু পিএইচ.ডি. নিৰ্দেশনা', code: 'RES-PHD', count: 4 },
  { id: 'CAT-06', name: 'Scholarships & Financial Aid', asName: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান', code: 'SCHOL-AID', count: 5 },
  { id: 'CAT-07', name: 'Admissions & Eligibility Criteria', asName: 'ভৰ্তি প্ৰক্ৰিয়া আৰু যোগ্যতা', code: 'ADM-CRIT', count: 4 },
  { id: 'CAT-08', name: 'Campus Facilities & Hostel Bylaws', asName: 'চৌহদ সুবিধা আৰু হোষ্টেল বিধি', code: 'CAMP-HOST', count: 3 }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'DOC-GU-001',
    title: 'Undergraduate Examination Ordinances & Passing Criteria',
    asTitle: 'স্নাতক পৰীক্ষাৰ নিয়মাৱলী আৰু উত্তীৰ্ণ হোৱাৰ চৰ্ত',
    university: 'Gauhati University (GU)',
    category: 'University Regulations & Ordinances',
    department: 'Examination Branch',
    academicYear: '2024-2025',
    publicationDate: '15 July 2024',
    pages: 48,
    fileSize: '3.4 MB',
    fileType: 'PDF',
    fileName: 'GU_Exam_Ordinances_2024.pdf',
    chunksCount: 284,
    uploaderRole: 'Admin',
    uploaderName: 'Office of the Academic Registrar',
    uploaderEmail: 'registrar@gauhati.ac.in',
    uploadedAt: '15 Jul 2024, 11:30 AM',
    status: 'Indexed', // 'Indexed' | 'Pending Admin Approval' | 'Archived' | 'Rejected'
    approvalStatus: 'approved', // 'approved' | 'pending' | 'rejected'
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: false,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sourceUrl: 'https://gauhati.ac.in/academics/exam-ordinance-2024.pdf',
    summary: 'Statutory rules governing In-Semester sessional assessments, minimum 40% separate passing criteria, grade point calculations, and script re-checking fees.',
    citation: 'Gauhati University Examination Ordinance 2024, Clause 8.2, Page 14'
  },
  {
    id: 'DOC-DU-002',
    title: 'Statutory Regulations on Class Attendance & Medical Condonation',
    asTitle: 'শ্ৰেণী উপস্থিতি আৰু চিকিৎসা ৰেহাইৰ বিধিমলা',
    university: 'Dibrugarh University (DU)',
    category: 'University Regulations & Ordinances',
    department: 'Academic Council',
    academicYear: '2024-2025',
    publicationDate: '02 August 2024',
    pages: 36,
    fileSize: '2.8 MB',
    fileType: 'PDF',
    fileName: 'DU_Attendance_Regulations_2024.pdf',
    chunksCount: 198,
    uploaderRole: 'Admin',
    uploaderName: 'Office of Dean Academic Affairs',
    uploaderEmail: 'dean_academic@dibru.ac.in',
    uploadedAt: '02 Aug 2024, 02:15 PM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: false,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sourceUrl: 'https://dibru.ac.in/academic/attendance-ordinance.pdf',
    summary: 'Mandatory 75% class attendance requirement, with statutory provision for up to 10% medical condonation on verified health grounds.',
    citation: 'Dibrugarh University Regulations 2024, Section 4.3, Page 9'
  },
  {
    id: 'DOC-UGC-003',
    title: 'UGC Regulations on Minimum Qualifications for Appointment & CAS Promotion',
    asTitle: 'ইউজিচি পদোন্নতি আৰু চি.এ.এছ. নিৰ্দেশনাৱলী (২০১৮ সংশোধিত)',
    university: 'All Universities of Assam',
    category: 'CAS Promotion & Faculty API Norms',
    department: 'Higher Education Governance',
    academicYear: '2023-2024',
    publicationDate: '18 July 2023',
    pages: 114,
    fileSize: '4.8 MB',
    fileType: 'PDF',
    fileName: 'UGC_CAS_Regulations_Amended.pdf',
    chunksCount: 420,
    uploaderRole: 'Admin',
    uploaderName: 'State Higher Education Council',
    uploaderEmail: 'admin@unimitra.edu.in',
    uploadedAt: '18 Jul 2023, 10:00 AM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: true,
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    sourceUrl: 'https://ugc.gov.in/pdfnews/123456_CAS.pdf',
    summary: 'Career Advancement Scheme guidelines, PBAS methodology, API scoring for journal publications, and promotion criteria for Assistant, Associate, and Professor ranks.',
    citation: 'UGC Gazette Notification, Appendix II, Table 1, Page 68'
  },
  {
    id: 'DOC-TU-004',
    title: 'Regulations Governing PhD Degree & Research Supervision Ordinances',
    asTitle: 'পিএইচ.ডি. গৱেষণা আৰু তত্ত্বাবধানৰ চৰকাৰী বিধিমলা',
    university: 'Tezpur University (TU)',
    category: 'Research & Doctoral Supervision',
    department: 'Office of Research & Development',
    academicYear: '2024-2025',
    publicationDate: '12 January 2024',
    pages: 56,
    fileSize: '3.1 MB',
    fileType: 'PDF',
    fileName: 'TU_PhD_Regulations_2024.pdf',
    chunksCount: 226,
    uploaderRole: 'Admin',
    uploaderName: 'Academic Section',
    uploaderEmail: 'acad@tezu.ernet.in',
    uploadedAt: '12 Jan 2024, 04:45 PM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: false,
    sha256: '5d41402abc4b2a76b9719d911017c592ee5a2a5a5ab8d8e5784a9e59d9c28e8a',
    sourceUrl: 'https://tezu.ernet.in/academic/phd-reg-2024.pdf',
    summary: 'Statutory quotas for scholar supervision: Professor (8), Associate Professor (6), Assistant Professor (4). Prescribes mandatory course work credits.',
    citation: 'Tezpur University Doctoral Code, Section 9, Page 22'
  },
  {
    id: 'DOC-FAC-SUB-101',
    title: 'Syllabus & Curriculum Framework for M.Sc. Data Science & AI (NEP 2020)',
    asTitle: 'এম.এছচি. ডাটা চাইন্স আৰু এ.আই. পাঠ্যক্ৰম ৰূপৰেখা',
    university: 'Gauhati University (GU)',
    category: 'Syllabus & Curriculum Frameworks',
    department: 'Computer Science & Engineering',
    academicYear: '2024-2025',
    publicationDate: '24 October 2024',
    pages: 38,
    fileSize: '2.5 MB',
    fileType: 'PDF',
    fileName: 'MSc_DataScience_Syllabus_GU_2024.pdf',
    chunksCount: 168,
    uploaderRole: 'Faculty',
    uploaderName: 'Dr. J. K. Sarma, Associate Professor',
    uploaderEmail: 'jksarma@gauhati.ac.in',
    uploadedAt: '28 Oct 2024, 03:20 PM',
    status: 'Pending Admin Approval',
    approvalStatus: 'pending',
    availableToChatbot: false,
    processingStage: 'Awaiting Admin Verification',
    ocrApplied: true,
    sha256: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    sourceUrl: '',
    summary: 'Revised postgraduate curriculum for M.Sc. Data Science & Artificial Intelligence comprising Machine Learning, Deep Learning, Cloud Computing, and Capstone Project credits.',
    citation: 'Gauhati University Board of Studies Resolution No. 04/2024'
  },
  {
    id: 'DOC-FAC-SUB-102',
    title: 'Departmental Examination Schedule & Sessional Evaluation Guidelines',
    asTitle: 'বিভাগীয় পৰীক্ষা সূচী আৰু ছেচনেল মূল্যায়ন নিৰ্দেশনা',
    university: 'Dibrugarh University (DU)',
    category: 'Examination & Evaluation Codes',
    department: 'Department of Biotechnology',
    academicYear: '2024-2025',
    publicationDate: '27 October 2024',
    pages: 14,
    fileSize: '1.2 MB',
    fileType: 'PDF',
    fileName: 'Biotech_Sessional_Guidelines_DU.pdf',
    chunksCount: 64,
    uploaderRole: 'Faculty',
    uploaderName: 'Dr. P. Phukan, Assistant Professor',
    uploaderEmail: 'pphukan@dibru.ac.in',
    uploadedAt: '29 Oct 2024, 11:15 AM',
    status: 'Pending Admin Approval',
    approvalStatus: 'pending',
    availableToChatbot: false,
    processingStage: 'Awaiting Admin Verification',
    ocrApplied: false,
    sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    sourceUrl: '',
    summary: 'Internal assessment schedule, presentation evaluation rubrics, laboratory log submission deadlines, and make-up examination policies for odd semester students.',
    citation: 'DU Dept. of Biotechnology Internal Notification Ref. DU/BT/EXAM/24/09'
  }
];

// Read from LocalStorage or initialize
export const documentService = {
  getDocuments: () => {
    if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  saveDocuments: (docs) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: docs }));
  },

  getApprovedDocuments: () => {
    return documentService.getDocuments().filter(doc => doc.approvalStatus === 'approved' && doc.status === 'Indexed');
  },

  getPendingDocuments: () => {
    return documentService.getDocuments().filter(doc => doc.approvalStatus === 'pending');
  },

  getFacultySubmissions: (userEmail) => {
    const all = documentService.getDocuments().filter(doc => doc.uploaderRole === 'Faculty');
    if (userEmail) {
      return all.filter(doc => doc.uploaderEmail.toLowerCase() === userEmail.toLowerCase());
    }
    return all;
  },

  // Faculty Upload: Enters 'Pending Admin Approval' with availableToChatbot = false
  uploadFacultyDocument: (docData) => {
    const docs = documentService.getDocuments();
    const newDoc = {
      id: `DOC-FAC-${Date.now().toString().slice(-4)}`,
      title: docData.title || 'Untitled Academic Document',
      asTitle: docData.asTitle || docData.title || '',
      university: docData.university || 'Gauhati University (GU)',
      category: docData.category || 'Syllabus & Curriculum Frameworks',
      department: docData.department || 'Academic Department',
      academicYear: docData.academicYear || '2024-2025',
      publicationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pages: docData.pages || Math.floor(Math.random() * 30) + 10,
      fileSize: docData.fileSize || '2.4 MB',
      fileType: docData.fileType || 'PDF',
      fileName: docData.fileName || 'academic_document.pdf',
      chunksCount: docData.chunksCount || Math.floor(Math.random() * 150) + 40,
      uploaderRole: 'Faculty',
      uploaderName: docData.uploaderName || 'Faculty Member',
      uploaderEmail: docData.uploaderEmail || 'faculty@university.ac.in',
      uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Admin Approval',
      approvalStatus: 'pending',
      availableToChatbot: false,
      processingStage: 'Awaiting Admin Verification',
      ocrApplied: docData.ocrApplied ?? true,
      sha256: docData.sha256 || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      sourceUrl: '',
      summary: docData.summary || 'Academic syllabus, examination guideline or university circular submitted by authorized faculty member.',
      citation: docData.citation || `${docData.university} Departmental Submission ${new Date().getFullYear()}`,
      adminFeedback: ''
    };

    const updated = [newDoc, ...docs];
    documentService.saveDocuments(updated);
    return newDoc;
  },

  // Admin Direct Ingestion: Auto-cleared and immediately available to students in AI Chatbot
  uploadAdminDocument: (docData) => {
    const docs = documentService.getDocuments();
    const newDoc = {
      id: `DOC-ADM-${Date.now().toString().slice(-4)}`,
      title: docData.title || 'Institutional Gazette',
      asTitle: docData.asTitle || docData.title || '',
      university: docData.university || 'All Universities of Assam',
      category: docData.category || 'University Regulations & Ordinances',
      department: docData.department || 'Institutional Governance',
      academicYear: docData.academicYear || '2024-2025',
      publicationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pages: docData.pages || Math.floor(Math.random() * 50) + 20,
      fileSize: docData.fileSize || '3.5 MB',
      fileType: docData.fileType || 'PDF',
      fileName: docData.fileName || 'official_gazette.pdf',
      chunksCount: docData.chunksCount || Math.floor(Math.random() * 250) + 80,
      uploaderRole: 'Admin',
      uploaderName: docData.uploaderName || 'Super Administrator',
      uploaderEmail: docData.uploaderEmail || 'admin@unimitra.edu.in',
      uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Indexed',
      approvalStatus: 'approved',
      availableToChatbot: true,
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: docData.ocrApplied ?? false,
      sha256: docData.sha256 || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      sourceUrl: docData.sourceUrl || '',
      summary: docData.summary || 'Verified institutional circular ingested directly by system administrator.',
      citation: docData.citation || `Official Notification, ${new Date().getFullYear()}`,
      adminFeedback: ''
    };

    const updated = [newDoc, ...docs];
    documentService.saveDocuments(updated);
    return newDoc;
  },

  // Admin Action: Approve document and activate for student chatbot
  approveDocument: (docId, adminNotes = '') => {
    const docs = documentService.getDocuments();
    const updated = docs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          approvalStatus: 'approved',
          status: 'Indexed',
          availableToChatbot: true,
          processingStage: 'Vector Indexed (100%)',
          adminFeedback: adminNotes || 'Approved & verified by Administrator. Vectorized for AI query resolution.'
        };
      }
      return doc;
    });
    documentService.saveDocuments(updated);
  },

  // Admin Action: Reject document with feedback reason
  rejectDocument: (docId, reason = 'Document requires official verification or departmental seal.') => {
    const docs = documentService.getDocuments();
    const updated = docs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          approvalStatus: 'rejected',
          status: 'Rejected',
          availableToChatbot: false,
          processingStage: 'Rejected by Administrator',
          adminFeedback: reason
        };
      }
      return doc;
    });
    documentService.saveDocuments(updated);
  },

  // Admin Action: Archive / Restore
  archiveDocument: (docId) => {
    const docs = documentService.getDocuments();
    const updated = docs.map(doc => {
      if (doc.id === docId) {
        const nextStatus = doc.status === 'Archived' ? 'Indexed' : 'Archived';
        return {
          ...doc,
          status: nextStatus,
          availableToChatbot: nextStatus === 'Indexed' && doc.approvalStatus === 'approved'
        };
      }
      return doc;
    });
    documentService.saveDocuments(updated);
  },

  // Admin Action: Permanently delete
  deleteDocument: (docId) => {
    const docs = documentService.getDocuments();
    const updated = docs.filter(doc => doc.id !== docId);
    documentService.saveDocuments(updated);
  },

  // Categories
  getCategories: () => {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories: (cats) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  },

  addCategory: (category) => {
    const cats = documentService.getCategories();
    const newCat = {
      id: `CAT-${(cats.length + 1).toString().padStart(2, '0')}`,
      name: category.name,
      asName: category.asName || category.name,
      code: category.code || 'GEN-TAX',
      count: 0
    };
    const updated = [...cats, newCat];
    documentService.saveCategories(updated);
    return newCat;
  },

  deleteCategory: (catId) => {
    const cats = documentService.getCategories();
    const updated = cats.filter(c => c.id !== catId);
    documentService.saveCategories(updated);
  }
};

