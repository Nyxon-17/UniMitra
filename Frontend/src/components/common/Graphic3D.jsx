import { BuildingLibraryIcon, BrainIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, BanknotesIcon } from './Icons';

export const UniversityHero3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto perspective-container select-none px-2 sm:px-0">
      {/* Background isometric grid plane with dark neon glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#6D28D9]/20 via-[#8F00FF]/15 to-[#DDD6FE]/30 dark:from-[#B026FF]/30 dark:via-[#120B24] dark:to-[#F59E0B]/20 rounded-3xl transform -rotate-2 scale-95 border border-[#E0D4FD] dark:border-[#B026FF]/40"></div>

      {/* Main 3D Stage Card: Ivory lavender Card in Light, Deep Violet in Dark with Violet Edge */}
      <div className="relative bg-white dark:bg-[#120B24] border-2 border-[#E0D4FD] dark:border-[#B026FF]/50 rounded-3xl p-5 sm:p-7 shadow-elevated-royal dark:shadow-[0_0_25px_rgba(176,38,255,0.25)] card-3d">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E0D4FD] dark:border-[#3B2868]">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6D28D9] dark:bg-[#F59E0B]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#8F00FF] dark:bg-[#B026FF]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#DDD6FE] border border-[#6D28D9]/40"></div>
            <span className="text-[11px] sm:text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] tracking-wider uppercase ml-1">
              Institutional Intelligence Core
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#FAF8FF] text-[#6D28D9] dark:bg-[#F59E0B]/15 dark:text-[#FBBF24] border border-[#E0D4FD] dark:border-[#F59E0B]/40">
            OFFICIAL & GROUNDED
          </span>
        </div>

        {/* Central 3D Vector Isometric Core */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center justify-center">
          {/* Back Glow */}
          <div className="absolute inset-2 bg-gradient-to-tr from-[#6D28D9]/25 via-[#8F00FF]/25 to-[#DDD6FE]/35 dark:from-[#B026FF]/35 dark:to-[#F59E0B]/25 rounded-3xl blur-xl"></div>

          {/* Center Isometric Cube in Royal Purple, Electric Violet & Deep Violet */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#6D28D9] via-[#8F00FF] to-[#4C1D95] dark:from-[#4C1D95] dark:via-[#6D28D9] dark:to-[#120B24] rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center text-white border-2 border-[#E0D4FD] dark:border-[#B026FF]/60 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 dark:bg-[#FAF8FF]/15 flex items-center justify-center mb-1.5 border border-white/30 dark:border-[#F59E0B]/40 backdrop-blur-xs">
              <BuildingLibraryIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-[#FAF8FF]" />
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wide text-center text-white">
              UNIMITRA
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#DDD6FE] dark:text-[#FBBF24] font-semibold mt-0.5">
              Assam Universities RAG
            </span>
          </div>

          {/* Floating 3D Micro-Card 1: Assamese Institutional Query */}
          <div className="absolute -top-2 left-0 sm:-left-3 bg-white dark:bg-[#0A0718] border-2 border-[#E0D4FD] dark:border-[#B026FF]/50 rounded-2xl p-2.5 sm:p-3 shadow-elevated-violet dark:shadow-[0_0_15px_rgba(176,38,255,0.3)] animate-float max-w-[180px] sm:max-w-[220px]">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#8F00FF] dark:bg-[#F59E0B]"></span>
              <span className="text-[10px] font-black text-[#6D28D9] dark:text-[#FBBF24] uppercase tracking-wider">
                প্ৰশ্ন (Query)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-[#1E1035] dark:text-[#FAF8FF] line-clamp-2 leading-tight">
              "GU-ৰ স্নাতকোত্তৰ ছাত্ৰবৃত্তিৰ আবেদনৰ চৰ্ত আৰু অন্তিম তাৰিখ কি?"
            </p>
          </div>

          {/* Floating 3D Micro-Card 2: Grounded Institutional Citation with Emerald Green Success */}
          <div className="absolute -bottom-2 right-0 sm:-right-3 bg-white dark:bg-[#0A0718] border-2 border-[#E0D4FD] dark:border-[#10B981]/50 rounded-2xl p-2.5 sm:p-3 shadow-elevated-royal dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] animate-float-delayed max-w-[200px] sm:max-w-[240px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 text-[#10B981]">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[10px] font-black tracking-wide">প্ৰমাণিত উত্তৰ</span>
              </div>
              <span className="text-[9px] bg-[#DDD6FE]/60 text-[#4C1D95] dark:bg-[#6D28D9]/40 dark:text-[#10B981] px-1.5 py-0.5 rounded font-black border border-[#E0D4FD]/60 dark:border-[#10B981]/40">
                GU Circular
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#555375] dark:text-[#C4B5FD] line-clamp-2 leading-tight">
              নূন্যতম ৫৫% নম্বৰ সহ ৩০ নৱেম্বৰৰ ভিতৰত আবেদন লাগিব (পৃষ্ঠা ৬, ধাৰা ৪.১)।
            </p>
          </div>

          {/* Floating Tag 3: Multi-Institution Badge */}
          <div className="hidden xs:flex absolute top-1/2 -right-2 sm:-right-5 transform -translate-y-1/2 bg-[#FAF8FF] dark:bg-[#1A0F33] text-[#1E1035] dark:text-[#FAF8FF] font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md border border-[#E0D4FD] dark:border-[#B026FF]/50 items-center space-x-1.5">
            <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#8F00FF] dark:text-[#FBBF24]" />
            <span>Verified Circulars</span>
          </div>
        </div>

        {/* Bottom Feature Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-[#E0D4FD] dark:border-[#3B2868] text-center">
          <div className="bg-[#FAF8FF] dark:bg-[#0A0718] p-2 sm:p-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
            <div className="text-xs sm:text-sm font-black text-[#1E1035] dark:text-[#FAF8FF]">Regulations</div>
            <div className="text-[10px] font-semibold text-[#555375] dark:text-[#C4B5FD]">Ordinances & Exams</div>
          </div>
          <div className="bg-[#DDD6FE]/40 dark:bg-[#1A0F33] p-2 sm:p-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#B026FF]/40">
            <div className="text-xs sm:text-sm font-black text-[#6D28D9] dark:text-[#FBBF24]">অসমীয়া + EN</div>
            <div className="text-[10px] font-semibold text-[#555375] dark:text-[#C4B5FD]">Bilingual AI Support</div>
          </div>
          <div className="bg-[#FAF8FF] dark:bg-[#0A0718] p-2 sm:p-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
            <div className="text-xs sm:text-sm font-black text-[#10B981]">100% Grounded</div>
            <div className="text-[10px] font-semibold text-[#555375] dark:text-[#C4B5FD]">Zero Guesswork</div>
          </div>
        </div>
      </div>
    </div>
  );
};
