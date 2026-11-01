import React, { useId } from 'react';

/**
 * UniMitra AI Voice Assistant Logo
 * 
 * Clean, minimal, modern AI voice assistant icon inspired by ChatGPT's 
 * recognizable visual identity with an original UniMitra design.
 * 
 * Specifications:
 * - Simple white microphone symbol at the center (#FFFFFF)
 * - Circular gradient ring (Purple #8B5CF6 to Cyan #22D3EE)
 * - Symmetrical audio waveform bars on both sides
 * - Transparent background
 * - Animations:
 *   - Slowly rotates and pulses outer ring
 *   - Animates waveform bars when AI is speaking (isSpeaking)
 *   - Soft radiant glow when listening (isListening)
 * - Lightweight, responsive vector SVG
 */
export const AiVoiceChatLogo = ({
  className = "w-6 h-6",
  size,
  isSpeaking = false,
  isListening = false,
  animated = true,
  title = "UniMitra AI Voice Assistant",
  ...props
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const ringGradId = `ring-grad-${uniqueId}`;
  const barGradLeftId = `bar-grad-left-${uniqueId}`;
  const barGradRightId = `bar-grad-right-${uniqueId}`;
  const glowFilterId = `subtle-glow-${uniqueId}`;

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
        {/* Main Purple to Cyan Gradient */}
        <linearGradient id={ringGradId} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Waveform Left Gradient */}
        <linearGradient id={barGradLeftId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        {/* Waveform Right Gradient */}
        <linearGradient id={barGradRightId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={isListening ? "4" : "2"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Smooth Hardware-Accelerated Scoped Animations */}
        <style>{`
          @keyframes unimitra-ring-rotate-${uniqueId} {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes unimitra-ring-pulse-${uniqueId} {
            0%, 100% { transform: scale(1); opacity: 0.92; }
            50% { transform: scale(1.03); opacity: 1; }
          }
          @keyframes unimitra-glow-listening-${uniqueId} {
            0%, 100% { opacity: 0.45; transform: scale(1); }
            50% { opacity: 0.95; transform: scale(1.08); }
          }
          @keyframes unimitra-wave-talk-1-${uniqueId} {
            0%, 100% { transform: scaleY(0.4); }
            50% { transform: scaleY(1.35); }
          }
          @keyframes unimitra-wave-talk-2-${uniqueId} {
            0%, 100% { transform: scaleY(1.3); }
            50% { transform: scaleY(0.35); }
          }
          @keyframes unimitra-wave-talk-3-${uniqueId} {
            0%, 100% { transform: scaleY(0.6); }
            50% { transform: scaleY(1.45); }
          }

          .unimitra-ring-group-${uniqueId} {
            transform-origin: 50px 50px;
            ${animated ? `animation: unimitra-ring-pulse-${uniqueId} 4s ease-in-out infinite;` : ''}
          }
          .unimitra-outer-circle-${uniqueId} {
            transform-origin: 50px 50px;
            ${animated ? `animation: unimitra-ring-rotate-${uniqueId} 16s linear infinite;` : ''}
          }
          .unimitra-listening-halo-${uniqueId} {
            transform-origin: 50px 50px;
            animation: unimitra-glow-listening-${uniqueId} 1.8s ease-in-out infinite;
          }
          .unimitra-wave-bar-${uniqueId} {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 0.25s ease;
          }
          .unimitra-wave-speaking-1-${uniqueId} {
            animation: unimitra-wave-talk-1-${uniqueId} 0.65s ease-in-out infinite alternate;
          }
          .unimitra-wave-speaking-2-${uniqueId} {
            animation: unimitra-wave-talk-2-${uniqueId} 0.5s ease-in-out infinite alternate;
          }
          .unimitra-wave-speaking-3-${uniqueId} {
            animation: unimitra-wave-talk-3-${uniqueId} 0.75s ease-in-out infinite alternate;
          }
        `}</style>
      </defs>

      {/* Transparent Background - No opaque backdrop */}

      {/* 1. SOFT GLOW WHEN LISTENING */}
      {isListening && (
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#22D3EE)"
          strokeWidth="3.5"
          fill="none"
          opacity="0.8"
          className={`unimitra-listening-halo-${uniqueId}`}
          filter={`url(#${glowFilterId})`}
        />
      )}

      {/* 2. CIRCULAR GRADIENT RING */}
      <g className={`unimitra-ring-group-${uniqueId}`}>
        {/* Soft Ambient Shadow Aura behind the ring */}
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke={`url(#${ringGradId})`}
          strokeWidth="2.5"
          strokeOpacity="0.4"
          filter={`url(#${glowFilterId})`}
        />

        {/* Primary Gradient Ring */}
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke={`url(#${ringGradId})`}
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeDasharray="210 60"
          className={`unimitra-outer-circle-${uniqueId}`}
        />

        {/* Subtle Secondary Inner Accent Dots on Ring Orbit */}
        <circle cx="50" cy="7" r="1.75" fill="#22D3EE" opacity="0.9" />
        <circle cx="50" cy="93" r="1.75" fill="#8B5CF6" opacity="0.9" />
      </g>

      {/* 3. SYMMETRICAL AUDIO WAVEFORM BARS */}
      {/* Left Audio Waveform Bars (Cyan to Purple) */}
      <g>
        {/* Bar L3 (Outer Left) */}
        <rect
          x="19"
          y="44"
          width="2.75"
          height="12"
          rx="1.375"
          fill="#8B5CF6"
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-3-${uniqueId}` : ''}`}
        />
        {/* Bar L2 (Middle Left) */}
        <rect
          x="25.5"
          y="38"
          width="2.75"
          height="24"
          rx="1.375"
          fill={`url(#${barGradLeftId})`}
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-2-${uniqueId}` : ''}`}
        />
        {/* Bar L1 (Inner Left) */}
        <rect
          x="32"
          y="42"
          width="2.75"
          height="16"
          rx="1.375"
          fill="#22D3EE"
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-1-${uniqueId}` : ''}`}
        />
      </g>

      {/* Right Audio Waveform Bars (Purple to Cyan - Perfectly Symmetrical) */}
      <g>
        {/* Bar R1 (Inner Right) */}
        <rect
          x="65.25"
          y="42"
          width="2.75"
          height="16"
          rx="1.375"
          fill="#22D3EE"
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-1-${uniqueId}` : ''}`}
        />
        {/* Bar R2 (Middle Right) */}
        <rect
          x="71.75"
          y="38"
          width="2.75"
          height="24"
          rx="1.375"
          fill={`url(#${barGradRightId})`}
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-2-${uniqueId}` : ''}`}
        />
        {/* Bar R3 (Outer Right) */}
        <rect
          x="78.25"
          y="44"
          width="2.75"
          height="12"
          rx="1.375"
          fill="#8B5CF6"
          className={`unimitra-wave-bar-${uniqueId} ${isSpeaking ? `unimitra-wave-speaking-3-${uniqueId}` : ''}`}
        />
      </g>

      {/* 4. CENTER MINIMAL WHITE MICROPHONE SYMBOL (#FFFFFF) */}
      <g>
        {/* Microphone Capsule */}
        <rect
          x="44.25"
          y="28"
          width="11.5"
          height="22"
          rx="5.75"
          fill="#FFFFFF"
        />

        {/* Minimal Microphone Sound Grille Line */}
        <path
          d="M 46 36.5 L 54 36.5"
          stroke="#8B5CF6"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Microphone Cradle (Arc) */}
        <path
          d="M 38.5 44 C 38.5 54.5, 61.5 54.5, 61.5 44"
          stroke="#FFFFFF"
          strokeWidth="2.75"
          strokeLinecap="round"
          fill="none"
        />

        {/* Microphone Vertical Stem */}
        <path
          d="M 50 54 L 50 64"
          stroke="#FFFFFF"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Microphone Base */}
        <path
          d="M 42 64 L 58 64"
          stroke="#FFFFFF"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default AiVoiceChatLogo;

