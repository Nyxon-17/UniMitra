import { AcademicCapIcon, BrainIcon, CheckCircleIcon } from './Icons';

export const UniversityHero3D = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto perspective-container select-none px-2 sm:px-0">
      {/* Background isometric grid plane */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#118AB2]/10 via-[#06D6A0]/10 to-[#FF7F50]/10 rounded-2xl transform -rotate-3 scale-95 border border-[#118AB2]/20 dark:border-slate-700"></div>

      {/* Main 3D Stage Card */}
      <div className="relative bg-white dark:bg-[#111C2E] border-2 border-slate-200/90 dark:border-slate-700 rounded-2xl p-5 sm:p-8 shadow-elevated-cerulean card-3d">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#FF7F50]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#FFD166]"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#06D6A0]"></div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase ml-1 sm:ml-2">UniMitra Study Hub</span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#06D6A0]/15 text-[#06D6A0] border border-[#06D6A0]/30">
            VERIFIED & ACTIVE
          </span>
        </div>

        {/* Central 3D Vector Isometric Illustration */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center justify-center">
          {/* Isometric Knowledge Base Core */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Pulsing Back Glow */}
            <div className="absolute inset-2 bg-gradient-to-tr from-[#118AB2]/20 via-[#FFD166]/20 to-[#FF7F50]/20 rounded-2xl blur-xl animate-pulse"></div>
            
            {/* Center Isometric Cube */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-[#073B4C] via-[#118AB2] to-[#073B4C] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-white border-2 border-[#118AB2]/50 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-1.5 sm:mb-2 border border-white/20">
                <BrainIcon className="w-5 h-5 sm:w-7 sm:h-7 text-[#FFD166]" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wide">STUDY ASSISTANT</span>
              <span className="text-[9px] sm:text-[10px] text-[#06D6A0] font-semibold mt-0.5">Official Syllabuses</span>
            </div>
          </div>

          {/* Floating 3D Micro-Card 1: Assamese Student Query */}
          <div className="absolute -top-2 left-0 sm:-left-4 bg-white dark:bg-[#162235] border border-[#FF7F50]/40 rounded-xl p-2.5 sm:p-3 shadow-elevated-coral animate-float max-w-[170px] sm:max-w-[210px]">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF7F50]"></span>
              <span className="text-[10px] sm:text-xs font-bold text-[#FF7F50] uppercase tracking-wider">প্ৰশ্ন (Question)</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
              "গুৱাহাটী বিশ্ববিদ্যালয়ৰ ৩য় ষাণ্মাসিকৰ সিলেবাছ আছেনে?"
            </p>
          </div>

          {/* Floating 3D Micro-Card 2: Verified Answer */}
          <div className="absolute -bottom-2 right-0 sm:-right-4 bg-white dark:bg-[#162235] border border-[#06D6A0]/40 rounded-xl p-2.5 sm:p-3 shadow-elevated-mint animate-float-delayed max-w-[190px] sm:max-w-[230px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 text-[#06D6A0]">
                <CheckCircleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wide">প্ৰমাণিত উত্তৰ</span>
              </div>
              <span className="text-[10px] bg-[#118AB2]/10 text-[#118AB2] dark:text-[#FFD166] px-1 py-0.5 rounded font-bold">GU BCA</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight">
              হয়! Data Structures বিষয়ৰ PDF সংলগ্ন কৰা হৈছে (পৃষ্ঠা ১৪)।
            </p>
          </div>

          {/* Floating Tag 3: Multi-University Badge */}
          <div className="hidden xs:flex absolute top-1/2 -right-2 sm:-right-6 transform -translate-y-1/2 bg-[#FFD166] text-slate-900 font-extrabold text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl shadow-md border border-amber-300 items-center space-x-1">
            <AcademicCapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
            <span>Assam Universities</span>
          </div>
        </div>

        {/* Bottom Feature Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="bg-[#E7F3F7] dark:bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-[#118AB2]/20 dark:border-slate-700">
            <div className="text-sm sm:text-base font-extrabold text-[#118AB2] dark:text-[#06D6A0]">100%</div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300">Official Syllabuses</div>
          </div>
          <div className="bg-[#FFF9E6] dark:bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-[#FFD166]/40 dark:border-slate-700">
            <div className="text-sm sm:text-base font-extrabold text-[#D9A300] dark:text-[#FFD166]">অসমীয়া + EN</div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300">Bilingual Support</div>
          </div>
          <div className="bg-[#E6FBF5] dark:bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-[#06D6A0]/30 dark:border-slate-700">
            <div className="text-sm sm:text-base font-extrabold text-[#06D6A0]">Page Cited</div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300">Zero Guesswork</div>
          </div>
        </div>
      </div>
    </div>
  );
};
