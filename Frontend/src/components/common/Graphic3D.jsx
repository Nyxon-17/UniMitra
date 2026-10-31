import { BuildingLibraryIcon, BrainIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, BanknotesIcon } from './Icons';

export const UniversityHero3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto perspective-container select-none px-2 sm:px-0">
      {/* Background isometric grid plane */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#84A282]/20 via-[#B8CFB3]/25 to-[#F6E2E9]/40 dark:from-[#728E6D]/20 dark:via-[#15370D] dark:to-[#E5CD82]/15 rounded-3xl transform -rotate-2 scale-95 border border-[#84A282]/30 dark:border-[#728E6D]/40"></div>

      {/* Main 3D Stage Card */}
      <div className="relative bg-[#FEFAF3] dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-5 sm:p-7 shadow-elevated-sage dark:shadow-elevated-gold card-3d">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#B8CFB3]/60 dark:border-[#728E6D]/70">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#84A282]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#B8CFB3]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#F6E2E9] border border-[#84A282]/40"></div>
            <span className="text-[11px] sm:text-xs font-black text-[#15370D] dark:text-[#FFF2B4] tracking-wider uppercase ml-1">
              Institutional Intelligence Core
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#84A282]/20 text-[#15370D] dark:bg-[#FFF2B4]/20 dark:text-[#FFF2B4] border border-[#84A282]/40 dark:border-[#E5CD82]/50">
            OFFICIAL & GROUNDED
          </span>
        </div>

        {/* Central 3D Vector Isometric Core */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center justify-center">
          {/* Pulsing Back Glow */}
          <div className="absolute inset-2 bg-gradient-to-tr from-[#84A282]/30 via-[#B8CFB3]/30 to-[#F6E2E9]/40 dark:from-[#728E6D]/30 dark:to-[#E5CD82]/20 rounded-3xl blur-xl animate-pulse"></div>
          
          {/* Center Isometric Cube */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#84A282] via-[#728E6D] to-[#15370D] dark:from-[#235417] dark:via-[#1C4412] dark:to-[#15370D] rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center text-white border-2 border-[#B8CFB3] dark:border-[#E5CD82]/60 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 dark:bg-[#FFF2B4]/20 flex items-center justify-center mb-1.5 border border-white/30 dark:border-[#FFF2B4]/40">
              <BuildingLibraryIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFF2B4] dark:text-[#FFF2B4]" />
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wide text-center text-white dark:text-[#FFF2B4]">
              CAMPUS IQ
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#F6E2E9] dark:text-[#E5CD82] font-semibold mt-0.5">
              Assam Universities RAG
            </span>
          </div>

          {/* Floating 3D Micro-Card 1: Assamese Institutional Query */}
          <div className="absolute -top-2 left-0 sm:-left-3 bg-white dark:bg-[#15370D] border-2 border-[#84A282]/50 dark:border-[#728E6D] rounded-2xl p-2.5 sm:p-3 shadow-elevated-blush animate-float max-w-[180px] sm:max-w-[220px]">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#84A282]"></span>
              <span className="text-[10px] font-black text-[#84A282] dark:text-[#E5CD82] uppercase tracking-wider">
                প্ৰশ্ন (Query)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-[#15370D] dark:text-[#FFF2B4] line-clamp-2 leading-tight">
              "GU-ৰ স্নাতকোত্তৰ ছাত্ৰবৃত্তিৰ আবেদনৰ চৰ্ত আৰু অন্তিম তাৰিখ কি?"
            </p>
          </div>

          {/* Floating 3D Micro-Card 2: Grounded Institutional Citation */}
          <div className="absolute -bottom-2 right-0 sm:-right-3 bg-white dark:bg-[#15370D] border-2 border-[#B8CFB3] dark:border-[#E5CD82]/60 rounded-2xl p-2.5 sm:p-3 shadow-elevated-sage dark:shadow-elevated-gold animate-float-delayed max-w-[200px] sm:max-w-[240px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 text-[#84A282] dark:text-[#FFF2B4]">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#84A282] dark:text-[#FFF2B4]" />
                <span className="text-[10px] font-black tracking-wide">প্ৰমাণিত উত্তৰ</span>
              </div>
              <span className="text-[9px] bg-[#F6E2E9] text-[#15370D] dark:bg-[#728E6D] dark:text-[#FFF2B4] px-1.5 py-0.5 rounded font-black">
                GU Circular
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#15370D] dark:text-slate-100 line-clamp-2 leading-tight">
              নূন্যতম ৫৫% নম্বৰ সহ ৩০ নৱেম্বৰৰ ভিতৰত আবেদন লাগিব (পৃষ্ঠা ৬, ধাৰা ৪.১)।
            </p>
          </div>

          {/* Floating Tag 3: Multi-Institution Badge */}
          <div className="hidden xs:flex absolute top-1/2 -right-2 sm:-right-5 transform -translate-y-1/2 bg-[#F6E2E9] dark:bg-[#728E6D] text-[#15370D] dark:text-[#FFF2B4] font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md border border-[#B8CFB3] dark:border-[#E5CD82]/50 items-center space-x-1.5">
            <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#84A282] dark:text-[#FFF2B4]" />
            <span>Verified Circulars</span>
          </div>
        </div>

        {/* Bottom Feature Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-[#B8CFB3]/60 dark:border-[#728E6D]/70 text-center">
          <div className="bg-[#B8CFB3]/25 dark:bg-[#15370D] p-2 sm:p-2.5 rounded-xl border border-[#84A282]/30 dark:border-[#728E6D]">
            <div className="text-xs sm:text-sm font-black text-[#15370D] dark:text-[#FFF2B4]">Regulations</div>
            <div className="text-[10px] font-semibold text-[#4F6D4B] dark:text-[#E5CD82]">Ordinances & Exams</div>
          </div>
          <div className="bg-[#F6E2E9]/60 dark:bg-[#15370D] p-2 sm:p-2.5 rounded-xl border border-[#F6E2E9] dark:border-[#728E6D]">
            <div className="text-xs sm:text-sm font-black text-[#84A282] dark:text-[#FFF2B4]">অসমীয়া + EN</div>
            <div className="text-[10px] font-semibold text-[#4F6D4B] dark:text-[#E5CD82]">Bilingual AI Support</div>
          </div>
          <div className="bg-[#B8CFB3]/25 dark:bg-[#15370D] p-2 sm:p-2.5 rounded-xl border border-[#84A282]/30 dark:border-[#728E6D]">
            <div className="text-xs sm:text-sm font-black text-[#15370D] dark:text-[#FFF2B4]">100% Grounded</div>
            <div className="text-[10px] font-semibold text-[#4F6D4B] dark:text-[#E5CD82]">Zero Guesswork</div>
          </div>
        </div>
      </div>
    </div>
  );
};
