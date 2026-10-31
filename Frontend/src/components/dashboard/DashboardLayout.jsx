import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { HomeScreenBackground } from '../common/HomeScreenBackground';

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
    <div className={`relative min-h-screen bg-transparent text-[#000000] dark:text-[#FFFFFF] flex flex-col transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      {/* Universal Home Screen Background with Animated College Boy Looking to University */}
      <HomeScreenBackground />

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
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Top Dashboard Navbar */}
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentLang={currentLang}
          onToggleLang={onToggleLang}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          onNavigateAi={() => onSelectTab && onSelectTab('assistant')}
          studentInfo={studentInfo}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>

    </div>
  );
};
