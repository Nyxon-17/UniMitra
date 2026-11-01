import React, { useId } from 'react';

/**
 * Dedicated UniMitra AI Assistant High-Definition Logo
 * 
 * - Standalone acoustic vector emblem (circle erased)
 * - Proportional condenser studio microphone with shockmount cradle
 * - Symmetrical dynamic precision equalizer audio wavebars
 * - In Dark Mode: Luminous pure WHITE (#FFFFFF) with radiant bloom
 * - In Light Mode: Deep, bold obsidian BLACK (#09090B) to sharply highlight
 * - Smooth breathing pulse & living acoustic wave idle animations
 */
export const VoiceAssistantLogo = ({
  className = "w-8 h-8",
  size,
  isSpeaking = false,
  isListening = false,
  animated = true,
  title = "UniMitra AI Assistant",
  ...props
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const glowId = `va-glow-${uniqueId}`;

  const styleObj = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible transition-colors duration-300 ${className}`}
      style={styleObj}
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <defs>
        {/* Soft Ambient Glow Filter for Dark Mode Highlight */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={isListening ? "3.2" : "1.6"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic Theme Colors & Micro-Animations */}
        <style>{`
          /* Dynamic Theme: Black in Light Mode, White in Dark Mode */
          .va-hd-fill-${uniqueId} {
            fill: #09090B;
            transition: fill 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .va-hd-stroke-${uniqueId} {
            stroke: #09090B;
            transition: stroke 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Dark Mode Overrides */
          :root.dark .va-hd-fill-${uniqueId},
          .dark .va-hd-fill-${uniqueId},
          html.dark .va-hd-fill-${uniqueId} {
            fill: #FFFFFF !important;
          }
          :root.dark .va-hd-stroke-${uniqueId},
          .dark .va-hd-stroke-${uniqueId},
          html.dark .va-hd-stroke-${uniqueId} {
            stroke: #FFFFFF !important;
          }

          /* Subtle Breathing Scale Animation */
          @keyframes va-hd-breathe-${uniqueId} {
            0%, 100% {
              transform: scale(1) translateY(0);
              opacity: 0.95;
            }
            50% {
              transform: scale(1.06) translateY(-1px);
              opacity: 1;
            }
          }

          /* Subtle Idle Acoustic Waves */
          @keyframes va-hd-idle-1-${uniqueId} {
            0%, 100% { transform: scaleY(0.72); }
            50% { transform: scaleY(1.15); }
          }
          @keyframes va-hd-idle-2-${uniqueId} {
            0%, 100% { transform: scaleY(1.18); }
            50% { transform: scaleY(0.68); }
          }
          @keyframes va-hd-idle-3-${uniqueId} {
            0%, 100% { transform: scaleY(0.75); }
            50% { transform: scaleY(1.22); }
          }
          @keyframes va-hd-idle-4-${uniqueId} {
            0%, 100% { transform: scaleY(1.12); }
            50% { transform: scaleY(0.78); }
          }

          /* Energetic Active Speaking Waves */
          @keyframes va-hd-active-1-${uniqueId} {
            0%, 100% { transform: scaleY(0.35); }
            50% { transform: scaleY(1.42); }
          }
          @keyframes va-hd-active-2-${uniqueId} {
            0%, 100% { transform: scaleY(1.38); }
            50% { transform: scaleY(0.32); }
          }
          @keyframes va-hd-active-3-${uniqueId} {
            0%, 100% { transform: scaleY(0.45); }
            50% { transform: scaleY(1.5); }
          }
          @keyframes va-hd-active-4-${uniqueId} {
            0%, 100% { transform: scaleY(1.25); }
            50% { transform: scaleY(0.4); }
          }

          .va-hd-group-${uniqueId} {
            transform-origin: 50px 40px;
            ${animated ? `animation: va-hd-breathe-${uniqueId} 3.2s ease-in-out infinite;` : ''}
          }
          .va-hd-bar-${uniqueId} {
            transform-box: fill-box;
            transform-origin: center;
          }
          .va-hd-bar-1-${uniqueId} {
            animation: ${isSpeaking ? `va-hd-active-1-${uniqueId} 0.65s ease-in-out infinite alternate` : animated ? `va-hd-idle-1-${uniqueId} 2.2s ease-in-out infinite alternate` : 'none'};
          }
          .va-hd-bar-2-${uniqueId} {
            animation: ${isSpeaking ? `va-hd-active-2-${uniqueId} 0.52s ease-in-out infinite alternate` : animated ? `va-hd-idle-2-${uniqueId} 1.8s ease-in-out infinite alternate` : 'none'};
          }
          .va-hd-bar-3-${uniqueId} {
            animation: ${isSpeaking ? `va-hd-active-3-${uniqueId} 0.72s ease-in-out infinite alternate` : animated ? `va-hd-idle-3-${uniqueId} 2.5s ease-in-out infinite alternate` : 'none'};
          }
          .va-hd-bar-4-${uniqueId} {
            animation: ${isSpeaking ? `va-hd-active-4-${uniqueId} 0.58s ease-in-out infinite alternate` : animated ? `va-hd-idle-4-${uniqueId} 2s ease-in-out infinite alternate` : 'none'};
          }
        `}</style>
      </defs>

      <g className={`va-hd-group-${uniqueId}`}>
        {/* 1. SYMMETRICAL STUDIO EQUALIZER SOUNDWAVE BARS */}
        {/* Left Equalizer Bars */}
        <g>
          {/* Bar L4 (Outermost) */}
          <rect
            x="2"
            y="30"
            width="3.5"
            height="18"
            rx="1.75"
            opacity="0.55"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-4-${uniqueId}`}
          />
          {/* Bar L3 */}
          <rect
            x="10.5"
            y="23"
            width="3.5"
            height="30"
            rx="1.75"
            opacity="0.75"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-3-${uniqueId}`}
          />
          {/* Bar L2 (Tall Hero Bar) */}
          <rect
            x="19"
            y="16"
            width="3.5"
            height="40"
            rx="1.75"
            opacity="0.9"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-2-${uniqueId}`}
          />
          {/* Bar L1 (Innermost) */}
          <rect
            x="27.5"
            y="24"
            width="3.5"
            height="27"
            rx="1.75"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-1-${uniqueId}`}
          />
        </g>

        {/* Right Equalizer Bars (Perfect Mirror) */}
        <g>
          {/* Bar R1 (Innermost) */}
          <rect
            x="69"
            y="24"
            width="3.5"
            height="27"
            rx="1.75"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-1-${uniqueId}`}
          />
          {/* Bar R2 (Tall Hero Bar) */}
          <rect
            x="77.5"
            y="16"
            width="3.5"
            height="40"
            rx="1.75"
            opacity="0.9"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-2-${uniqueId}`}
          />
          {/* Bar R3 */}
          <rect
            x="86"
            y="23"
            width="3.5"
            height="30"
            rx="1.75"
            opacity="0.75"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-3-${uniqueId}`}
          />
          {/* Bar R4 (Outermost) */}
          <rect
            x="94.5"
            y="30"
            width="3.5"
            height="18"
            rx="1.75"
            opacity="0.55"
            className={`va-hd-fill-${uniqueId} va-hd-bar-${uniqueId} va-hd-bar-4-${uniqueId}`}
          />
        </g>

        {/* 2. CENTRAL HIGH-DEFINITION VOCAL CONDENSER MICROPHONE */}
        <g filter={`url(#${glowId})`}>
          {/* Main Capsule */}
          <rect
            x="42"
            y="12"
            width="16"
            height="29"
            rx="8"
            className={`va-hd-fill-${uniqueId}`}
          />

          {/* Diaphragm Acoustic Grill Slits */}
          <path
            d="M 45.5 22 L 54.5 22"
            stroke={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#0B1518' : '#FFFFFF'}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 47 26.5 L 53 26.5"
            stroke={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#0B1518' : '#FFFFFF'}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Shockmount Cradle Arc */}
          <path
            d="M 34.5 31 C 34.5 49, 65.5 49, 65.5 31"
            className={`va-hd-stroke-${uniqueId}`}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Vertical Stem */}
          <path
            d="M 50 49 L 50 64"
            className={`va-hd-stroke-${uniqueId}`}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Weighted Acoustic Base Plate */}
          <path
            d="M 38 64 L 62 64"
            className={`va-hd-stroke-${uniqueId}`}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};

export default VoiceAssistantLogo;
