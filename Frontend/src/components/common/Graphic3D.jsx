import { 
  BuildingLibraryIcon, 
  BrainIcon, 
  CheckCircleIcon, 
  ClipboardDocumentCheckIcon, 
  ShieldCheckIcon,
  SparklesIcon
} from './Icons';

/**
 * Institutional Intelligence Core 3D Holographic Display
 * 
 * Features:
 * - Animated concentric holographic orbital rings (dual-directional rotation)
 * - Scanning laser beam across the central neural RAG core
 * - Symmetrical floating micro-cards with organic levitation (Assamese Query -> Grounded Citation)
 * - Animated connecting data flow lines with live particle laser dashes
 * - Editorial + Aurora color harmony (#123C3A, #D4A96A, #55C7B2, #E0B77A)
 */
export const UniversityHero3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none px-2 sm:px-0 group">
      
      {/* Background isometric depth plane */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#123C3A]/10 via-[#D4A96A]/10 to-[#55C7B2]/15 dark:from-[#55C7B2]/10 dark:via-[#142426] dark:to-[#E0B77A]/15 rounded-3xl transform -rotate-2 scale-95 border border-[#123C3A]/10 dark:border-[#55C7B2]/20 transition-transform duration-700 group-hover:-rotate-3" />

      {/* Main 3D Stage Card with Editorial Glass Surface */}
      <div className="relative editorial-surface rounded-3xl p-5 sm:p-7 shadow-xl dark:shadow-[0_0_35px_rgba(85,199,178,0.15)] transition-all duration-500 overflow-hidden">
        
        {/* Subtle Ambient Aurora Radial Glow */}
        <div 
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-2xl opacity-40 dark:opacity-30 pointer-events-none animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, rgba(85, 199, 178, 0.4) 0%, rgba(212, 169, 106, 0.2) 50%, transparent 75%)' }}
        />

        {/* 1. TOP HEADER BAR */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#123C3A] dark:bg-[#55C7B2] animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A96A] dark:bg-[#E0B77A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#627680]/40 dark:bg-white/30" />
            <span className="text-[11px] sm:text-xs font-bold text-[#123C3A] dark:text-[#DCE8E4] tracking-wider uppercase ml-1.5 font-heading">
              Institutional Intelligence Core
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#E9F0ED] dark:bg-[#142426] border border-[#123C3A]/10 dark:border-[#55C7B2]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55C7B2] animate-ping" />
            <span className="text-[10px] sm:text-xs font-semibold text-[#123C3A] dark:text-[#55C7B2] font-mono tracking-tight">
              LIVE RAG STREAM
            </span>
          </div>
        </div>

        {/* 2. CENTRAL 3D ANIMATED VECTOR HOLOGRAPHIC STAGE */}
        <div className="relative py-8 sm:py-10 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[290px]">
          
          {/* Animated Concentric Holographic Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer Orbital Ring (Counter-Clockwise) */}
            <svg className="w-64 h-64 sm:w-76 sm:h-76 animate-spin-reverse opacity-35 dark:opacity-40" viewBox="0 0 200 200">
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="none" 
                stroke="url(#orbitTeal)" 
                strokeWidth="1.2" 
                strokeDasharray="6 8 20 8" 
              />
              <circle cx="100" cy="10" r="3" fill="#D4A96A" />
              <circle cx="190" cy="100" r="2.5" fill="#55C7B2" />
              <defs>
                <linearGradient id="orbitTeal" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#123C3A" />
                  <stop offset="50%" stopColor="#D4A96A" />
                  <stop offset="100%" stopColor="#55C7B2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Orbital Ring (Clockwise) */}
            <svg className="w-52 h-52 sm:w-60 sm:h-60 animate-spin-slow opacity-40 dark:opacity-50" viewBox="0 0 160 160">
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                fill="none" 
                stroke="url(#orbitGold)" 
                strokeWidth="1.4" 
                strokeDasharray="14 10 4 10" 
              />
              <circle cx="80" cy="150" r="3" fill="#55C7B2" />
              <circle cx="10" cy="80" r="2" fill="#D4A96A" />
              <defs>
                <linearGradient id="orbitGold" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4A96A" />
                  <stop offset="100%" stopColor="#55C7B2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated Connecting Laser Vector Pathways */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 280">
            {/* Top-Left Query Node to Center Core */}
            <path 
              d="M 90 60 C 130 90, 160 120, 200 135" 
              fill="none" 
              stroke="#D4A96A" 
              strokeWidth="1.5" 
              className="animate-laser-flow" 
            />
            {/* Center Core to Bottom-Right Citation Node */}
            <path 
              d="M 200 145 C 240 165, 270 190, 310 220" 
              fill="none" 
              stroke="#55C7B2" 
              strokeWidth="1.5" 
              className="animate-laser-flow" 
            />
          </svg>

          {/* Center Isometric Hologram Core Node */}
          <div className="relative z-10 w-32 h-32 sm:w-38 sm:h-38 rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center text-white border-2 border-[#123C3A]/20 dark:border-[#55C7B2]/40 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 60, 58, 0.95) 0%, rgba(20, 36, 38, 0.92) 50%, rgba(18, 60, 58, 0.98) 100%)'
            }}
          >
            {/* Scanning Light Beam passing across the core */}
            <div className="absolute inset-0 w-full h-10 bg-gradient-to-b from-transparent via-[#55C7B2]/30 to-transparent pointer-events-none animate-scan-beam" />

            {/* University Emblem with Ambient Aura */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 dark:bg-[#55C7B2]/20 flex items-center justify-center mb-1.5 border border-white/20 dark:border-[#55C7B2]/30 backdrop-blur-xs shadow-inner">
              <BuildingLibraryIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4A96A] dark:text-[#55C7B2]" />
            </div>

            <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-center text-white font-heading">
              UNIMITRA
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#D4A96A] dark:text-[#55C7B2] font-semibold tracking-tight mt-0.5 font-mono">
              Assam RAG Engine
            </span>
          </div>

          {/* 3. FLOATING MICRO-CARD 1: Live Assamese Query (Top-Left) */}
          <div className="absolute top-1 -left-1 sm:-left-3 bg-white/95 dark:bg-[#142426]/95 border border-[#123C3A]/15 dark:border-[#55C7B2]/25 rounded-2xl p-2.5 sm:p-3 shadow-lg dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-float-slow max-w-[190px] sm:max-w-[225px] z-20 backdrop-blur-md">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#D4A96A] animate-pulse" />
              <span className="text-[10px] font-bold text-[#123C3A] dark:text-[#D4A96A] uppercase tracking-wider font-heading">
                প্ৰশ্ন (Live Query)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-[#273B45] dark:text-[#DCE8E4] line-clamp-2 leading-snug font-assamese">
              "GU-ৰ স্নাতকোত্তৰ ছাত্ৰবৃত্তিৰ আবেদনৰ চৰ্ত আৰু অন্তিম তাৰিখ কি?"
            </p>
          </div>

          {/* 4. FLOATING MICRO-CARD 2: Grounded Institutional Citation (Bottom-Right) */}
          <div className="absolute bottom-1 -right-1 sm:-right-3 bg-white/95 dark:bg-[#142426]/95 border border-[#55C7B2]/30 dark:border-[#55C7B2]/40 rounded-2xl p-2.5 sm:p-3 shadow-lg dark:shadow-[0_0_20px_rgba(85,199,178,0.2)] animate-float-delayed max-w-[210px] sm:max-w-[245px] z-20 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 text-[#55C7B2]">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#55C7B2]" />
                <span className="text-[10px] font-bold tracking-wide text-[#123C3A] dark:text-[#55C7B2] font-heading">
                  প্ৰমাণিত উত্তৰ
                </span>
              </div>
              <span className="text-[9px] bg-[#E9F0ED] dark:bg-[#16181A] text-[#123C3A] dark:text-[#55C7B2] px-1.5 py-0.5 rounded font-mono font-bold border border-[#123C3A]/10 dark:border-[#55C7B2]/20">
                GU Circular
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#273B45] dark:text-[#DCE8E4] line-clamp-2 leading-snug font-sans font-medium">
              নূন্যতম ৫৫% নম্বৰ সহ ৩০ নৱেম্বৰৰ ভিতৰত আবেদন লাগিব (পৃষ্ঠা ৬, ধাৰা ৪.১)।
            </p>
          </div>

          {/* 5. FLOATING MICRO-BADGE 3: Verified Badge (Center-Right) */}
          <div className="hidden xs:flex absolute top-1/2 -right-3 sm:-right-5 transform -translate-y-1/2 bg-white/90 dark:bg-[#142426]/90 text-[#123C3A] dark:text-[#DCE8E4] font-bold text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md border border-[#123C3A]/12 dark:border-[#55C7B2]/30 items-center space-x-1.5 z-20 backdrop-blur-sm animate-float-slow">
            <ShieldCheckIcon className="w-4 h-4 text-[#55C7B2]" />
            <span className="font-heading">Verified Circulars</span>
          </div>

        </div>

        {/* 6. BOTTOM FEATURE METRICS STRIP */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-2 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 text-center relative z-10">
          <div className="bg-[#E9F0ED]/60 dark:bg-[#142426]/60 p-2 sm:p-2.5 rounded-xl border border-[#123C3A]/8 dark:border-[#55C7B2]/12 hover:border-[#123C3A]/25 dark:hover:border-[#55C7B2]/30 transition-colors">
            <div className="text-xs sm:text-sm font-bold text-[#123C3A] dark:text-[#DCE8E4] font-heading">
              Regulations
            </div>
            <div className="text-[10px] font-medium text-[#627680] dark:text-[#879B99] truncate">
              Statutes & Exams
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#16181A]/80 p-2 sm:p-2.5 rounded-xl border border-[#D4A96A]/30 dark:border-[#E0B77A]/30 hover:shadow-xs transition-shadow">
            <div className="text-xs sm:text-sm font-bold text-[#D4A96A] dark:text-[#E0B77A] font-heading">
              অসমীয়া + EN
            </div>
            <div className="text-[10px] font-medium text-[#627680] dark:text-[#879B99] truncate">
              Bilingual AI RAG
            </div>
          </div>

          <div className="bg-[#E9F0ED]/60 dark:bg-[#142426]/60 p-2 sm:p-2.5 rounded-xl border border-[#123C3A]/8 dark:border-[#55C7B2]/12 hover:border-[#55C7B2]/30 transition-colors">
            <div className="text-xs sm:text-sm font-bold text-[#55C7B2] font-heading">
              100% Grounded
            </div>
            <div className="text-[10px] font-medium text-[#627680] dark:text-[#879B99] truncate">
              Zero Guesswork
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
