import { useLocation, useNavigate } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  HomeIcon,
  ChatBubbleIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '../common/Icons';

export const DashboardSidebar = ({
  activeTab = 'overview',
  onSelectTab,
  onOpenAdmin,
  onSignOut,
  isOpen = false,
  onCloseMobile,
  currentLang = 'en',
  studentInfo = { role: 'Student' }
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFaculty = studentInfo?.role === 'Faculty Member';

  // Active tab derived from URL or activeTab prop
  const pathSegment = location.pathname.startsWith('/dashboard/')
    ? location.pathname.replace('/dashboard/', '').split('/')[0]
    : '';
  const effectiveTab = pathSegment || activeTab || 'overview';

  // Role-Specific Navigation Menu Items
  const studentMenuItems = [
    { id: 'overview', label: 'Institutional Overview', asLabel: 'প’ৰ্টেল সাৰাংশ', icon: HomeIcon },
    { id: 'assistant', label: 'Ask UniMitra AI', asLabel: 'দ্বিভাষিক AI সহায়ক', icon: ChatBubbleIcon },
    { id: 'regulations', label: 'University Regulations', asLabel: 'বিশ্ববিদ্যালয়ৰ নিয়মাৱলী', icon: BuildingLibraryIcon },
    { id: 'examinations', label: 'Examinations & Grading', asLabel: 'পৰীক্ষা আৰু মূল্যায়ন', icon: ClipboardDocumentCheckIcon },
    { id: 'admissions', label: 'Programs & Admissions', asLabel: 'পাঠ্যক্ৰম আৰু ভৰ্তি', icon: IdentificationIcon },
    { id: 'scholarships', label: 'Scholarships & Grants', asLabel: 'ছাত্ৰবৃত্তি আৰু অনুদান', icon: BanknotesIcon },
    { id: 'facilities', label: 'Campus Facilities', asLabel: 'চৌহদৰ সুবিধাসমূহ', icon: BuildingOfficeIcon },
    { id: 'history', label: 'Previous Queries', asLabel: 'পূৰ্বৰ বাৰ্তালাপ', icon: ClockIcon },
    { id: 'saved-answers', label: 'Saved Useful Answers', asLabel: 'সংৰক্ষিত উত্তৰসমূহ', icon: DocumentTextIcon },
    { id: 'feedback', label: 'Submit Feedback', asLabel: 'প্ৰতিক্ৰিয়া প্ৰেৰণ', icon: CheckCircleIcon },
    { id: 'profile', label: 'Student Profile', asLabel: 'ছাত্ৰ প্ৰফাইল', icon: UserIcon },
  ];

  const facultyMenuItems = [
    { id: 'overview', label: 'Faculty Academic Hub', asLabel: 'অধ্যাপক পৰিদৰ্শন কেন্দ্ৰ', icon: HomeIcon },
    { id: 'assistant', label: 'Faculty AI Workspace', asLabel: 'শৈক্ষিক AI সহায়ক', icon: ChatBubbleIcon },
    { id: 'regulations', label: 'Academic Regulations & Workload', asLabel: 'শৈক্ষিক নিয়মাৱলী আৰু কৰ্মভাৰ', icon: BuildingLibraryIcon },
    { id: 'faculty-exams', label: 'Examination Guidelines', asLabel: 'পৰীক্ষা আৰু মূল্যায়ন নিৰ্দেশনা', icon: ClipboardDocumentCheckIcon },
    { id: 'faculty-documents', label: 'Authorized Documents', asLabel: 'অনুমোদিত প্ৰতিষ্ঠানিক নথিপত্ৰ', icon: DocumentTextIcon },
    { id: 'faculty-saved', label: 'Saved Reference Circulars', asLabel: 'সংৰক্ষিত জাননীসমূহ', icon: DocumentTextIcon },
  ];

  const menuItems = isFaculty ? facultyMenuItems : studentMenuItems;

  const handleItemClick = (id) => {
    if (onSelectTab) onSelectTab(id);
    navigate(`/dashboard/${id}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogoClick = () => {
    if (onSelectTab) onSelectTab('overview');
    navigate('/dashboard/overview');
  };

  const handleAdminClick = () => {
    if (onOpenAdmin) onOpenAdmin();
    else navigate('/admin');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 dark:bg-[#150F2C]/95 backdrop-blur-xs border-r border-[#E0D4FD] dark:border-[#3B2868] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Upper Sidebar Section */}
        <div className="overflow-y-auto">
          {/* Logo Bar */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-[#E0D4FD] dark:border-[#3B2868]">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8F00FF] to-[#4C1D95] dark:from-[#4C1D95] dark:to-[#8F00FF] flex items-center justify-center text-white shadow-md border-2 border-[#E0D4FD] dark:border-[#B026FF]/50 dark:shadow-[0_0_12px_rgba(176,38,255,0.4)]">
                <BuildingLibraryIcon className="w-6 h-6 text-[#FAF8FF]" />
              </div>
              <div>
                <span className="text-xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                  Uni<span className="text-[#8F00FF] dark:text-[#00F5D4]">Mitra</span>
                </span>
                <span className="text-[10px] font-black text-[#6D28D9] dark:text-[#C4B5FD] block -mt-0.5 uppercase tracking-wider">
                  University Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#555375] hover:text-[#0F172A] dark:text-[#C4B5FD] dark:hover:text-[#FAF8FF] cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${isActive
                      ? 'bg-[#4C1D95] dark:bg-[#6D28D9] text-white shadow-xs dark:shadow-[0_0_12px_rgba(176,38,255,0.35)]'
                      : 'text-[#0F172A] dark:text-[#C4B5FD] hover:bg-[#E0D4FD]/35 dark:hover:bg-[#1F163D] hover:text-[#6D28D9] dark:hover:text-[#FAF8FF]'
                    }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FAF8FF]' : 'text-[#6D28D9] dark:text-[#00F5D4]'}`} />
                  <span className="truncate">{currentLang === 'as' ? item.asLabel : item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Actions */}
        <div className="p-4 border-t border-[#E0D4FD] dark:border-[#3B2868] space-y-2">
          {/* Admin Ingestion Console Access */}
          <button
            onClick={handleAdminClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] bg-[#DDD6FE]/40 dark:bg-[#1F163D] hover:bg-[#DDD6FE]/70 dark:hover:bg-[#281C50] transition-all cursor-pointer border border-[#E0D4FD] dark:border-[#3B2868]"
          >
            <span>{currentLang === 'as' ? 'প্ৰশাসন কেন্দ্ৰ' : 'Admin Console'}</span>
            <span className="text-[10px] uppercase font-mono font-black text-[#6D28D9] dark:text-[#00F5D4]">Ingest ⚙️</span>
          </button>

          {/* Secure Sign Out Action */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out from the university assistant?")) {
                if (onSignOut) onSignOut();
              }
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-black text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-red-200 dark:border-red-900/50"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
            <span>{currentLang === 'as' ? 'প’ৰ্টেলৰ পৰা লগ-আউট' : 'Sign Out of Portal'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
