import React from 'react';

/**
 * Realistic Animated College Boy Looking at University Background
 * Features:
 * - Highly detailed vector collage student with varsity jacket, backpack, and campus folder
 * - Neoclassical grand university architecture with rotunda dome, clock tower, pillars, and illuminated windows
 * - Dark theme with vibrant neon violet (#FF933E), neon cyan (#F59E0B), and emerald green accents
 * - Floating graduation cap, open academic book, gliding paper plane, twinkling constellation stars
 */
export const CollegeBoyUniversityBackground = ({ className = '', showOverlay = true }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Sky Gradients */}
          <linearGradient id="skyGradLight" x1="720" y1="0" x2="720" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#FFE9A9" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#FFE9A9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="skyGradDark" x1="720" y1="0" x2="720" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#13005A" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#00337C" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#1C82AD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#13005A" stopOpacity="0.4" />
          </linearGradient>

          {/* Dome & Wall Gradients */}
          <linearGradient id="domeGrad" x1="720" y1="110" x2="720" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF933E" />
            <stop offset="60%" stopColor="#73A5CA" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="domeGradDark" x1="720" y1="110" x2="720" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF933E" />
            <stop offset="50%" stopColor="#73A5CA" />
            <stop offset="100%" stopColor="#1C1438" />
          </linearGradient>

          <linearGradient id="beaconGlow" x1="720" y1="0" x2="720" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#FF933E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#73A5CA" stopOpacity="0" />
          </linearGradient>

          {/* Boy Varsity Jacket Gradients */}
          <linearGradient id="varsityBody" x1="440" y1="390" x2="520" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#73A5CA" />
            <stop offset="50%" stopColor="#000000" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="varsitySleeves" x1="430" y1="400" x2="530" y2="510" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#73A5CA" />
            <stop offset="70%" stopColor="#73A5CA" />
            <stop offset="100%" stopColor="#73A5CA" />
          </linearGradient>

          {/* Backpack Gradient */}
          <linearGradient id="backpackGrad" x1="450" y1="400" x2="510" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF933E" />
            <stop offset="60%" stopColor="#FF933E" />
            <stop offset="100%" stopColor="#FF933E" />
          </linearGradient>

          {/* Promenade Path */}
          <linearGradient id="promenadeGrad" x1="720" y1="360" x2="720" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#73A5CA" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#FFE9A9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE9A9" stopOpacity="0.85" />
          </linearGradient>

          <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes realisticBreath {
              0%, 100% { transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(0, -3.5px, 0) scale(1.003); }
            }
            @keyframes hairWind {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-2.5deg); }
            }
            @keyframes floatPaperPlane {
              0% { transform: translate3d(160px, 120px, 0) rotate(-10deg); }
              50% { transform: translate3d(340px, 75px, 0) rotate(3deg); }
              100% { transform: translate3d(160px, 120px, 0) rotate(-10deg); }
            }
            @keyframes floatCapBob {
              0%, 100% { transform: translateY(0px) rotate(4deg); }
              50% { transform: translate3d(0, -10px, 0) rotate(-3deg); }
            }
            @keyframes floatBookBob {
              0%, 100% { transform: translateY(0px) rotate(-2deg); }
              50% { transform: translate3d(0, -8px, 0) rotate(3deg); }
            }
            @keyframes starBlink {
              0%, 100% { opacity: 0.25; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.25); }
            }
            @keyframes neonWindowPulse {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(3, 201, 136, 0.7)); }
            }
            @keyframes beaconPulseAnim {
              0%, 100% { opacity: 0.35; }
              50% { opacity: 0.75; }
            }
            .anim-boy-realistic { animation: realisticBreath 5s ease-in-out infinite; transform-origin: 480px 580px; will-change: transform; }
            .anim-hair {
              animation: hairWind 4s ease-in-out infinite;
              transform-origin: 480px 345px;
            }
            .anim-plane-path { animation: floatPaperPlane 18s ease-in-out infinite; will-change: transform; }
            .anim-cap-float { animation: floatCapBob 7.5s ease-in-out infinite; transform-origin: center; will-change: transform; }
            .anim-book-float { animation: floatBookBob 6.5s ease-in-out infinite 1.2s; transform-origin: center; will-change: transform; }
            .anim-star-a { animation: starBlink 3.2s ease-in-out infinite; }
            .anim-star-b { animation: starBlink 4.5s ease-in-out infinite 1.5s; }
            .anim-star-c { animation: starBlink 3.8s ease-in-out infinite 0.8s; }
            .anim-neon-window { animation: neonWindowPulse 4.5s ease-in-out infinite; }
            .anim-beacon { animation: beaconPulseAnim 6s ease-in-out infinite; }
          `}
        </style>

        {/* 1. SKY CANVASES */}
        <rect width="1440" height="680" fill="url(#skyGradLight)" className="dark:hidden" />
        <rect width="1440" height="680" fill="url(#skyGradDark)" className="hidden dark:block" />

        {/* 2. STARS & CONSTELLATIONS WITH NEON HIGHLIGHTS */}
        <g id="sky-constellations">
          {/* Left Constellation */}
          <circle cx="210" cy="70" r="2.5" fill="#FF933E" className="anim-star-a dark:fill-[#03C988]" />
          <circle cx="270" cy="45" r="3" fill="#73A5CA" className="anim-star-b dark:fill-[#FF933E]" />
          <circle cx="340" cy="85" r="2.5" fill="#10B981" className="anim-star-c dark:fill-[#10E7A0]" />
          <line x1="210" y1="70" x2="270" y2="45" stroke="#FFE9A9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.45" />
          <line x1="270" y1="45" x2="340" y2="85" stroke="#FFE9A9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.45" />

          {/* Right Constellation */}
          <circle cx="1130" cy="65" r="3" fill="#FF933E" className="anim-star-b dark:fill-[#03C988]" />
          <circle cx="1200" cy="35" r="3.5" fill="#73A5CA" className="anim-star-a dark:fill-[#FF933E]" />
          <circle cx="1260" cy="75" r="2" fill="#10B981" className="anim-star-c dark:fill-[#03C988]" />
          <line x1="1130" y1="65" x2="1200" y2="35" stroke="#FFE9A9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.45" />
          <line x1="1200" y1="35" x2="1260" y2="75" stroke="#FFE9A9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.45" />

          {/* Zenith Stars */}
          <circle cx="680" cy="40" r="2.5" fill="#F59E0B" className="anim-star-a" opacity="0.8" />
          <circle cx="760" cy="55" r="3" fill="#FF933E" className="anim-star-b" opacity="0.8" />
        </g>

        {/* 3. UNIVERSITY BEACON BEAM (Ascending from Dome) */}
        <polygon points="720,10 610,240 830,240" fill="url(#beaconGlow)" className="anim-beacon" />

        {/* 4. DISTANT CAMPUS HILLS */}
        <path
          d="M0 480 C 320 420, 620 440, 940 400 C 1180 370, 1340 410, 1440 430 L1440 680 L0 680 Z"
          fill="#FFE9A9"
          fillOpacity="0.3"
          className="dark:fill-[#00337C] dark:fill-opacity-80"
        />
        <path
          d="M0 520 C 260 470, 580 500, 880 450 C 1160 410, 1310 470, 1440 480 L1440 680 L0 680 Z"
          fill="#73A5CA"
          fillOpacity="0.4"
          className="dark:fill-[#13005A] dark:fill-opacity-90"
        />

        {/* 5. MAJESTIC UNIVERSITY ARCHITECTURE */}
        <g id="university-grand-campus" className="transform translate-y-10">
          
          {/* Main Central Rotunda / Dome */}
          <path
            d="M 635 220 Q 720 115 805 220 Z"
            fill="url(#domeGrad)"
            stroke="#73A5CA"
            strokeWidth="2.5"
            className="dark:fill-[url(#domeGradDark)] dark:stroke-[#FF933E]"
          />
          {/* Dome Ribs */}
          <path d="M 665 218 Q 720 120 720 220" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />
          <path d="M 775 218 Q 720 120 720 220" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

          {/* Dome Lantern Cupola & Spire */}
          <rect x="712" y="85" width="16" height="36" rx="3" fill="#FF933E" className="dark:fill-[#FF933E]" />
          <polygon points="720,55 714,85 726,85" fill="#10B981" className="dark:fill-[#03C988]" />
          <circle cx="720" cy="50" r="4.5" fill="#FFFFFF" className="dark:fill-[#03C988]" />

          {/* Dome Eye Arched Window */}
          <circle cx="720" cy="180" r="22" fill="#000000" stroke="#73A5CA" strokeWidth="2" className="dark:stroke-[#FF933E]" />
          <circle cx="720" cy="180" r="16" fill="#FFE9A9" opacity="0.85" className="anim-neon-window dark:fill-[#03C988] dark:opacity-90" />

          {/* Neoclassical Colonnade / Drum */}
          <rect x="630" y="218" width="180" height="74" fill="#000000" rx="4" stroke="#73A5CA" strokeWidth="2" className="dark:fill-[#00337C] dark:stroke-[#FF933E]" />
          
          {/* Columns */}
          {[-64, -40, -14, 14, 40, 64].map((offset, i) => (
            <g key={i}>
              <rect x={720 + offset - 4} y="222" width="8" height="66" rx="2" fill="#FFFFFF" opacity="0.95" className="dark:fill-[#FFE9A9]" />
              <rect x={720 + offset - 6} y="220" width="12" height="4" rx="1" fill="#FFE9A9" className="dark:fill-[#FF933E]" />
              <rect x={720 + offset - 6} y="284" width="12" height="4" rx="1" fill="#FFE9A9" className="dark:fill-[#FF933E]" />
            </g>
          ))}

          {/* Grand Pediment */}
          <polygon
            points="615,222 720,165 825,222"
            fill="#73A5CA"
            stroke="#73A5CA"
            strokeWidth="2.5"
            className="dark:fill-[#2A0F55] dark:stroke-[#FF933E]"
          />
          {/* Pediment University Seal */}
          <circle cx="720" cy="202" r="11" fill="#FF933E" stroke="#FFFFFF" strokeWidth="1.5" className="dark:fill-[#FF933E] dark:stroke-[#03C988]" />
          <polygon points="720,196 724,204 716,204" fill="#10B981" className="dark:fill-[#03C988]" />

          {/* Left Wing - Library & Research Complex */}
          <rect x="410" y="250" width="230" height="120" fill="#73A5CA" rx="5" stroke="#73A5CA" strokeWidth="1.8" className="dark:fill-[#13005A] dark:stroke-[#1C82AD]" />
          <polygon points="405,250 525,220 645,250" fill="#73A5CA" stroke="#73A5CA" strokeWidth="1.8" className="dark:fill-[#13005A] dark:stroke-[#FF933E]" />
          
          {/* Left Wing Windows (Study Lamps) */}
          {[0, 1, 2, 3].map((row) => (
            <g key={`lw-${row}`}>
              {[0, 1, 2, 3, 4].map((col) => (
                <rect
                  key={`lw-${row}-${col}`}
                  x={430 + col * 40}
                  y={265 + row * 24}
                  width="20"
                  height="16"
                  rx="4"
                  fill={(col + row) % 2 === 0 ? "#10B981" : "#FFFFFF"}
                  opacity="0.9"
                  className="anim-neon-window dark:fill-[#03C988]"
                />
              ))}
            </g>
          ))}

          {/* Left Clock Tower */}
          <rect x="355" y="150" width="60" height="220" fill="#00337C" rx="4" stroke="#73A5CA" strokeWidth="2" className="dark:fill-[#00337C] dark:stroke-[#FF933E]" />
          <polygon points="350,150 385,95 420,150" fill="#FF933E" stroke="#73A5CA" strokeWidth="2" className="dark:fill-[#FF933E]" />
          <line x1="385" y1="95" x2="385" y2="70" stroke="#10B981" strokeWidth="2.5" className="dark:stroke-[#03C988]" />
          <circle cx="385" cy="68" r="3.5" fill="#FFFFFF" className="dark:fill-[#03C988]" />
          {/* Clock Face */}
          <circle cx="385" cy="180" r="16" fill="#FFFFFF" stroke="#73A5CA" strokeWidth="3" className="dark:fill-[#13005A] dark:stroke-[#03C988]" />
          <line x1="385" y1="180" x2="385" y2="170" stroke="#000000" strokeWidth="2" strokeLinecap="round" className="dark:stroke-[#03C988]" />
          <line x1="385" y1="180" x2="393" y2="180" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#FF933E]" />
          <circle cx="385" cy="180" r="2.5" fill="#FF933E" className="dark:fill-[#03C988]" />

          {/* Right Wing - Academic Departments */}
          <rect x="800" y="250" width="230" height="120" fill="#73A5CA" rx="5" stroke="#73A5CA" strokeWidth="1.8" className="dark:fill-[#13005A] dark:stroke-[#1C82AD]" />
          <polygon points="795,250 915,220 1035,250" fill="#73A5CA" stroke="#73A5CA" strokeWidth="1.8" className="dark:fill-[#13005A] dark:stroke-[#FF933E]" />

          {/* Right Wing Windows */}
          {[0, 1, 2, 3].map((row) => (
            <g key={`rw-${row}`}>
              {[0, 1, 2, 3, 4].map((col) => (
                <rect
                  key={`rw-${row}-${col}`}
                  x={825 + col * 40}
                  y={265 + row * 24}
                  width="20"
                  height="16"
                  rx="4"
                  fill={(col + row) % 3 === 0 ? "#10B981" : "#FFFFFF"}
                  opacity="0.9"
                  className="anim-neon-window dark:fill-[#03C988]"
                />
              ))}
            </g>
          ))}

          {/* Right Observatory Dome Tower */}
          <rect x="1025" y="180" width="65" height="190" fill="#00337C" rx="4" stroke="#73A5CA" strokeWidth="2" className="dark:fill-[#00337C] dark:stroke-[#FF933E]" />
          <path d="M 1025 180 Q 1057 130 1090 180 Z" fill="#FF933E" stroke="#73A5CA" strokeWidth="2" className="dark:fill-[#FF933E]" />
          <line x1="1057" y1="130" x2="1057" y2="105" stroke="#10B981" strokeWidth="2.5" className="dark:stroke-[#03C988]" />
          <circle cx="1057" cy="103" r="3.5" fill="#FFFFFF" className="dark:fill-[#03C988]" />

          {/* Grand University Steps */}
          <rect x="640" y="292" width="160" height="42" fill="#000000" rx="3" className="dark:fill-[#13005A]" />
          <path d="M680 334 Q 720 298 760 334 Z" fill="#FFFFFF" opacity="0.9" className="anim-neon-window dark:fill-[#03C988]" />
          <line x1="630" y1="334" x2="810" y2="334" stroke="#73A5CA" strokeWidth="3" className="dark:stroke-[#FF933E]" />
          <line x1="620" y1="340" x2="820" y2="340" stroke="#73A5CA" strokeWidth="3" className="dark:stroke-[#FF933E]" />
          <line x1="610" y1="346" x2="830" y2="346" stroke="#73A5CA" strokeWidth="3" className="dark:stroke-[#FF933E]" />
        </g>

        {/* 6. CAMPUS PROMENADE PATHWAY */}
        <polygon
          points="720,390 580,680 860,680"
          fill="url(#promenadeGrad)"
          className="dark:fill-[#13005A] dark:fill-opacity-80"
        />
        <line x1="720" y1="395" x2="720" y2="680" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="10 8" opacity="0.75" className="dark:stroke-[#03C988] dark:opacity-60" />

        {/* Campus Street Lamps with Glow Halos */}
        {[
          { x: 570, y: 440 },
          { x: 520, y: 530 },
          { x: 870, y: 440 },
          { x: 920, y: 530 }
        ].map((lamp, i) => (
          <g key={i}>
            <circle cx={lamp.x} cy={lamp.y} r="18" fill="#F59E0B" opacity="0.25" filter="url(#neonBlur)" className="hidden dark:block" />
            <circle cx={lamp.x} cy={lamp.y} r="8" fill="#FFFFFF" className="dark:fill-[#03C988]" />
            <line x1={lamp.x} y1={lamp.y + 8} x2={lamp.x} y2={lamp.y + 60} stroke="#000000" strokeWidth="4" strokeLinecap="round" className="dark:stroke-[#FF933E]" />
          </g>
        ))}

        {/* 7. FLOATING GRADUATION CAP */}
        <g className="anim-cap-float" transform="translate(1000, 130)">
          <polygon
            points="55,18 95,34 55,50 15,34"
            fill="#000000"
            stroke="#FF933E"
            strokeWidth="2.5"
            className="dark:fill-[#000000] dark:stroke-[#FF933E]"
          />
          <path d="M 35 42 Q 55 58 75 42 Z" fill="#000000" />
          <circle cx="55" cy="34" r="3.5" fill="#10B981" className="dark:fill-[#03C988]" />
          <path d="M 55 34 Q 72 44 80 60" stroke="#10B981" strokeWidth="2.5" fill="none" className="dark:stroke-[#03C988]" />
          <rect x="78" y="60" width="5" height="12" rx="1.5" fill="#10B981" className="dark:fill-[#03C988]" />
        </g>

        {/* 8. FLOATING OPEN ACADEMIC BOOK */}
        <g className="anim-book-float" transform="translate(170, 180)">
          <path
            d="M 50 40 Q 25 32 5 36 L 5 68 Q 25 64 50 72 Z"
            fill="#FFFFFF"
            stroke="#FF933E"
            strokeWidth="2"
            className="dark:fill-[#00337C] dark:stroke-[#FF933E]"
          />
          <path
            d="M 50 40 Q 75 32 95 36 L 95 68 Q 75 64 50 72 Z"
            fill="#FFFFFF"
            stroke="#FF933E"
            strokeWidth="2"
            className="dark:fill-[#00337C] dark:stroke-[#FF933E]"
          />
          <line x1="12" y1="46" x2="42" y2="46" stroke="#73A5CA" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#03C988]" />
          <line x1="12" y1="53" x2="38" y2="53" stroke="#73A5CA" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#FF933E]" />
          <line x1="12" y1="60" x2="40" y2="60" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#03C988]" />
          <line x1="58" y1="46" x2="88" y2="46" stroke="#73A5CA" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#03C988]" />
          <line x1="58" y1="53" x2="84" y2="53" stroke="#73A5CA" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#FF933E]" />
          <line x1="58" y1="60" x2="78" y2="60" stroke="#FF933E" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#FF933E]" />
          <line x1="50" y1="40" x2="50" y2="72" stroke="#000000" strokeWidth="3" className="dark:stroke-[#FF933E]" />
        </g>

        {/* 9. GLIDING PAPER AIRPLANE */}
        <g className="anim-plane-path">
          <polygon
            points="0,12 44,0 22,30"
            fill="#FFFFFF"
            stroke="#FF933E"
            strokeWidth="2"
            className="dark:fill-[#000000] dark:stroke-[#03C988]"
          />
          <polygon points="44,0 22,30 16,18" fill="#FFE9A9" className="dark:fill-[#FF933E]" />
          <polygon points="44,0 16,18 0,12" fill="#FFFFFF" className="dark:fill-[#03C988]" />
          <path
            d="M -5 14 C -30 20, -50 10, -80 22"
            stroke="#FFE9A9"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
            opacity="0.85"
            className="dark:stroke-[#03C988]"
          />
        </g>

        {/* 10. REALISTIC DETAILED COLLEGE BOY (Standing in Foreground Gazing Forward) */}
        <g id="realistic-college-boy" className="anim-boy-realistic">
          {/* Natural Contact Shadow */}
          <ellipse cx="485" cy="655" rx="55" ry="12" fill="#000000" opacity="0.35" filter="url(#neonBlur)" className="dark:fill-[#FF933E] dark:opacity-40" />

          {/* Shoes / Modern Collegiate Sneakers */}
          <g id="sneakers">
            {/* Left Shoe */}
            <path d="M 452 642 C 452 632, 470 632, 472 642 L 475 652 L 448 652 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" className="dark:fill-[#00337C] dark:stroke-[#FF933E]" />
            <path d="M 448 649 L 475 649" stroke="#FF933E" strokeWidth="2.5" className="dark:stroke-[#03C988]" />
            
            {/* Right Shoe */}
            <path d="M 498 642 C 498 632, 516 632, 518 642 L 521 652 L 494 652 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" className="dark:fill-[#00337C] dark:stroke-[#FF933E]" />
            <path d="M 494 649 L 521 649" stroke="#10B981" strokeWidth="2.5" className="dark:stroke-[#03C988]" />
          </g>

          {/* Jeans / Tailored College Trousers */}
          <g id="jeans-realistic">
            {/* Left Leg */}
            <path d="M 458 525 L 452 640 L 472 640 L 482 525 Z" fill="#000000" className="dark:fill-[#0F0A20]" />
            {/* Right Leg */}
            <path d="M 488 525 L 498 640 L 518 640 L 510 525 Z" fill="#000000" className="dark:fill-[#0F0A20]" />
            {/* Denim Seams and Creases */}
            <line x1="465" y1="535" x2="460" y2="635" stroke="#73A5CA" strokeWidth="1.5" className="dark:stroke-[#1C82AD]" />
            <line x1="505" y1="535" x2="510" y2="635" stroke="#73A5CA" strokeWidth="1.5" className="dark:stroke-[#1C82AD]" />
            <path d="M 470 575 C 475 580, 480 580, 485 575" stroke="#000000" strokeWidth="1.5" fill="none" />
          </g>

          {/* Varsity Jacket / Collegiate Hoodie with Realistic Shading */}
          <g id="varsity-jacket-realistic">
            {/* Main Torso (Viewed from back gazing up) */}
            <path
              d="M 444 425 C 432 455, 436 515, 446 530 L 524 530 C 534 515, 538 455, 526 425 Z"
              fill="url(#varsityBody)"
              stroke="#FF933E"
              strokeWidth="2"
              className="dark:stroke-[#FF933E]"
            />
            {/* Striped Ribbed Waistband */}
            <rect x="446" y="522" width="78" height="10" rx="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" className="dark:fill-[#1E1438] dark:stroke-[#FF933E]" />
            <line x1="450" y1="527" x2="520" y2="527" stroke="#FF933E" strokeWidth="2" className="dark:stroke-[#03C988]" />

            {/* Left Arm & Sleeve with Ribbed Cuff */}
            <path d="M 444 428 C 424 450, 426 490, 434 516 L 448 512 C 442 485, 440 450, 452 428 Z" fill="url(#varsitySleeves)" />
            <rect x="430" y="512" width="18" height="6" rx="2" fill="#FFFFFF" stroke="#FF933E" strokeWidth="1.5" className="dark:stroke-[#03C988]" />

            {/* Right Arm - Holding Campus Binder Folder */}
            <path d="M 526 428 C 546 450, 544 485, 536 512 L 522 508 C 528 485, 530 450, 518 428 Z" fill="url(#varsitySleeves)" />
            <rect x="522" y="508" width="18" height="6" rx="2" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" className="dark:stroke-[#03C988]" />
            
            {/* Campus Binder / Folder Under Right Arm */}
            <rect
              x="532"
              y="485"
              width="28"
              height="36"
              rx="4"
              fill="#FFFFFF"
              stroke="#10B981"
              strokeWidth="2.5"
              transform="rotate(9 532 485)"
              className="dark:fill-[#00337C] dark:stroke-[#03C988]"
            />
            <line x1="538" y1="495" x2="554" y2="498" stroke="#FF933E" strokeWidth="2" className="dark:stroke-[#FF933E]" />
            <line x1="539" y1="504" x2="553" y2="506" stroke="#73A5CA" strokeWidth="2" className="dark:stroke-[#03C988]" />
          </g>

          {/* Detailed Collegiate Backpack with Straps & Zipper */}
          <g id="college-backpack-realistic">
            <rect
              x="456"
              y="432"
              width="58"
              height="68"
              rx="15"
              fill="url(#backpackGrad)"
              stroke="#FFE9A9"
              strokeWidth="2.5"
              className="dark:stroke-[#FF933E]"
            />
            {/* Front Utility Pocket */}
            <rect
              x="464"
              y="462"
              width="42"
              height="32"
              rx="9"
              fill="#73A5CA"
              stroke="#FF933E"
              strokeWidth="1.8"
              className="dark:stroke-[#03C988]"
            />
            {/* Metal Zipper Track */}
            <line x1="468" y1="470" x2="502" y2="470" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 2" className="dark:stroke-[#03C988]" />
            
            {/* UniMitra Crest Badge */}
            <circle cx="485" cy="480" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" className="dark:fill-[#03C988]" />

            {/* Padded Shoulder Straps */}
            <path d="M 462 432 C 454 416, 450 426, 458 448" stroke="#FFE9A9" strokeWidth="5" strokeLinecap="round" fill="none" className="dark:stroke-[#FF933E]" />
            <path d="M 508 432 C 516 416, 520 426, 512 448" stroke="#FFE9A9" strokeWidth="5" strokeLinecap="round" fill="none" className="dark:stroke-[#FF933E]" />
            {/* Top Grab Handle */}
            <path d="M 477 432 C 477 420, 493 420, 493 432" stroke="#FFFFFF" strokeWidth="3" fill="none" className="dark:stroke-[#03C988]" />
          </g>

          {/* Neck, Collar, and Head with Wind-Breeze Hair */}
          <g id="student-head-realistic">
            <rect x="476" y="410" width="18" height="18" rx="3" fill="#E9D5FF" />
            <path d="M 468 424 C 476 418, 494 418, 502 424 C 494 432, 476 432, 468 424 Z" fill="#FF933E" stroke="#FFE9A9" strokeWidth="1.5" className="dark:fill-[#FF933E]" />

            {/* Head Silhouette */}
            <ellipse cx="485" cy="392" rx="19" ry="22" fill="#F3E8FF" />

            {/* Realistic Wavy College Hair (Looking up with ambition) */}
            <g className="anim-hair">
              <path
                d="M 466 394 C 462 374, 472 362, 485 362 C 499 362, 507 374, 504 394 C 499 388, 494 391, 485 387 C 478 391, 471 388, 466 394 Z"
                fill="#000000"
                className="dark:fill-[#13005A]"
              />
              {/* Hair Texture & Highlight Strands */}
              <path d="M 475 366 C 482 363, 490 363, 495 367" stroke="#FF933E" strokeWidth="2" strokeLinecap="round" fill="none" className="dark:stroke-[#FF933E]" />
              <path d="M 470 376 C 478 372, 488 372, 496 377" stroke="#73A5CA" strokeWidth="1.8" strokeLinecap="round" fill="none" className="dark:stroke-[#03C988]" />
            </g>
          </g>

          {/* Aspiration Sparks & Knowledge Constellation Threads */}
          <g id="aspiration-threads">
            <circle cx="462" cy="355" r="2.5" fill="#10B981" className="anim-star-a dark:fill-[#03C988]" />
            <circle cx="508" cy="350" r="3" fill="#FF933E" className="anim-star-b dark:fill-[#FF933E]" />
            <circle cx="485" cy="338" r="3.5" fill="#F59E0B" className="anim-star-c" />
            <path
              d="M 485 332 C 530 290, 640 230, 720 180"
              stroke="#FF933E"
              strokeWidth="2"
              strokeDasharray="5 7"
              opacity="0.6"
              fill="none"
              className="dark:stroke-[#03C988] dark:opacity-80"
            />
          </g>
        </g>
      </svg>

      {/* Soft Vignette Overlay to Guarantee Forefront Card Readability */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-[#FFFFFF]/30 dark:from-[#13005A] dark:via-transparent dark:to-[#13005A]/40 pointer-events-none" />
      )}
    </div>
  );
};

