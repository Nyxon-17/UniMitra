import { 
  AcademicCapIcon, 
  HomeIcon, 
  ChatBubbleIcon, 
  BookOpenIcon, 
  BookmarkIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  XMarkIcon 
} from '../common/Icons';

export const DashboardSidebar = ({ 
  activeTab = 'overview', 
  onSelectTab, 
  onExitDashboard,
  onSignOut,
  isOpen = false,
  onCloseMobile,
  currentLang = 'en',
  studentInfo = { name: 'Student', course: 'All Curriculums' }
}) => {
  const menuItems = [
    { id: 'overview', label: 'Study Overview', asLabel: 'অধ্যয়ন সাৰাংশ', icon: HomeIcon },
    { id: 'assistant', label: 'Ask UniMitra AI', asLabel: 'সহায়কৰ লগত বাৰ্তালাপ', icon: ChatBubbleIcon },
    { id: 'syllabus', label: 'Syllabus Explorer', asLabel: 'পাঠ্যক্ৰম অন্বেষণ', icon: BookOpenIcon },
    { id: 'saved', label: 'Bookmarks & Saved', asLabel: 'সংৰক্ষিত বিষয়সমূহ', icon: BookmarkIcon },
    { id: 'profile', label: 'Student Profile', asLabel: 'ছাত্ৰ প্ৰফাইল', icon: UserIcon },
  ];

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 bg-white dark:bg-[#111C2E] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Upper Sidebar Section */}
        <div>
          {/* Logo Bar */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSelectTab('overview')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-white shadow-md border border-[#118AB2]/30">
                <AcademicCapIcon className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <span className="text-xl font-black text-[#073B4C] dark:text-white">
                  Uni<span className="text-[#FF7F50]">Mitra</span>
                </span>
                <span className="text-[10px] font-bold text-[#06D6A0] block -mt-0.5 uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Universal Study Access Card */}
          <div className="p-3.5 mx-4 my-3 bg-gradient-to-tr from-[#118AB2]/10 via-[#06D6A0]/10 to-transparent border border-[#118AB2]/20 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-black text-[#118AB2] dark:text-[#06D6A0] uppercase tracking-wider mb-0.5">
              <span>{currentLang === 'as' ? 'উন্মুক্ত শৈক্ষিক প্ৰৱেশ' : 'Open Study Access'}</span>
              <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse"></span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {currentLang === 'as' ? 'সকলো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম' : 'All University Curriculums'}
            </h4>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#118AB2] text-white shadow-elevated-cerulean'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FFD166]' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="truncate">{currentLang === 'as' ? item.asLabel : item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Back to Public Site */}
          <button
            onClick={onExitDashboard}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>{currentLang === 'as' ? 'মূল ৱেবছাইটলৈ যাওক' : 'Exit to Public Site'}</span>
            <span className="text-xs text-[#118AB2] dark:text-[#FFD166]">➔</span>
          </button>

          {/* Sign Out Action */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to sign out?")) {
                if (onSignOut) {
                  onSignOut();
                } else {
                  onExitDashboard();
                }
              }
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
            <span>{currentLang === 'as' ? 'লগ-আউট' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

