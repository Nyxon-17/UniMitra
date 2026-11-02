import { useState, useEffect } from 'react';
import { BellIcon, CheckCircleIcon, XMarkIcon, SparklesIcon } from './Icons';

/**
 * Global Real-Time Site Notification Toast
 * Listens for 'unimitra_site_notification' events triggered when Faculty or Admin
 * adds a document, regulation, circular, or approves an ingestion.
 */
export const GlobalNotificationToast = ({ currentLang = 'en' }) => {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleNotification = (e) => {
      if (e.detail) {
        setNotification(e.detail);
        setVisible(true);

        // Auto dismiss after 6 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 6000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('unimitra_site_notification', handleNotification);
    return () => window.removeEventListener('unimitra_site_notification', handleNotification);
  }, []);

  if (!visible || !notification) return null;

  const isAssamese = currentLang === 'as';
  const displayTitle = (isAssamese && notification.asTitle) ? notification.asTitle : notification.title;
  const displayMessage = (isAssamese && notification.asMessage) ? notification.asMessage : notification.message;

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-bounce-in shadow-2xl">
      <div className="rounded-2xl p-4 bg-[#F7F6F0] dark:bg-[#16181A] text-[#123C3A] dark:text-[#FAF8FF] border-2 border-[#D4A96A] dark:border-[#55C7B2] shadow-elevated">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4A96A]/20 dark:bg-[#55C7B2]/20 text-[#D4A96A] dark:text-[#55C7B2] flex items-center justify-center shrink-0">
            <BellIcon className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D4A96A]/20 dark:bg-[#55C7B2]/20 text-[#123C3A] dark:text-[#55C7B2]">
                {notification.author || 'University Authority'}
              </span>
              <span className="text-[10px] text-black/50 dark:text-white/50">{notification.timestamp || 'Just now'}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-black leading-snug">
              {displayTitle}
            </h4>

            <p className="text-[11px] sm:text-xs text-black/70 dark:text-white/80 leading-relaxed">
              {displayMessage}
            </p>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
            aria-label="Close notification"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

