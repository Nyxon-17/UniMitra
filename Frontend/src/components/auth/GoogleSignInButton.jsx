import { useState, useEffect, useRef } from 'react';

/**
 * Google Sign-In Button component powered by Google Identity Services (GSI)
 * Uses VITE_GOOGLE_CLIENT_ID configured in Frontend/.env
 */
export const GoogleSignInButton = ({ 
  mode = 'login', 
  role = 'student', 
  onSuccess, 
  onError, 
  disabled = false 
}) => {
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configMissing, setConfigMissing] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // 1. Check & load Google Identity Services SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    // Script polling if not yet loaded
    const checkGsi = setInterval(() => {
      if (window.google?.accounts?.id) {
        setScriptLoaded(true);
        clearInterval(checkGsi);
      }
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(checkGsi);
    }, 5000);

    return () => {
      clearInterval(checkGsi);
      clearTimeout(timeout);
    };
  }, []);

  // 2. Initialize Google One Tap / Button when script & clientId are available
  useEffect(() => {
    if (!clientId) {
      setConfigMissing(true);
      return;
    }

    setConfigMissing(false);

    if (!scriptLoaded || !containerRef.current || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            handleGoogleCredential(response.credential);
          } else {
            if (onError) onError('Google did not return an identity token.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google Identity Services button
      containerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'register' ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      });
    } catch (err) {
      console.warn('Google Identity initialization notice:', err);
    }
  }, [scriptLoaded, clientId, mode]);

  const handleGoogleCredential = async (credential) => {
    try {
      setLoading(true);
      if (onSuccess) {
        await onSuccess(credential);
      }
    } catch (err) {
      if (onError) onError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Custom trigger for button click
  const handleCustomButtonClick = () => {
    if (disabled || loading) return;

    if (!clientId) {
      // In development mode, provide a friendly dev simulation option if Client ID is not yet provided
      if (import.meta.env.DEV) {
        const timestamp = Date.now().toString().slice(-4);
        const mockEmail = `google.scholar.${timestamp}@gmail.com`;
        const mockName = 'Google Scholar Member';
        const mockCredential = `dev_mock_google#${role}#${mockEmail}#${mockName}`;
        handleGoogleCredential(mockCredential);
        return;
      }

      if (onError) {
        onError('Google Client ID is missing. Please add VITE_GOOGLE_CLIENT_ID to your Frontend/.env file.');
      }
      return;
    }

    // Trigger Google One Tap / Prompt
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Container for rendered official Google Button when Client ID is valid */}
      {clientId && (
        <div 
          ref={containerRef} 
          className="w-full flex justify-center [&>div]:w-full min-h-[44px]"
        />
      )}

      {/* Fallback button if Client ID is not configured or in dev fallback */}
      {!clientId && (
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#0A0A0A] hover:bg-gray-50 dark:hover:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {/* Authentic Google 4-Color Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>
            {loading ? 'Authenticating with Google...' : (mode === 'register' ? 'Sign up with Google' : 'Sign in with Google')}
          </span>
        </button>
      )}

      {configMissing && (
        <p className="text-[10px] text-center text-[#000000]/60 dark:text-[#FFFFFF]/60">
          💡 Tip: Configure <code className="font-mono bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">VITE_GOOGLE_CLIENT_ID</code> in <code className="font-mono">Frontend/.env</code>
        </p>
      )}
    </div>
  );
};
