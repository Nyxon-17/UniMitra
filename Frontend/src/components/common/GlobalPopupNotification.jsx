import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from './Icons';

/**
 * GlobalPopupNotification
 * Replaces native browser alert(), window.confirm(), and window.prompt()
 * with responsive, accessible, neomorphic UI popup modals and floating toast alerts.
 */
export const GlobalPopupNotification = () => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [promptDialog, setPromptDialog] = useState(null);
  const [promptValue, setPromptValue] = useState('');

  useEffect(() => {
    // 1. Toast Handler
    const handleToast = (e) => {
      const { message, type = 'success', duration = 3800 } = e.detail || {};
      if (!message) return;
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    // 2. Confirm Dialog Handler
    const handleConfirm = (e) => {
      const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, confirmColor } = e.detail || {};
      setConfirmDialog({
        title: title || 'Confirmation Required',
        message: message || 'Are you sure you want to proceed?',
        confirmText,
        cancelText,
        confirmColor: confirmColor || 'bg-[#FF933E] hover:bg-[#E87A24] text-white',
        onConfirm: () => {
          if (onConfirm) onConfirm();
          setConfirmDialog(null);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setConfirmDialog(null);
        }
      });
    };

    // 3. Prompt Dialog Handler
    const handlePrompt = (e) => {
      const { title, message, defaultValue = '', confirmText = 'Submit', cancelText = 'Cancel', onConfirm, onCancel } = e.detail || {};
      setPromptValue(defaultValue);
      setPromptDialog({
        title: title || 'Input Required',
        message: message || 'Please enter details below:',
        confirmText,
        cancelText,
        onConfirm: (val) => {
          if (onConfirm) onConfirm(val);
          setPromptDialog(null);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setPromptDialog(null);
        }
      });
    };

    window.addEventListener('unimitra_toast', handleToast);
    window.addEventListener('unimitra_confirm', handleConfirm);
    window.addEventListener('unimitra_prompt', handlePrompt);

    // Global helper bindings on window
    window.showUniMitraToast = (message, type = 'success', duration = 3800) => {
      window.dispatchEvent(new CustomEvent('unimitra_toast', { detail: { message, type, duration } }));
    };

    window.showUniMitraConfirm = (options) => {
      window.dispatchEvent(new CustomEvent('unimitra_confirm', { detail: options }));
    };

    window.showUniMitraPrompt = (options) => {
      window.dispatchEvent(new CustomEvent('unimitra_prompt', { detail: options }));
    };

    // Seamlessly redirect native window.alert to popup toast
    const originalAlert = window.alert;
    window.alert = (msg) => {
      window.showUniMitraToast(String(msg || ''), 'info', 4000);
    };

    return () => {
      window.removeEventListener('unimitra_toast', handleToast);
      window.removeEventListener('unimitra_confirm', handleConfirm);
      window.removeEventListener('unimitra_prompt', handlePrompt);
      window.alert = originalAlert;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {/* Floating Toast Popups Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl flex items-center space-x-3 shadow-2xl border-2 transition-all duration-300 animate-fade-in ${
              toast.type === 'error'
                ? 'bg-red-50 dark:bg-[#1A0A0A] border-red-500 text-red-900 dark:text-red-200'
                : toast.type === 'info'
                ? 'bg-blue-50 dark:bg-[#0A121A] border-blue-500 text-blue-900 dark:text-blue-200'
                : 'bg-[#FFE9A9] dark:bg-[#1A1A1A] border-[#FF933E] dark:border-[#03C988] text-[#000000] dark:text-[#FFFFFF]'
            }`}
          >
            {toast.type === 'error' ? (
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <InformationCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] shrink-0" />
            )}
            <p className="text-xs font-bold flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal Popup */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2.5">
              <ExclamationCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] shrink-0" />
              <h3 className="text-base font-black text-[#123C3A] dark:text-[#DCE8E4]">
                {confirmDialog.title}
              </h3>
            </div>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15">
              <button
                type="button"
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#000000]/80 dark:text-[#FFFFFF]/80 cursor-pointer transition-all"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-xs transition-all ${confirmDialog.confirmColor}`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Prompt Modal Popup */}
      {promptDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#F7F6F0] dark:bg-[#16181A] text-[#273B45] dark:text-[#DCE8E4] border border-[#123C3A]/10 dark:border-[#55C7B2]/20 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-[#123C3A] dark:text-[#DCE8E4]">
              {promptDialog.title}
            </h3>
            <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              {promptDialog.message}
            </p>
            <textarea
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Enter details..."
              rows={3}
              className="w-full p-3 rounded-xl text-xs border border-[#123C3A]/15 dark:border-[#55C7B2]/25 bg-white dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#FF933E] text-[#000000] dark:text-[#FFFFFF]"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15">
              <button
                type="button"
                onClick={promptDialog.onCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#000000]/80 dark:text-[#FFFFFF]/80 cursor-pointer transition-all"
              >
                {promptDialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => promptDialog.onConfirm(promptValue)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] cursor-pointer shadow-xs transition-all"
              >
                {promptDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
