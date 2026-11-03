// pdfStorage.js - Persistent client-side storage for uploaded PDFs via IndexedDB
const DB_NAME = 'unimitra_pdf_store';
const STORE_NAME = 'documents';

function openPdfDb() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export const pdfStorage = {
  async savePdf(key, fileOrBlob) {
    if (!key || !fileOrBlob) return;
    try {
      const db = await openPdfDb();
      if (!db) return;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(fileOrBlob, key);
      await new Promise((res) => {
        tx.oncomplete = res;
        tx.onerror = res;
      });
    } catch (err) {
      console.warn('pdfStorage save notice:', err);
    }
  },

  async getPdf(key) {
    if (!key) return null;
    try {
      const db = await openPdfDb();
      if (!db) return null;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      return await new Promise((res) => {
        req.onsuccess = () => res(req.result || null);
        req.onerror = () => res(null);
      });
    } catch {
      return null;
    }
  }
};

