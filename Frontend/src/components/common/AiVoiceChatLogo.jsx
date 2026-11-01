import React, { useId } from 'react';

/**
 * UniMitra Gemini-Inspired AI Assistant Logo
 * 
 * Styled after Google Gemini's iconic four-pointed organic starburst / sparkle.
 * Features:
 * - Fluid four-pointed primary sparkle star with authentic concave hyperbolic curves
 * - Signature secondary companion sparkle in the top-right quadrant
 * - Multi-stop Google Gemini gradient (Royal Blue #1A73E8 -> Indigo #4F46E5 -> Purple #9333EA -> Pink #EC4899 -> Cyan #22D3EE)
 * - Dynamic light/dark theme adaptation with subtle neon glow in dark mode
 * - Hardware-accelerated animations for idle shimmer, isSpeaking, and isListening states
 */
export const AiVoiceChatLogo = ({
  className = "w-6 h-6",
  size,
  isSpeaking = false,
  isListening = false,
  animated = true,
  title = "UniMitra AI Assistant",
  ...props
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const geminiGradId = `gemini-grad-${uniqueId}`;
  const companionGradId = `companion-grad-${uniqueId}`;
  const glowFilterId = `gemini-glow-${uniqueId}`;

  const styleObj = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible transition-transform duration-300 ${className}`}
      style={styleObj}
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <defs>
        {/* Authentic Multi-tone Google Gemini Gradient */}
        <linearGradient id={geminiGradId} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="22%" stopColor="#2563EB" />
          <stop offset="48%" stopColor="#7C3AED" />
          <stop offset="74%" stopColor="#C026D3" />
          <stop offset="92%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Top-Right Companion Sparkle Gradient */}
        <linearGradient id={companionGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Ambient Glow Filter */}
        <filter id={glowFilterId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation={isListening ? "5" : "2.5"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Scoped CSS Keyframe Animations */}
        <style>{`
          @keyframes gemini-pulse-${uniqueId} {
            0%, 100% { transform: scale(1); opacity: 0.96; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes gemini-speaking-${uniqueId} {
            0%, 100% { transform: scale(0.96) rotate(-2deg); filter: brightness(1); }
            50% { transform: scale(1.08) rotate(3deg); filter: brightness(1.25); }
          }
          @keyframes gemini-listening-halo-${uniqueId} {
            0% { transform: scale(0.85); opacity: 0.8; }
            50% { transform: scale(1.22); opacity: 0.2; }
            100% { transform: scale(0.85); opacity: 0.8; }
          }
          @keyframes gemini-twinkle-${uniqueId} {
            0%, 100% { opacity: 0.7; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1.15); }
          }

          .gemini-main-star-${uniqueId} {
            transform-origin: 48px 52px;
            ${isSpeaking 
              ? `animation: gemini-speaking-${uniqueId} 0.8s ease-in-out infinite alternate;` 
              : animated 
              ? `animation: gemini-pulse-${uniqueId} 3.5s ease-in-out infinite;` 
              : ''}
          }
          .gemini-companion-star-${uniqueId} {
            transform-origin: 78px 22px;
            ${animated ? `animation: gemini-twinkle-${uniqueId} 2.2s ease-in-out infinite;` : ''}
          }
          .gemini-listening-ring-${uniqueId} {
            transform-origin: 50px 50px;
            animation: gemini-listening-halo-${uniqueId} 1.6s ease-out infinite;
          }
        `}</style>
      </defs>

      {/* 1. LISTENING HALO RIPPLE */}
      {isListening && (
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#companionGradId)"
          strokeWidth="3"
          fill="none"
          className={`gemini-listening-ring-${uniqueId}`}
          filter={`url(#${glowFilterId})`}
        />
      )}

      {/* 2. ATMOSPHERIC BACKLIGHT GLOW */}
      <path
        d="M 48 8 C 48 30, 68 50, 90 50 C 68 50, 48 70, 48 92 C 48 70, 28 50, 6 50 C 28 50, 48 30, 48 8 Z"
        fill={`url(#${geminiGradId})`}
        opacity="0.35"
        filter={`url(#${glowFilterId})`}
      />

      {/* 3. PRIMARY GOOGLE GEMINI 4-POINT STARBURST */}
      <g className={`gemini-main-star-${uniqueId}`}>
        <path
          d="M 48 8 C 48 30, 68 50, 90 50 C 68 50, 48 70, 48 92 C 48 70, 28 50, 6 50 C 28 50, 48 30, 48 8 Z"
          fill={`url(#${geminiGradId})`}
        />

        {/* Inner Luminous Core Flare */}
        <circle
          cx="48"
          cy="50"
          r="9"
          fill="#FFFFFF"
          opacity="0.82"
          className="dark:opacity-95"
          filter={`url(#${glowFilterId})`}
        />
        <circle
          cx="48"
          cy="50"
          r="4.5"
          fill="#FFFFFF"
        />
      </g>

      {/* 4. COMPANION TOP-RIGHT TWINKLE STAR */}
      <g className={`gemini-companion-star-${uniqueId}`}>
        <path
          d="M 78 12 C 78 17.5, 82.5 22, 88 22 C 82.5 22, 78 26.5, 78 32 C 78 26.5, 73.5 22, 68 22 C 73.5 22, 78 17.5, 78 12 Z"
          fill={`url(#${companionGradId})`}
        />
        <circle
          cx="78"
          cy="22"
          r="2"
          fill="#FFFFFF"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};

export default AiVoiceChatLogo;
