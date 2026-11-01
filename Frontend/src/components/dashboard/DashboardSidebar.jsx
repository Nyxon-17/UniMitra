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

/**
 * Editorial + Aurora Dashboard Sidebar
 * Elegant editorial layout, generous vertical whitespace, hairline dividers, 
 * subtle aurora active indicators, and typography hierarchy.
 */
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
    { id: 'admissions', label: 'Programmes & Admissions', asLabel: 'পাঠ্যক্ৰম আৰু ভৰ্তি', icon: IdentificationIcon },
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
    if (id === 'assistant') {
      navigate('/dashboard/assistant');
      if (onSelectTab) onSelectTab('assistant');
      if (onCloseMobile) onCloseMobile();
      return;
    }
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
          className="fixed inset-0 bg-[#0B1518]/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F7F6F0]/95 dark:bg-[#0B1518]/95 backdrop-blur-md border-r border-[#123C3A]/10 dark:border-[#55C7B2]/15 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Upper Sidebar Section */}
        <div className="overflow-y-auto flex-1">
          {/* Editorial Masthead / Logo Bar */}
          <div className="flex items-center justify-between h-18 px-6 border-b border-[#123C3A]/10 dark:border-[#55C7B2]/15">
            <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={handleLogoClick}>
              <div className="w-9 h-9 rounded-xl bg-[#123C3A] dark:bg-[#55C7B2] flex items-center justify-center text-white dark:text-[#0B1518] shadow-xs">
                <BuildingLibraryIcon className="w-5 h-5 text-[#D4A96A] dark:text-[#0B1518]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-[#123C3A] dark:text-[#DCE8E4] font-heading block leading-none">
                  Uni<span className="text-[#D4A96A] dark:text-[#55C7B2]">Mitra</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest text-[#627680] dark:text-[#879B99] block mt-1 uppercase font-sans">
                  Academic Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#627680] hover:text-[#123C3A] dark:text-[#879B99] dark:hover:text-[#DCE8E4] transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items with Editorial Aurora Polish */}
          <nav className="p-3.5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer font-sans ${
                    isActive
                      ? 'bg-[#123C3A] text-white dark:bg-[#142426] dark:text-[#55C7B2] dark:border dark:border-[#55C7B2]/25 shadow-xs'
                      : 'text-[#273B45] dark:text-[#DCE8E4]/80 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] hover:text-[#123C3A] dark:hover:text-[#55C7B2]'
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive 
                        ? 'text-[#D4A96A] dark:text-[#55C7B2]' 
                        : 'text-[#123C3A]/60 dark:text-[#879B99]'
                    }`} 
                  />
                  <span className="truncate">{currentLang === 'as' ? item.asLabel : item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Actions with Hairline Divider */}
        <div className="p-3.5 border-t border-[#123C3A]/10 dark:border-[#55C7B2]/15 space-y-1.5">
          {/* Admin Ingestion Console Access */}
          <button
            onClick={handleAdminClick}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#123C3A] dark:text-[#DCE8E4] bg-[#E9F0ED]/70 dark:bg-[#142426]/70 hover:bg-[#E9F0ED] dark:hover:bg-[#142426] transition-all cursor-pointer border border-[#123C3A]/10 dark:border-[#55C7B2]/15"
          >
            <span>{currentLang === 'as' ? 'প্ৰশাসন কেন্দ্ৰ' : 'Admin Console'}</span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4A96A] dark:text-[#55C7B2]">RAG ⚙️</span>
          </button>

          {/* Secure Sign Out Action */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out from the university assistant?")) {
                if (onSignOut) onSignOut();
              }
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors cursor-pointer border border-red-200/60 dark:border-red-900/40"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
            <span>{currentLang === 'as' ? 'প’ৰ্টেলৰ পৰা লগ-আউট' : 'Sign Out of Portal'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
