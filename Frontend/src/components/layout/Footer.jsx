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
    <footer className="bg-[#15370D] text-[#FEFAF3] border-t-4 border-[#84A282] transition-colors duration-200">
      {/* Upper Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Institutional Brand Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => handleNav('home')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#84A282] to-[#B8CFB3] flex items-center justify-center text-white shadow-md border-2 border-[#84A282]/40">
                <BuildingLibraryIcon className="w-6 h-6 text-[#FEFAF3]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#FFF2B4]">
                Uni<span className="text-[#84A282]">Mitra</span>
              </span>
            </div>
            
            <p className="text-sm text-[#E5CD82] leading-relaxed max-w-sm">
              {currentLang === 'as' 
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক আৰু প্ৰশাসনিক তথ্য, নিয়ম, পৰীক্ষা, ছাত্ৰবৃত্তি আৰু ভৰ্তি প্ৰক্ৰিয়াৰ বাবে দ্বিভাষিক AI সহায়ক মঞ্চ। ছাত্ৰ-ছাত্ৰী, অধ্যাপক আৰু কৰ্মচাৰীসকলৰ বাবে প্ৰমাণিত সমাধান।'
                : 'A bilingual AI-powered institutional assistant enabling students, faculty members, and administrative staff across Assam to access verified university regulations, examinations, admissions, scholarships, and campus facilities in Assamese and English.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-black">
              <span className="bg-[#1C4412] text-[#FFF2B4] px-3 py-1.5 rounded-xl border border-[#728E6D]">
                Institutional Regulations
              </span>
              <span className="bg-[#1C4412] text-[#B8CFB3] px-3 py-1.5 rounded-xl border border-[#728E6D]">
                অসমীয়া + English
              </span>
              <span className="bg-[#1C4412] text-[#F6E2E9] px-3 py-1.5 rounded-xl border border-[#728E6D]">
                Verified Page Citations
              </span>
            </div>
          </div>

          {/* Col 3: Institutional Assistance Domains */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#FFF2B4] uppercase tracking-wider">
              {currentLang === 'as' ? 'শৈক্ষিক আৰু প্ৰশাসনিক সেৱা' : 'Information Domains'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E5CD82]/90">
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
            <h4 className="text-xs font-black text-[#84A282] uppercase tracking-wider">
              {currentLang === 'as' ? 'মঞ্চ সেৱা' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FEFAF3]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  Public Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  Services & Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  RAG Architecture & How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  FAQ & Knowledge Search
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  About UniMitra
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#FFF2B4] transition-colors cursor-pointer text-left">
                  Helpdesk & Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="text-[#F6E2E9] font-bold hover:underline transition-colors cursor-pointer text-left">
                  Document Ingestion Admin ⚙️
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#F6E2E9] uppercase tracking-wider">
              {currentLang === 'as' ? 'তথ্যৰ বিশ্বাসযোগ্যতা' : 'Integrity & Verification'}
            </h4>
            
            <div className="p-4 bg-[#1C4412] border border-[#728E6D] rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-[#FFF2B4]">
                <ShieldCheckIcon className="w-4 h-4 text-[#84A282]" />
                <span className="text-xs font-black">Zero Hallucination Policy</span>
              </div>
              <p className="text-[11px] text-[#E5CD82] leading-tight">
                All answers are grounded strictly in official university gazettes, statutes, and notices. No fabricated responses or unverified citations.
              </p>
            </div>

            <div className="text-[11px] text-[#E5CD82]/70 space-y-1">
              <p>Supported Universities across Assam:</p>
              <p className="font-semibold text-[#FEFAF3]">GU • DU • TU • AU • BU • ASTU • KBVSASU</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#728E6D]/50 bg-[#15370D] py-5">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E5CD82]">
          <p>
            © {new Date().getFullYear()} <span className="font-bold text-[#FFF2B4]">UniMitra</span>. Higher Education Institutional Assistant Platform.
          </p>
          <div className="flex items-center space-x-5 text-[11px]">
            <span className="text-[#B8CFB3]">Assamese (অসমীয়া) & English</span>
            <span>•</span>
            <span>State University Knowledge Base</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
