import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { AuroraBackground } from '../common/AuroraBackground';

/**
 * Editorial + Aurora Dashboard Layout
 * High-end spatial canvas, soft flowing aurora effects, thin hairline boundaries,
 * and generous whitespace.
 */
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
    <div className={`relative min-h-screen bg-[#F7F6F0] dark:bg-[#0B1518] text-[#273B45] dark:text-[#DCE8E4] flex flex-col transition-colors duration-300 font-sans ${isDark ? 'dark' : ''}`}>
      {/* Editorial + Aurora Atmospheric Ambient Background */}
      <AuroraBackground />

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
      <div className={`lg:pl-72 flex-1 flex flex-col min-w-0 relative z-10 ${activeTab === 'assistant' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''}`}>
        
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

        {/* Dynamic Viewport with Responsive Padding & Whitespace */}
        <main className={`flex-1 min-h-0 ${activeTab === 'assistant' ? 'p-1.5 sm:p-3 md:p-4 overflow-hidden flex flex-col' : 'p-5 sm:p-8 lg:p-10 overflow-y-auto'}`}>
          <div className="w-full max-w-7xl mx-auto h-full flex flex-col min-h-0">
            {children || <Outlet />}
          </div>
        </main>
      </div>

    </div>
  );
};
