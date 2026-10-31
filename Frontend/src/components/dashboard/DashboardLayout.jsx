import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';

export const DashboardLayout = ({ 
  children, 
  activeTab = 'overview', 
  onSelectTab, 
  onExitDashboard, 
  onSignOut,
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme,
  studentInfo
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0B1320] text-[#073B4C] dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Fixed Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onExitDashboard={onExitDashboard}
        onSignOut={onSignOut}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        currentLang={currentLang}
        studentInfo={studentInfo}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-68 flex-1 flex flex-col min-w-0">
        
        {/* Top Dashboard Navbar */}
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentLang={currentLang}
          onToggleLang={onToggleLang}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          onNavigateAi={() => onSelectTab('assistant')}
          studentInfo={studentInfo}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

