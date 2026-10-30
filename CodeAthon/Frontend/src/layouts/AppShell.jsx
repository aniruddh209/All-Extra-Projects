import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Topbar from './Topbar';

/**
 * AppShell Layout Component
 * Strictly implements the Global Application Shell geometry:
 * - Fixed 248px Sidebar
 * - Fixed 64px Topbar
 * - Controlled max-width: 1600px content area
 * - Responsive screen padding tiers (16px to 32px)
 */
export const AppShell = ({ user, shop, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-[#050608] dark:bg-[#050608] light:bg-[#F7F8FA] flex text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] font-sans antialiased transition-colors duration-150">
      {/* 1. Desktop & Tablet Sidebar (Exactly 248px) */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        className="hidden lg:flex shrink-0 w-[248px] min-w-[248px]"
      />

      {/* 2. Mobile Drawer Sidebar (Max 280px / 85vw) */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[100dvh]">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
          shop={shop}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050608] dark:bg-[#050608] light:bg-[#F7F8FA] transition-colors duration-150">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
