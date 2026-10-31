import { BuildingLibraryIcon, BrainIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, BanknotesIcon } from './Icons';

export const UniversityHero3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto perspective-container select-none px-2 sm:px-0">
      {/* Background isometric grid plane */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#73A5CA]/20 via-[#FFE9A9]/30 to-[#FFCB56]/30 dark:from-[#1C82AD]/30 dark:via-[#00337C] dark:to-[#03C988]/20 rounded-3xl transform -rotate-2 scale-95 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40"></div>

      {/* Main 3D Stage Card: White in Light, Marine Blue in Dark */}
      <div className="relative neo-surface rounded-3xl p-5 sm:p-7 shadow-xl dark:shadow-[0_0_25px_rgba(28,130,173,0.3)] transition-all duration-300">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#73A5CA]/25 dark:border-[#1C82AD]/30">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF933E] dark:bg-[#03C988]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFCB56] dark:bg-[#1C82AD]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#73A5CA] border border-[#73A5CA]/40 dark:bg-[#0A0A0A]"></div>
            <span className="text-[11px] sm:text-xs font-black text-[#000000] dark:text-[#FFFFFF] tracking-wider uppercase ml-1">
              Institutional Intelligence Core
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#FFE9A9] text-[#000000] dark:bg-[#03C988]/20 dark:text-[#03C988] border border-[#FFCB56] dark:border-[#03C988]/40">
            OFFICIAL & GROUNDED
          </span>
        </div>

        {/* Central 3D Vector Isometric Core */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center justify-center">
          {/* Back Glow */}
          <div className="absolute inset-2 bg-gradient-to-tr from-[#73A5CA]/30 via-[#FFE9A9]/35 to-[#FF933E]/25 dark:from-[#00337C]/50 dark:to-[#03C988]/30 rounded-3xl blur-xl"></div>

          {/* Center Isometric Cube in Tangerine/Sky Blue in light, Cyan/Navy in dark */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#73A5CA] via-[#FFCB56] to-[#FF933E] dark:from-[#13005A] dark:via-[#00337C] dark:to-[#1C82AD] rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center text-white border-2 border-[#73A5CA] dark:border-[#03C988]/60 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 dark:bg-[#03C988]/20 flex items-center justify-center mb-1.5 border border-white/30 dark:border-[#03C988]/40 backdrop-blur-xs">
              <BuildingLibraryIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#000000] dark:text-[#FFFFFF]" />
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wide text-center text-[#000000] dark:text-[#FFFFFF]">
              UNIMITRA
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#000000]/80 dark:text-[#03C988] font-semibold mt-0.5">
              Assam Universities RAG
            </span>
          </div>

          {/* Floating 3D Micro-Card 1: Assamese Institutional Query */}
          <div className="absolute -top-2 left-0 sm:-left-3 bg-white dark:bg-[#0A0A0A] border-2 border-[#73A5CA]/50 dark:border-[#1C82AD]/60 rounded-2xl p-2.5 sm:p-3 shadow-md dark:shadow-[0_0_15px_rgba(28,130,173,0.3)] animate-float max-w-[180px] sm:max-w-[220px]">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF933E] dark:bg-[#03C988]"></span>
              <span className="text-[10px] font-black text-[#FF933E] dark:text-[#03C988] uppercase tracking-wider">
                প্ৰশ্ন (Query)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] line-clamp-2 leading-tight">
              "GU-ৰ স্নাতকোত্তৰ ছাত্ৰবৃত্তিৰ আবেদনৰ চৰ্ত আৰু অন্তিম তাৰিখ কি?"
            </p>
          </div>

          {/* Floating 3D Micro-Card 2: Grounded Institutional Citation with Mint Green Success */}
          <div className="absolute -bottom-2 right-0 sm:-right-3 bg-white dark:bg-[#0A0A0A] border-2 border-[#FFCB56] dark:border-[#03C988]/50 rounded-2xl p-2.5 sm:p-3 shadow-md dark:shadow-[0_0_15px_rgba(3,201,136,0.25)] animate-float-delayed max-w-[200px] sm:max-w-[240px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 text-[#03C988]">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#03C988]" />
                <span className="text-[10px] font-black tracking-wide text-[#000000] dark:text-[#03C988]">প্ৰমাণিত উত্তৰ</span>
              </div>
              <span className="text-[9px] bg-[#FFE9A9] text-[#000000] dark:bg-[#141414] dark:text-[#03C988] px-1.5 py-0.5 rounded font-black border border-[#FFCB56] dark:border-[#03C988]/40">
                GU Circular
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#000000] dark:text-[#FFFFFF] line-clamp-2 leading-tight">
              নূন্যতম ৫৫% নম্বৰ সহ ৩০ নৱেম্বৰৰ ভিতৰত আবেদন লাগিব (পৃষ্ঠা ৬, ধাৰা ৪.১)।
            </p>
          </div>

          {/* Floating Tag 3: Multi-Institution Badge */}
          <div className="hidden xs:flex absolute top-1/2 -right-2 sm:-right-5 transform -translate-y-1/2 bg-[#FFE9A9] dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md border border-[#FFCB56] dark:border-[#1C82AD]/50 items-center space-x-1.5">
            <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#FF933E] dark:text-[#03C988]" />
            <span>Verified Circulars</span>
          </div>
        </div>

        {/* Bottom Feature Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-[#73A5CA]/25 dark:border-[#1C82AD]/30 text-center">
          <div className="bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] p-2 sm:p-2.5 rounded-xl border border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
            <div className="text-xs sm:text-sm font-black text-[#000000] dark:text-[#FFFFFF]">Regulations</div>
            <div className="text-[10px] font-semibold text-[#000000]/70 dark:text-[#FFFFFF]/70">Ordinances & Exams</div>
          </div>
          <div className="bg-[#FFE9A9] dark:bg-[#141414] p-2 sm:p-2.5 rounded-xl border border-[#FFCB56] dark:border-[#1C82AD]/40">
            <div className="text-xs sm:text-sm font-black text-[#FF933E] dark:text-[#03C988]">অসমীয়া + EN</div>
            <div className="text-[10px] font-semibold text-[#000000]/80 dark:text-[#FFFFFF]/80">Bilingual AI Support</div>
          </div>
          <div className="bg-[#FFE9A9]/30 dark:bg-[#0A0A0A] p-2 sm:p-2.5 rounded-xl border border-[#73A5CA]/30 dark:border-[#1C82AD]/30">
            <div className="text-xs sm:text-sm font-black text-[#03C988]">100% Grounded</div>
            <div className="text-[10px] font-semibold text-[#000000]/70 dark:text-[#FFFFFF]/70">Zero Guesswork</div>
          </div>
        </div>
      </div>
    </div>
  );
};
