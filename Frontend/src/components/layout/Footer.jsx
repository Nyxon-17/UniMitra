import { useNavigate } from 'react-router-dom';
import { BuildingLibraryIcon, ShieldCheckIcon, ClipboardDocumentCheckIcon, BanknotesIcon, BuildingOfficeIcon } from '../common/Icons';

export const Footer = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const navigate = useNavigate();

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (page === 'home') navigate('/');
    else if (page === 'dashboard') navigate('/dashboard/overview');
    else if (page === 'admin') navigate('/admin');
    else if (page === 'auth') navigate('/auth');
    else navigate(`/${page}`);
  };

  return (
    <footer className="bg-[#0F172A] text-[#FAF8FF] border-t-4 border-[#6D28D9] transition-colors duration-200">
      {/* Upper Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Institutional Brand Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => handleNav('home')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#E0D4FD] flex items-center justify-center text-white shadow-md border-2 border-[#6D28D9]/40">
                <BuildingLibraryIcon className="w-6 h-6 text-[#FAF8FF]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#FAF8FF]">
                Uni<span className="text-[#8F00FF]">Mitra</span>
              </span>
            </div>
            
            <p className="text-sm text-[#C4B5FD] leading-relaxed max-w-sm">
              {currentLang === 'as' 
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য, নিয়ম, পৰীক্ষা, ছাত্ৰবৃত্তি আৰু ভৰ্তি প্ৰক্ৰিয়াৰ বাবে দ্বিভাষিক AI সহায়ক মঞ্চ। ছাত্ৰ-ছাত্ৰী, অধ্যাপক আৰু কৰ্মচাৰীসকলৰ বাবে প্ৰমাণিত সমাধান।'
                : 'A bilingual AI-powered institutional assistant enabling students, faculty members, and administrative staff across Assam to access verified university regulations, examinations, admissions, scholarships, and campus facilities in Assamese and English.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-black">
              <span className="bg-[#150F2C] text-[#FAF8FF] px-3 py-1.5 rounded-xl border border-[#3B2868]">
                Institutional Regulations
              </span>
              <span className="bg-[#150F2C] text-[#E0D4FD] px-3 py-1.5 rounded-xl border border-[#3B2868]">
                অসমীয়া + English
              </span>
              <span className="bg-[#150F2C] text-[#DDD6FE] px-3 py-1.5 rounded-xl border border-[#3B2868]">
                Verified Page Citations
              </span>
            </div>
          </div>

          {/* Col 3: Institutional Assistance Domains */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#FAF8FF] uppercase tracking-wider">
              {currentLang === 'as' ? 'শৈক্ষিক আৰু প্ৰশাসনিক সেৱা' : 'Information Domains'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C4B5FD]/90">
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                University Regulations & Ordinances
              </li>
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                Examination Guidelines & Evaluation Rules
              </li>
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                Academic Programs & Eligibility
              </li>
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                Scholarships & Financial Grants
              </li>
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                Admission Procedures & Cut-offs
              </li>
              <li onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">
                Campus Facilities, Hostels & Health Centers
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#6D28D9] uppercase tracking-wider">
              {currentLang === 'as' ? 'মঞ্চ সেৱা' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FAF8FF]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  Public Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  Services & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  RAG Architecture & How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  FAQ & Knowledge Search
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  About UniMitra
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#FAF8FF] transition-colors cursor-pointer text-left">
                  Helpdesk & Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="text-[#DDD6FE] font-bold hover:underline transition-colors cursor-pointer text-left">
                  Document Ingestion Admin ⚙️
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#DDD6FE] uppercase tracking-wider">
              {currentLang === 'as' ? 'তথ্যৰ বিশ্বাসযোগ্যতা' : 'Integrity & Verification'}
            </h4>
            
            <div className="p-4 bg-[#150F2C] border border-[#3B2868] rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-[#FAF8FF]">
                <ShieldCheckIcon className="w-4 h-4 text-[#6D28D9]" />
                <span className="text-xs font-black">Zero Hallucination Policy</span>
              </div>
              <p className="text-[11px] text-[#C4B5FD] leading-tight">
                All answers are grounded strictly in official university gazettes, statutes, and notices. No fabricated responses or unverified citations.
              </p>
            </div>

            <div className="text-[11px] text-[#C4B5FD]/70 space-y-1">
              <p>Supported Universities across Assam:</p>
              <p className="font-semibold text-[#FAF8FF]">GU • DU • TU • AU • BU • ASTU • KBVSASU</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3B2868]/50 bg-[#0F172A] py-5">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#C4B5FD]">
          <p>
            © {new Date().getFullYear()} <span className="font-bold text-[#FAF8FF]">UniMitra</span>. Higher Education Institutional Assistant Platform.
          </p>
          <div className="flex items-center space-x-5 text-[11px]">
            <span className="text-[#E0D4FD]">Assamese (অসমীয়া) & English</span>
            <span>•</span>
            <span>State University Knowledge Base</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
