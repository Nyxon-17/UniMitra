import { universityService } from './universityService';

// Centralized Institutional Document & Ingestion Management Service
// Integrates with Supabase PostgreSQL and Supabase Storage via Node.js Backend Gateway
// Supports bilingual (English & Assamese) documents, single-university focus (Nivoraya University),
// and role-based workflow: Faculty uploads require Administrator approval before vector indexing.

const STORAGE_KEY = 'unimitra_institutional_documents';
const CATEGORIES_KEY = 'unimitra_document_categories';
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('unimitra_auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const INITIAL_CATEGORIES = [
  { id: 'CAT-01', name: 'University Regulations & Ordinances', asName: 'বিশ্ববিদ্যালয়ৰ অধিনিয়ম আৰু বিধি', code: 'REG-ORD', count: 0 },
  { id: 'CAT-02', name: 'Examination & Evaluation Codes', asName: 'পৰীক্ষা আৰু মূল্যায়ন নীতিমালা', code: 'EXAM-EVAL', count: 0 },
  { id: 'CAT-03', name: 'Syllabus & Curriculum Frameworks', asName: 'পাঠ্যক্ৰম আৰু শৈক্ষিক ৰূপৰেখা', code: 'SYLL-CURR', count: 0 },
  { id: 'CAT-04', name: 'CAS Promotion & Faculty API Norms', asName: 'অধ্যাপক পদোন্নতি আৰু চি.এ.এছ. বিধি', code: 'FAC-CAS', count: 0 },
  { id: 'CAT-05', name: 'Research & Doctoral Supervision', asName: 'গৱেষণা আৰু পিএইচ.ডি. নিৰ্দেশনা', code: 'RES-PHD', count: 0 },
  { id: 'CAT-06', name: 'Scholarships & Financial Aid', asName: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান', code: 'SCHOL-AID', count: 0 },
  { id: 'CAT-07', name: 'Admissions & Eligibility Criteria', asName: 'ভৰ্তি প্ৰক্ৰিয়া আৰু যোগ্যতা', code: 'ADM-CRIT', count: 0 },
  { id: 'CAT-08', name: 'Campus Facilities & Hostel Bylaws', asName: 'চৌহদ সুবিধা আৰু হোষ্টেল বিধি', code: 'CAMP-HOST', codeName: 'CAMP-HOST', count: 0 }
];

export const INITIAL_DOCUMENTS = [];

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
      const cleaned = Array.isArray(parsed) ? parsed.filter(d => 
        !d.id?.startsWith('DOC-NOT-') && 
        !d.id?.startsWith('DOC-GU-') && 
        !d.id?.startsWith('DOC-FAC-SUB-') && 
        !d.id?.startsWith('DOC-UGC-') &&
        !d.id?.startsWith('DOC-DU-')
      ) : [];
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  },

  clearAllDocuments: () => {
    if (typeof window === 'undefined') return [];
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: [] }));
    return [];
  },

  saveDocuments: (docs) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: docs }));
  },

  // Asynchronously fetch documents from the backend database (Supabase PostgreSQL)
  fetchDocumentsFromBackend: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('unimitra_auth_token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/documents?limit=100`, { headers });
      if (!res.ok) return documentService.getDocuments();
      const json = await res.json();
      const serverDocs = json.data?.items || json.data || [];
      if (Array.isArray(serverDocs)) {
        const local = documentService.getDocuments();
        // Merge server docs with local newly added docs
        const serverMap = new Map();
        serverDocs.forEach(d => serverMap.set(d.id, d));
        local.forEach(d => {
          if (!serverMap.has(d.id)) {
            serverMap.set(d.id, d);
          }
        });
        const merged = Array.from(serverMap.values());
        documentService.saveDocuments(merged);
        return merged;
      }
    } catch (e) {
      // Backend not reached or offline; return local documents
    }
    return documentService.getDocuments();
  },

  getApprovedDocuments: () => {
    return documentService.getDocuments().filter(doc => doc.approvalStatus === 'approved' && doc.status === 'Indexed');
  },

  // Fetch approved documents filtered by category from backend with local fallback
  getDocumentsByCategory: async (categoryKey = 'SCHOL-AID') => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('unimitra_auth_token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/documents?category=${encodeURIComponent(categoryKey)}&limit=100`, { headers });
      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || json.data || [];
        if (Array.isArray(items)) {
          return items;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch category documents from backend:', e);
    }
    // Fallback: search local cache
    const local = documentService.getDocuments();
    const q = (categoryKey || '').toLowerCase();
    return local.filter(d => {
      const cat = (d.category || '').toLowerCase();
      const code = (d.categoryCode || '').toLowerCase();
      const title = (d.title || '').toLowerCase();
      return cat.includes(q) || code.includes(q) || (q.includes('schol') && (cat.includes('schol') || title.includes('schol')));
    });
  },

  getPendingDocuments: () => {
    return documentService.getDocuments().filter(doc => doc.approvalStatus === 'pending');
  },

  getFacultySubmissions: (userEmail) => {
    const all = documentService.getDocuments().filter(doc => doc.uploaderRole === 'Faculty');
    if (userEmail) {
      return all.filter(doc => doc.uploaderEmail && doc.uploaderEmail.toLowerCase() === userEmail.toLowerCase());
    }
    return all;
  },

  // Faculty Upload: Enters 'Pending Admin Approval' with availableToChatbot = false
  uploadFacultyDocument: async (docData, file = null) => {
    const docs = documentService.getDocuments();
    const docId = docData.id || `DOC-FAC-${Date.now().toString().slice(-4)}`;
    const newDoc = {
      id: docId,
      uuid: docData.uuid || null,
      title: docData.title || 'Untitled Academic Document',
      asTitle: docData.asTitle || docData.title || '',
      university: docData.university || universityService.getProfile()?.name || 'Nivoraya University',
      category: docData.category || 'Syllabus & Curriculum Frameworks',
      department: docData.department || 'Academic Department',
      academicYear: docData.academicYear || '2024-2025',
      publicationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pages: docData.pages || 1,
      fileSize: docData.fileSize || '2.4 MB',
      fileType: docData.fileType || 'PDF',
      fileName: docData.fileName || file?.name || 'academic_document.pdf',
      chunksCount: docData.chunksCount || 10,
      uploaderRole: 'Faculty',
      uploaderName: docData.uploaderName || 'Faculty Member',
      uploaderEmail: docData.uploaderEmail || 'faculty@nivoraya.ac.in',
      uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Admin Approval',
      approvalStatus: 'pending',
      availableToChatbot: false,
      processingStage: 'Awaiting Admin Verification',
      ocrApplied: docData.ocrApplied ?? true,
      sha256: docData.sha256 || '',
      sourceUrl: '',
      summary: docData.summary || 'Academic syllabus, examination guideline or university circular submitted by faculty member.',
      citation: docData.citation || `${docData.university || 'Nivoraya University'} Departmental Submission ${new Date().getFullYear()}`,
      content: docData.content || '',
      adminFeedback: ''
    };

    const updated = [newDoc, ...docs.filter(d => d.id !== docId)];
    documentService.saveDocuments(updated);

    // If a physical file is present, upload to Backend API
    if (file && typeof window !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', newDoc.title);
        formData.append('asTitle', newDoc.asTitle);
        formData.append('category', newDoc.category);
        formData.append('department', newDoc.department);
        formData.append('academicYear', newDoc.academicYear);
        formData.append('summary', newDoc.summary);

        const token = localStorage.getItem('unimitra_auth_token');
        const res = await fetch(`${API_BASE}/documents/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.data) {
            newDoc.uuid = resData.data.id;
            newDoc.storagePath = resData.data.storagePath;
            documentService.saveDocuments([newDoc, ...docs.filter(d => d.id !== docId)]);
          }
        }
      } catch (err) {
        // Backend upload failure handled gracefully
      }
    }

    return newDoc;
  },

  // Admin Direct Ingestion: Auto-cleared and immediately available to students in AI Chatbot
  uploadAdminDocument: async (docData, file = null) => {
    const docs = documentService.getDocuments();
    const docId = docData.id || `DOC-ADM-${Date.now().toString().slice(-4)}`;
    const newDoc = {
      id: docId,
      uuid: docData.uuid || null,
      title: docData.title || 'Institutional Gazette',
      asTitle: docData.asTitle || docData.title || '',
      university: docData.university || universityService.getProfile()?.name || 'Nivoraya University',
      category: docData.category || 'University Regulations & Ordinances',
      department: docData.department || 'Institutional Governance',
      academicYear: docData.academicYear || '2024-2025',
      publicationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pages: docData.pages || 1,
      fileSize: docData.fileSize || '3.5 MB',
      fileType: docData.fileType || 'PDF',
      fileName: docData.fileName || file?.name || 'official_gazette.pdf',
      chunksCount: docData.chunksCount || 20,
      uploaderRole: 'Admin',
      uploaderName: docData.uploaderName || 'Super Administrator',
      uploaderEmail: docData.uploaderEmail || 'admin@nivoraya.ac.in',
      uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Indexed',
      approvalStatus: 'approved',
      availableToChatbot: true,
      processingStage: 'Vector Indexed (100%)',
      ocrApplied: docData.ocrApplied ?? false,
      sha256: docData.sha256 || '',
      sourceUrl: docData.sourceUrl || '',
      summary: docData.summary || 'Verified institutional circular ingested directly by system administrator.',
      content: docData.content || docData.summary || '',
      citation: docData.citation || `Official Notification, ${new Date().getFullYear()}`,
      adminFeedback: ''
    };

    const updated = [newDoc, ...docs.filter(d => d.id !== docId)];
    documentService.saveDocuments(updated);

    // If a physical file is present, dispatch to Backend
    if (file && typeof window !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', newDoc.title);
        formData.append('asTitle', newDoc.asTitle);
        formData.append('category', newDoc.category);
        formData.append('department', newDoc.department);
        formData.append('academicYear', newDoc.academicYear);
        formData.append('summary', newDoc.summary);

        const token = localStorage.getItem('unimitra_auth_token');
        const res = await fetch(`${API_BASE}/documents/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.data) {
            newDoc.uuid = resData.data.id;
            newDoc.storagePath = resData.data.storagePath;
            documentService.saveDocuments([newDoc, ...docs.filter(d => d.id !== docId)]);
          }
        }
      } catch (err) {
        // Backend upload failure handled gracefully
      }
    }

    return newDoc;
  },

  // Admin Action: Approve document and activate for student chatbot
  approveDocument: async (docId, adminNotes = '') => {
    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId);
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

    const backendId = targetDoc?.uuid || docId;
    try {
      await fetch(`${API_BASE}/documents/${backendId}/approval`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ approvalStatus: 'approved', adminFeedback: adminNotes })
      });
    } catch (e) {
      // offline handled
    }
  },

  // Admin Action: Reject document with feedback reason
  rejectDocument: async (docId, reason = 'Document requires official verification or departmental seal.') => {
    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId);
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

    const backendId = targetDoc?.uuid || docId;
    try {
      await fetch(`${API_BASE}/documents/${backendId}/approval`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ approvalStatus: 'rejected', adminFeedback: reason })
      });
    } catch (e) {
      // offline handled
    }
  },

  // Admin Action: Archive / Restore
  archiveDocument: async (docId) => {
    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId);
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

    const backendId = targetDoc?.uuid || docId;
    try {
      await fetch(`${API_BASE}/documents/${backendId}/archive`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      // offline handled
    }
  },

  // Admin Action: Permanently delete
  deleteDocument: async (docId) => {
    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId);
    const updated = docs.filter(doc => doc.id !== docId);
    documentService.saveDocuments(updated);

    const backendId = targetDoc?.uuid || docId;
    try {
      await fetch(`${API_BASE}/documents/${backendId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      // offline handled
    }
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

// Initialize background synchronization on app start
if (typeof window !== 'undefined') {
  setTimeout(() => {
    documentService.fetchDocumentsFromBackend();
  }, 100);
}
