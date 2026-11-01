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
    id: 'DOC-NOT-001',
    title: 'Submission of Examination Forms for Odd Semester Examinations 2024',
    asTitle: 'অযুগ্ম ষাণ্মাসিক পৰীক্ষা ২০২৪ ৰ পৰীক্ষা ফৰ্ম জমা দিয়াৰ জাননী',
    university: 'Dibrugarh University (DU)',
    category: 'Examination & Evaluation Codes',
    department: 'Office of the Controller of Examinations',
    academicYear: '2024-2025',
    publicationDate: '28 October 2024',
    pages: 1,
    fileSize: '5.4 KB',
    fileType: 'PDF',
    fileName: 'DU_Odd_Sem_Exam_Form_Fillup_2024.pdf',
    fileUrl: '/notices/DU_Odd_Sem_Exam_Form_Fillup_2024.pdf',
    chunksCount: 12,
    uploaderRole: 'Admin',
    uploaderName: 'Office of the Controller of Examinations',
    uploaderEmail: 'coe@dibru.ac.in',
    uploadedAt: '28 Oct 2024, 10:00 AM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: true,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sourceUrl: '/notices/DU_Odd_Sem_Exam_Form_Fillup_2024.pdf',
    summary: 'Online examination portal activation from 1st to 15th November 2024 for Odd Semester UG (CBCS/FYUGP) and PG examinations. Late fine of ₹300 applies up to 20th November.',
    citation: 'Dibrugarh University Examination Circular Ref. DU/EXAM/NOT/2024/912'
  },
  {
    id: 'DOC-NOT-002',
    title: 'DUPGET Merit List & Counselling Schedule for PG Admissions 2024-25',
    asTitle: 'স্নাতকোত্তৰ নামভৰ্তিৰ বাবে DUPGET মেধা তালিকা আৰু কাউন্সেলিং সূচী',
    university: 'Dibrugarh University (DU)',
    category: 'Admissions & Eligibility Criteria',
    department: 'Office of the Academic Registrar',
    academicYear: '2024-2025',
    publicationDate: '20 October 2024',
    pages: 1,
    fileSize: '5.3 KB',
    fileType: 'PDF',
    fileName: 'DU_DUPGET_Admission_Counselling_2024.pdf',
    fileUrl: '/notices/DU_DUPGET_Admission_Counselling_2024.pdf',
    chunksCount: 10,
    uploaderRole: 'Admin',
    uploaderName: 'Office of the Academic Registrar',
    uploaderEmail: 'registrar@dibru.ac.in',
    uploadedAt: '20 Oct 2024, 11:30 AM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: true,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sourceUrl: '/notices/DU_DUPGET_Admission_Counselling_2024.pdf',
    summary: 'Subject-wise DUPGET provisional merit list publication and departmental physical counselling schedule with mandatory verification of PRC and original marksheets.',
    citation: 'Office of the Academic Registrar Notification Ref. DU/ACAD/ADM/2024/441'
  },
  {
    id: 'DOC-NOT-003',
    title: 'Statutory Regulations on Class Attendance & Medical Condonation (Clause 4.3)',
    asTitle: 'শ্ৰেণী উপস্থিতি আৰু চিকিৎসা ৰেহাইৰ বিধিমলা (ধাৰা ৪.৩)',
    university: 'Dibrugarh University (DU)',
    category: 'University Regulations & Ordinances',
    department: 'Office of the Dean, Academic Affairs',
    academicYear: '2024-2025',
    publicationDate: '02 August 2024',
    pages: 1,
    fileSize: '5.3 KB',
    fileType: 'PDF',
    fileName: 'DU_Medical_Attendance_Condonation_2024.pdf',
    fileUrl: '/notices/DU_Medical_Attendance_Condonation_2024.pdf',
    chunksCount: 14,
    uploaderRole: 'Admin',
    uploaderName: 'Office of the Dean, Academic Affairs',
    uploaderEmail: 'dean_acad@dibru.ac.in',
    uploadedAt: '02 Aug 2024, 02:15 PM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: true,
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    sourceUrl: '/notices/DU_Medical_Attendance_Condonation_2024.pdf',
    summary: 'Statutory 75% class attendance requirement for End-Semester examinations, with provision for up to 10% medical condonation on verified health grounds endorsed by CMO.',
    citation: 'Dibrugarh University Academic Regulations Clause 4.3, Ref. DU/ACAD/ATT/2024/108'
  },
  {
    id: 'DOC-NOT-004',
    title: 'UGC Ishan Uday Special Scholarship Scheme for North Eastern Region (NER) 2024-25',
    asTitle: 'উত্তৰ-পূব অঞ্চলৰ ছাত্ৰ-ছাত্ৰীৰ বাবে ঈশান উদয় বিশেষ ছাত্ৰবৃত্তি জাননী',
    university: 'Dibrugarh University (DU)',
    category: 'Scholarships & Financial Aid',
    department: 'Scholarship Cell & Student Welfare Section',
    academicYear: '2024-2025',
    publicationDate: '15 October 2024',
    pages: 1,
    fileSize: '5.5 KB',
    fileType: 'PDF',
    fileName: 'DU_Ishan_Uday_Scholarship_2024.pdf',
    fileUrl: '/notices/DU_Ishan_Uday_Scholarship_2024.pdf',
    chunksCount: 16,
    uploaderRole: 'Admin',
    uploaderName: 'Coordinator, Scholarship Cell',
    uploaderEmail: 'scholarship@dibru.ac.in',
    uploadedAt: '15 Oct 2024, 09:30 AM',
    status: 'Indexed',
    approvalStatus: 'approved',
    availableToChatbot: true,
    processingStage: 'Vector Indexed (100%)',
    ocrApplied: true,
    sha256: '5d41402abc4b2a76b9719d911017c592ee5a2a5a5ab8d8e5784a9e59d9c28e8a',
    sourceUrl: '/notices/DU_Ishan_Uday_Scholarship_2024.pdf',
    summary: 'Financial support of ₹5,400/month for General UG degree and ₹7,800/month for Technical/Medical degrees for students having NER domicile with parental income below ₹4.5 Lakhs.',
    citation: 'UGC / Dibrugarh University Scholarship Notification Ref. DU/SCHOL/UGC/2024/67'
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
      const parsed = JSON.parse(stored);
      // Clean legacy dummy test records if found
      const hasDummy = parsed.some(d => d.id === 'DOC-GU-001' || d.id === 'DOC-FAC-SUB-101' || d.id === 'DOC-UGC-003');
      if (hasDummy) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
        return INITIAL_DOCUMENTS;
      }
      return parsed;
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

