import { useState, useEffect, useRef } from 'react';

/**
 * Google Sign-In Button Component
 * Supports both Google Identity Services (GSI) and Google OAuth2 Token Client Popup
 * Uses VITE_GOOGLE_CLIENT_ID from Frontend/.env
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
  const [buttonRendered, setButtonRendered] = useState(false);

  // Clean raw client ID of any unintentional quotes
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientId = (rawClientId || '').replace(/['"]/g, '').trim();

  // 1. Check & load Google Identity Services SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const checkGsi = setInterval(() => {
      if (window.google?.accounts?.id) {
        setScriptLoaded(true);
        clearInterval(checkGsi);
      }
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(checkGsi);
    }, 4000);

    return () => {
      clearInterval(checkGsi);
      clearTimeout(timeout);
    };
  }, []);

  // 2. Initialize Google Identity Services when script & clientId are ready
  useEffect(() => {
    if (!clientId || !scriptLoaded || !containerRef.current || !window.google?.accounts?.id) {
      return;
    }

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
        use_fedcm_for_prompt: false, // Prevents FedCM browser prompt blocking
      });

      // Clear container and render the official Google button
      containerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with', // Strictly renders "Sign in with Google"
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 360, // Exact integer pixel width required by GSI
      });

      setButtonRendered(true);
    } catch (err) {
      console.warn('Google Identity button render notice:', err);
      setButtonRendered(false);
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

  // 3. Fallback / Direct Click Trigger using OAuth2 Popup
  const handleDirectOAuthClick = () => {
    if (disabled || loading) return;

    // A. If Google OAuth2 token client is available, open account picker popup
    if (window.google?.accounts?.oauth2 && clientId) {
      try {
        setLoading(true);
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              setLoading(false);
              if (onError) onError(`Google Sign-In failed: ${tokenResponse.error}`);
              return;
            }
            if (tokenResponse?.access_token) {
              await handleGoogleCredential(tokenResponse.access_token);
            } else {
              setLoading(false);
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('OAuth2 token client init failed, trying prompt():', err);
      }
    }

    // B. If GSI id prompt is available
    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('Google id prompt error:', err);
      }
    }

    // C. Dev Mock Fallback if in development mode
    if (import.meta.env.DEV) {
      const timestamp = Date.now().toString().slice(-4);
      const mockEmail = `student.google.${timestamp}@gmail.com`;
      const mockName = 'Google Student Scholar';
      const mockCredential = `dev_mock_google#student#${mockEmail}#${mockName}`;
      handleGoogleCredential(mockCredential);
      return;
    }

    if (onError) {
      onError('Unable to open Google Sign-In. Please check your browser popup blocker.');
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Official Google GSI Rendered Button */}
      {clientId && (
        <div 
          ref={containerRef} 
          className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:!w-full min-h-[44px]"
        />
      )}

      {/* Direct Interactive Fallback Button (visible if GSI iframe hasn't rendered or is loading) */}
      {(!buttonRendered || !clientId) && (
        <button
          type="button"
          onClick={handleDirectOAuthClick}
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
            {loading ? 'Authenticating with Google...' : 'Sign in as Student with Google'}
          </span>
        </button>
      )}

      {/* Subtle indicator for Google OAuth App Name */}
      <p className="text-[10px] text-center text-[#000000]/50 dark:text-[#FFFFFF]/50">
        Google OAuth Student Access &bull; Dibrugarh & Assam Universities
      </p>
    </div>
  );
};
