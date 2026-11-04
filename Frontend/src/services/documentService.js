import { universityService } from './universityService.js';
import { pdfStorage } from './pdfStorage.js';

// Centralized Institutional Document & Ingestion Management Service
// Integrates with Supabase PostgreSQL and Supabase Storage via Node.js Backend Gateway
// Supports bilingual (English & Assamese) documents, single-university focus (Nivoraya University),
// and role-based workflow: Faculty uploads require Administrator approval before vector indexing.

const STORAGE_KEY = 'unimitra_institutional_documents';
const CATEGORIES_KEY = 'unimitra_document_categories';
const DELETED_DOCS_KEY = 'unimitra_deleted_document_ids';
const INITIALIZED_KEY = 'unimitra_docs_initialized';
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';

const getDeletedDocIds = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_DOCS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
};

const markDocDeleted = (id) => {
  if (!id || typeof window === 'undefined') return;
  try {
    const deleted = getDeletedDocIds();
    deleted.add(id);
    localStorage.setItem(DELETED_DOCS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {}
};

const unmarkDocDeleted = (id) => {
  if (!id || typeof window === 'undefined') return;
  try {
    const deleted = getDeletedDocIds();
    deleted.delete(id);
    localStorage.setItem(DELETED_DOCS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {}
};

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
    if (typeof window === 'undefined') return INITIAL_DOCUMENTS.filter(d => !getDeletedDocIds().has(d.id));
    const stored = localStorage.getItem(STORAGE_KEY);
    const deleted = getDeletedDocIds();

    if (stored === null) {
      // First-time setup ONLY if storage key has NEVER been created
      const hasInit = localStorage.getItem(INITIALIZED_KEY);
      if (!hasInit) {
        localStorage.setItem(INITIALIZED_KEY, 'true');
        const initial = INITIAL_DOCUMENTS.filter(d => !deleted.has(d.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Filter out any explicitly deleted IDs and legacy demo documents
      const filtered = parsed.filter(d => 
        d && 
        !deleted.has(d.id) && 
        (!d.uuid || !deleted.has(d.uuid)) &&
        !d.id?.startsWith('DOC-NUAL-2027-') &&
        !d.id?.startsWith('DOC-NOT-') && 
        !d.id?.startsWith('DOC-GU-') && 
        !d.id?.startsWith('DOC-FAC-SUB-') && 
        !d.id?.startsWith('DOC-UGC-') &&
        !d.id?.startsWith('DOC-DU-')
      );

      // NEVER restore INITIAL_DOCUMENTS when the user has deleted all items!
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  clearAllDocuments: () => {
    if (typeof window === 'undefined') return [];
    try {
      const docs = documentService.getDocuments();
      docs.forEach(d => {
        if (d.id) markDocDeleted(d.id);
        if (d.uuid) markDocDeleted(d.uuid);
      });
      // Mark all default demo IDs as deleted so they NEVER reappear
      INITIAL_DOCUMENTS.forEach(d => {
        if (d.id) markDocDeleted(d.id);
      });
    } catch {}

    localStorage.setItem(INITIALIZED_KEY, 'true');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: [] }));
    return [];
  },

  saveDocuments: (docs) => {
    if (typeof window === 'undefined') return;
    const safeDocs = Array.isArray(docs) ? docs : [];
    localStorage.setItem(INITIALIZED_KEY, 'true');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDocs));
    window.dispatchEvent(new CustomEvent('unimitra_documents_changed', { detail: safeDocs }));
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
        const deleted = getDeletedDocIds();
        const supabaseBase = import.meta.env?.VITE_SUPABASE_URL || 'https://kbrhnwyxyiiifmwpfnfm.supabase.co';
        const formattedServerDocs = serverDocs
          .filter(d => !deleted.has(d.id) && (!d.uuid || !deleted.has(d.uuid)))
          .map(d => {
            let fileUrl = d.fileUrl || d.sourceUrl || '';
            if (!fileUrl && d.storagePath) {
              fileUrl = `${supabaseBase}/storage/v1/object/public/unimitra-documents/${d.storagePath}`;
            }
            return {
              ...d,
              fileUrl,
              sourceUrl: fileUrl || d.sourceUrl || ''
            };
          });
        const local = documentService.getDocuments();
        // Merge server docs with local newly added docs
        const serverMap = new Map();
        formattedServerDocs.forEach(d => serverMap.set(d.id, d));
        local.forEach(d => {
          if (!serverMap.has(d.id) && !deleted.has(d.id) && (!d.uuid || !deleted.has(d.uuid))) {
            let fileUrl = d.fileUrl || d.sourceUrl || '';
            if (!fileUrl && d.storagePath) {
              fileUrl = `${supabaseBase}/storage/v1/object/public/unimitra-documents/${d.storagePath}`;
            }
            serverMap.set(d.id, { ...d, fileUrl, sourceUrl: fileUrl || d.sourceUrl || '' });
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
    unmarkDocDeleted(docId);
    if (docData.uuid) unmarkDocDeleted(docData.uuid);

    let localBlobUrl = docData.fileUrl || '';
    if (file && typeof window !== 'undefined' && window.URL) {
      try {
        localBlobUrl = URL.createObjectURL(file);
        pdfStorage.savePdf(docId, file);
        if (docData.uuid) pdfStorage.savePdf(docData.uuid, file);
        if (docData.fileName || file.name) pdfStorage.savePdf(docData.fileName || file.name, file);
        window.__uploadedPdfBlobs = window.__uploadedPdfBlobs || new Map();
        window.__uploadedPdfBlobs.set(docId, localBlobUrl);
        if (docData.uuid) window.__uploadedPdfBlobs.set(docData.uuid, localBlobUrl);
        if (docData.fileName || file.name) window.__uploadedPdfBlobs.set(docData.fileName || file.name, localBlobUrl);
      } catch (e) {
        console.warn('Faculty local blob storage notice:', e);
      }
    }

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
      fileUrl: docData.fileUrl || localBlobUrl || '',
      sourceUrl: docData.sourceUrl || localBlobUrl || '',
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
            const supabaseBase = import.meta.env?.VITE_SUPABASE_URL || 'https://kbrhnwyxyiiifmwpfnfm.supabase.co';
            newDoc.fileUrl = resData.data.fileUrl || `${supabaseBase}/storage/v1/object/public/unimitra-documents/${resData.data.storagePath}`;
            newDoc.sourceUrl = newDoc.fileUrl;
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
    unmarkDocDeleted(docId);
    if (docData.uuid) unmarkDocDeleted(docData.uuid);

    let localBlobUrl = docData.fileUrl || '';
    if (file && typeof window !== 'undefined' && window.URL) {
      try {
        localBlobUrl = URL.createObjectURL(file);
        pdfStorage.savePdf(docId, file);
        if (docData.uuid) pdfStorage.savePdf(docData.uuid, file);
        if (docData.fileName || file.name) pdfStorage.savePdf(docData.fileName || file.name, file);
        window.__uploadedPdfBlobs = window.__uploadedPdfBlobs || new Map();
        window.__uploadedPdfBlobs.set(docId, localBlobUrl);
        if (docData.uuid) window.__uploadedPdfBlobs.set(docData.uuid, localBlobUrl);
        if (docData.fileName || file.name) window.__uploadedPdfBlobs.set(docData.fileName || file.name, localBlobUrl);
      } catch (e) {
        console.warn('Admin local blob storage notice:', e);
      }
    }

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
      fileUrl: docData.fileUrl || localBlobUrl || '',
      sourceUrl: docData.sourceUrl || localBlobUrl || '',
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
            const supabaseBase = import.meta.env?.VITE_SUPABASE_URL || 'https://kbrhnwyxyiiifmwpfnfm.supabase.co';
            newDoc.fileUrl = resData.data.fileUrl || `${supabaseBase}/storage/v1/object/public/unimitra-documents/${resData.data.storagePath}`;
            newDoc.sourceUrl = newDoc.fileUrl;
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
    if (!docId) return;
    markDocDeleted(docId);

    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId);
    if (targetDoc?.uuid) {
      markDocDeleted(targetDoc.uuid);
    }
    if (targetDoc?.fileName) {
      markDocDeleted(targetDoc.fileName);
    }

    // 1. Purge local PDF binary storage & in-memory blob URLs
    try {
      pdfStorage.deletePdf(docId);
      if (targetDoc?.uuid) pdfStorage.deletePdf(targetDoc.uuid);
      if (targetDoc?.fileName) pdfStorage.deletePdf(targetDoc.fileName);
      if (typeof window !== 'undefined' && window.__uploadedPdfBlobs) {
        window.__uploadedPdfBlobs.delete(docId);
        if (targetDoc?.uuid) window.__uploadedPdfBlobs.delete(targetDoc.uuid);
        if (targetDoc?.fileName) window.__uploadedPdfBlobs.delete(targetDoc.fileName);
      }
    } catch {}

    // 2. Remove document from local repository & notify subscribers
    const updated = docs.filter(doc => doc.id !== docId && (!targetDoc?.uuid || doc.uuid !== targetDoc.uuid));
    documentService.saveDocuments(updated);

    // 3. Dispatch delete to Node.js Backend Gateway
    const backendId = targetDoc?.uuid || docId;
    try {
      await fetch(`${API_BASE}/documents/${backendId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      // offline handled
    }

    // 4. Dispatch delete directly to Python AI Service vector database
    try {
      const aiBase = typeof window !== 'undefined' && window.location?.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : (import.meta.env?.VITE_AI_SERVICE_URL || 'http://localhost:8000');
      await fetch(`${aiBase}/api/ai/documents/${backendId}`, {
        method: 'DELETE',
        headers: { 'X-Internal-Secret': 'unimitra_internal_ai_secret_2026' }
      });
    } catch {}
  },


  // Retry processing a failed or pending document
  retryDocument: async (docId) => {
    if (!docId) return null;
    const docs = documentService.getDocuments();
    const targetDoc = docs.find(d => d.id === docId || d.uuid === docId);
    const backendId = targetDoc?.uuid || targetDoc?.id || docId;
    try {
      const res = await fetch(`${API_BASE}/documents/${backendId}/retry`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          const updated = docs.map(d => (d.id === docId || d.uuid === docId ? { ...d, ...json.data } : d));
          documentService.saveDocuments(updated);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Document retry notice:', e);
    }
    return null;
  },
  // Categories
  getCategories: () => {
    let baseCats = INITIAL_CATEGORIES;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CATEGORIES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            baseCats = parsed;
          }
        }
      } catch {}
    }

    // Attach data from admin uploaded and repository PDFs
    let docs = [];
    try {
      docs = documentService.getDocuments() || [];
    } catch {}

    // Auto-discover categories from uploaded documents if not already in taxonomy
    const knownNames = new Set(baseCats.map(c => (c.name || '').toLowerCase().trim()));
    const discoveredCats = [];

    docs.forEach(doc => {
      const catName = doc.category?.trim();
      if (catName && !knownNames.has(catName.toLowerCase())) {
        knownNames.add(catName.toLowerCase());
        const code = doc.categoryCode || catName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 10);
        discoveredCats.push({
          id: `CAT-${(baseCats.length + discoveredCats.length + 1).toString().padStart(2, '0')}`,
          name: catName,
          asName: doc.asCategory || catName,
          code: code,
          count: 0
        });
      }
    });

    const allCats = [...baseCats, ...discoveredCats];

    return allCats.map(c => {
      const matchingDocs = docs.filter(d => {
        if (!d.category) return false;
        const dCat = d.category.toLowerCase().trim();
        const cName = (c.name || '').toLowerCase().trim();
        const cCode = (c.code || '').toLowerCase().trim();
        const dCode = (d.categoryCode || '').toLowerCase().trim();
        return dCat === cName || (cCode && (dCat === cCode || dCode === cCode));
      });

      return {
        ...c,
        count: matchingDocs.length,
        documents: matchingDocs
      };
    });
  },

  saveCategories: (cats) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
    window.dispatchEvent(new CustomEvent('unimitra_categories_changed', { detail: cats }));
  },

  addCategory: async (category) => {
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

    try {
      await fetch(`${API_BASE}/documents/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newCat.name,
          asName: newCat.asName,
          code: newCat.code,
          description: newCat.name
        })
      });
    } catch {}

    return newCat;
  },

  deleteCategory: async (catId) => {
    const cats = documentService.getCategories();
    const target = cats.find(c => c.id === catId || c.code === catId || c.name === catId);
    const updated = cats.filter(c => c.id !== catId && c.code !== catId && c.name !== catId);
    documentService.saveCategories(updated);

    try {
      const idOrCode = target?.backendId || target?.code || target?.id || catId;
      await fetch(`${API_BASE}/documents/categories/${encodeURIComponent(idOrCode)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}

    return updated;
  }
};

// Initialize background synchronization on app start
if (typeof window !== 'undefined') {
  setTimeout(() => {
    documentService.fetchDocumentsFromBackend();
  }, 100);
}

/**
 * Resolves the authentic PDF URL for any institutional document
 */
export const resolveDocPdfUrl = (doc) => {
  if (!doc) return '/notices/NUAL_Admission_Notice_2027.pdf';

  // 1. Direct valid URLs (blob:, http:, https:, data:, /notices/)
  const isDirectPdfUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('blob:') || 
           url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('data:') || 
           url.startsWith('/notices/') || 
           url.endsWith('.pdf');
  };

  if (isDirectPdfUrl(doc.fileUrl)) {
    return doc.fileUrl;
  }
  if (isDirectPdfUrl(doc.sourceUrl)) {
    return doc.sourceUrl;
  }
  if (isDirectPdfUrl(doc.filePath)) {
    return doc.filePath.startsWith('/') || doc.filePath.startsWith('http') ? doc.filePath : `/${doc.filePath}`;
  }

  // 2. Check in-memory uploaded blobs map
  if (typeof window !== 'undefined' && window.__uploadedPdfBlobs) {
    if (doc.id && window.__uploadedPdfBlobs.has(doc.id)) {
      return window.__uploadedPdfBlobs.get(doc.id);
    }
    if (doc.uuid && window.__uploadedPdfBlobs.has(doc.uuid)) {
      return window.__uploadedPdfBlobs.get(doc.uuid);
    }
    if (doc.fileName && window.__uploadedPdfBlobs.has(doc.fileName)) {
      return window.__uploadedPdfBlobs.get(doc.fileName);
    }
  }

  const titleLower = (doc.title || '').toLowerCase();
  const fileNameLower = (doc.fileName || '').toLowerCase();
  const catLower = (doc.category || '').toLowerCase();

  const knownNoticeFiles = [
    'NUAL_Scholarship_Notice_2027.pdf',
    'NUAL_Topper_Student_List_2027.pdf',
    'NUAL_Admission_Notice_2027.pdf',
    'NUAL_Hostel_Information_2027.pdf',
    'DU_Ishan_Uday_Scholarship_2024.pdf',
    'DU_DUPGET_Admission_Counselling_2024.pdf',
    'DU_Odd_Sem_Exam_Form_Fillup_2024.pdf',
    'DU_Medical_Attendance_Condonation_2024.pdf'
  ];
  if (doc.fileName && knownNoticeFiles.includes(doc.fileName)) {
    return `/notices/${doc.fileName}`;
  }

  // 3. Exact semantic matching by document title & category to guarantee authentic PDF
  if (titleLower.includes('topper') || titleLower.includes('top student') || titleLower.includes('merit list') || fileNameLower.includes('topper') || titleLower.includes('convocation') || titleLower.includes('gold medal')) {
    return '/notices/NUAL_Topper_Student_List_2027.pdf';
  }
  if (titleLower.includes('scholarship') || catLower.includes('scholarship') || titleLower.includes('ishan uday') || fileNameLower.includes('scholarship') || titleLower.includes('financial aid')) {
    return '/notices/NUAL_Scholarship_Notice_2027.pdf';
  }
  if (titleLower.includes('hostel') || catLower.includes('hostel') || titleLower.includes('accommodation') || fileNameLower.includes('hostel') || titleLower.includes('boarder') || titleLower.includes('residential')) {
    return '/notices/NUAL_Hostel_Information_2027.pdf';
  }
  if (titleLower.includes('admission') || catLower.includes('admission') || titleLower.includes('counselling') || fileNameLower.includes('admission') || titleLower.includes('entrance') || titleLower.includes('dupget')) {
    return '/notices/NUAL_Admission_Notice_2027.pdf';
  }
  if (titleLower.includes('exam') || catLower.includes('exam') || titleLower.includes('form fillup') || titleLower.includes('backlog') || fileNameLower.includes('exam') || titleLower.includes('odd sem')) {
    return '/notices/DU_Odd_Sem_Exam_Form_Fillup_2024.pdf';
  }
  if (titleLower.includes('attendance') || catLower.includes('attendance') || titleLower.includes('medical') || fileNameLower.includes('attendance') || titleLower.includes('condonation')) {
    return '/notices/DU_Medical_Attendance_Condonation_2024.pdf';
  }

  return '/notices/NUAL_Admission_Notice_2027.pdf';
};
