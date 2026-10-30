import { AcademicCapIcon, ShieldCheckIcon } from '../common/Icons';

export const Footer = ({ onNavigate, currentLang = 'en' }) => {
  return (
    <footer className="bg-[#073B4C] dark:bg-[#051822] text-slate-300 border-t-4 border-[#FF7F50] transition-colors duration-200">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => onNavigate && onNavigate('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-white shadow-md border border-[#118AB2]/40">
                <AcademicCapIcon className="w-6 h-6 text-[#FFD166]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Uni<span className="text-[#FF7F50]">Mitra</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {currentLang === 'as' 
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক তথ্য, পাঠ্যক্ৰম আৰু কৃত্রিম বুদ্ধিমত্তা চালিত প্ৰশ্নোত্তৰ মঞ্চ। ছাত্ৰ-ছাত্ৰীৰ বাবে সম্পূৰ্ণ বিশ্বস্ত সমাধান।'
                : 'Empowering university scholars across Assam with verified academic documents, syllabuses, and question answering in Assamese and English.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-white/10 text-[#FFD166] px-3 py-1.5 rounded-lg border border-white/15">
                Official Syllabuses
              </span>
              <span className="bg-white/10 text-[#06D6A0] px-3 py-1.5 rounded-lg border border-white/15">
                Assamese + English
              </span>
              <span className="bg-white/10 text-[#FF7F50] px-3 py-1.5 rounded-lg border border-white/15">
                Direct Page Citations
              </span>
            </div>
          </div>

          {/* Col 3: Supported Assam Universities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#FFD166] uppercase tracking-wider">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয়সমূহ' : 'Assam Universities'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="hover:text-white transition-colors cursor-pointer">Gauhati University (GU)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Dibrugarh University (DU)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Tezpur Central University (TU)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Assam University (Silchar)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cotton University (CU)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Bodoland University (BU)</li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#06D6A0] uppercase tracking-wider">
              {currentLang === 'as' ? 'মঞ্চ সেৱা' : 'Navigation & Services'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About UniMitra
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact University Helpdesk
                </button>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">Syllabus Archive</li>
              <li className="hover:text-white transition-colors cursor-pointer">Question Paper Vault</li>
            </ul>
          </div>

          {/* Col 5: Security & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#FF7F50] uppercase tracking-wider">
              {currentLang === 'as' ? 'বিশ্বস্ততা' : 'Student Trust'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every answer points directly to official university documentation with exact page numbers.
            </p>
            <div className="bg-[#118AB2]/20 border border-[#118AB2]/40 rounded-xl p-3.5 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[#06D6A0] font-bold">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Zero Fake Information</span>
              </div>
              <p className="text-xs text-slate-300">
                Answers are grounded exclusively in authorized university PDF documents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-slate-700/60 bg-[#052935] dark:bg-[#031018] text-xs py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-slate-400">
            © {new Date().getFullYear()} <strong className="text-white">UniMitra</strong>. Built for Assam Higher Education.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="text-[#FFD166] font-semibold">Bilingual Assamese & English</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
