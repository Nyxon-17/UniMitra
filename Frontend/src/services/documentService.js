import { universityService } from './universityService';
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

export const INITIAL_DOCUMENTS = [];

// Read from LocalStorage or initialize
export const documentService = {
  getDocuments: () => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    try {
      const parsed = JSON.parse(stored);
      // Clear out all old seeded sample PDFs (DOC-NOT-, DOC-GU-, DOC-FAC-SUB-, DOC-UGC-)
      const hasOldSeeded = parsed.some(d => d.id?.startsWith('DOC-NOT-') || d.id === 'DOC-GU-001' || d.id === 'DOC-FAC-SUB-101' || d.id === 'DOC-UGC-003');
      if (hasOldSeeded) {
        const userUploadedOnly = parsed.filter(d => !d.id?.startsWith('DOC-NOT-') && d.id !== 'DOC-GU-001' && d.id !== 'DOC-FAC-SUB-101' && d.id !== 'DOC-UGC-003');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userUploadedOnly));
        return userUploadedOnly;
      }
      return parsed;
    } catch {
      return [];
    }
  },

  clearAllDocuments: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: [] }));
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
      university: docData.university || universityService.getProfile()?.name || 'Dibrugarh University (DU)',
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('unimitra_site_notification', {
        detail: {
          id: `NOTIF-${Date.now()}`,
          title: 'New Academic Document Uploaded',
          asTitle: 'নতুন শৈক্ষিক নথি অন্তৰ্ভুক্ত কৰা হৈছে',
          message: `"${newDoc.title}" submitted by Faculty (${newDoc.uploaderName || 'Faculty Member'}).`,
          author: 'Faculty Member',
          role: 'faculty',
          timestamp: 'Just now'
        }
      }));
    }
    return newDoc;
  },

  // Admin Direct Ingestion: Auto-cleared and immediately available to students in AI Chatbot
  uploadAdminDocument: (docData) => {
    const docs = documentService.getDocuments();
    const newDoc = {
      id: `DOC-ADM-${Date.now().toString().slice(-4)}`,
      title: docData.title || 'Institutional Gazette',
      asTitle: docData.asTitle || docData.title || '',
      university: docData.university || universityService.getProfile()?.name || 'Dibrugarh University (DU)',
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('unimitra_site_notification', {
        detail: {
          id: `NOTIF-${Date.now()}`,
          title: 'New Academic Document Uploaded',
          asTitle: 'নতুন শৈক্ষিক নথি অন্তৰ্ভুক্ত কৰা হৈছে',
          message: `"${newDoc.title}" submitted by Faculty (${newDoc.uploaderName || 'Faculty Member'}).`,
          author: 'Faculty Member',
          role: 'faculty',
          timestamp: 'Just now'
        }
      }));
    }
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

