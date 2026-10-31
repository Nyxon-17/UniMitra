import { AcademicCapIcon, ShieldCheckIcon } from '../common/Icons';

export const Footer = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
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
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক তথ্য, সকলো পাঠ্যক্ৰম আৰু কৃত্রিম বুদ্ধিমত্তা চালিত প্ৰশ্নোত্তৰ মঞ্চ। ছাত্ৰ-ছাত্ৰীৰ বাবে সম্পূৰ্ণ বিশ্বস্ত সমাধান।'
                : 'Empowering students across Assam with universal access to verified academic documents, course curriculums, and instant question answering in Assamese and English.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-white/10 text-[#FFD166] px-3 py-1.5 rounded-lg border border-white/15">
                All University Curriculums
              </span>
              <span className="bg-white/10 text-[#06D6A0] px-3 py-1.5 rounded-lg border border-white/15">
                Assamese + English
              </span>
              <span className="bg-white/10 text-[#FF7F50] px-3 py-1.5 rounded-lg border border-white/15">
                Direct Page Citations
              </span>
            </div>
          </div>

          {/* Col 3: Academic Curriculums */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#FFD166] uppercase tracking-wider">
              {currentLang === 'as' ? 'পাঠ্যক্ৰম অন্বেষণ' : 'Academic Curriculums'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Computer Science & Applications (BCA / B.Sc)
              </li>
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Engineering & Technology (B.Tech / BE)
              </li>
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Commerce & Management (B.Com / BBA)
              </li>
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Humanities & Social Sciences (B.A)
              </li>
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                Physical & Natural Sciences (B.Sc)
              </li>
              <li onClick={() => onNavigate && onNavigate('dashboard')} className="text-[#FFD166] font-semibold hover:underline cursor-pointer">
                + Browse All Semester Units ➔
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#06D6A0] uppercase tracking-wider">
              {currentLang === 'as' ? 'মঞ্চ সেৱা' : 'Navigation & Services'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer text-left font-bold text-[#FFD166]">
                  Curriculums & Study Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('features')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Student Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('how-it-works')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer text-left">
                  FAQ & Student Help
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About UniMitra
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Campus Team
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('admin')} className="text-[#FF7F50] font-bold hover:underline transition-colors cursor-pointer text-left">
                  Knowledge Base Admin ⚙️
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#FF7F50] uppercase tracking-wider">
              {currentLang === 'as' ? 'শৈক্ষিক বিশ্বাসযোগ্যতা' : 'Academic Integrity'}
            </h4>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-[#06D6A0] text-xs font-bold">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Verified Materials</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero hallucinated answers. Every topic is cited directly from official university syllabus documents.
              </p>
            </div>

            <div className="pt-1">
              <span className="text-xs text-slate-400 block">Languages:</span>
              <p className="text-xs font-bold text-white mt-0.5">
                অসমীয়া (Assamese) • English
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} UniMitra. Built for university students across Assam.
          </p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Academic Freedom</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
