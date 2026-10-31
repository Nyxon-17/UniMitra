import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';

export const DashboardLayout = ({ 
  children, 
  activeTab = 'overview', 
  onSelectTab, 
  onOpenAdmin,
  onSignOut,
  currentLang = 'en', 
  onToggleLang, 
  isDark = false, 
  onToggleTheme, 
  studentInfo
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] flex flex-col transition-colors duration-200">
      
      {/* Fixed Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenAdmin={onOpenAdmin}
        onSignOut={onSignOut}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        currentLang={currentLang}
        studentInfo={studentInfo}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        
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
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};
