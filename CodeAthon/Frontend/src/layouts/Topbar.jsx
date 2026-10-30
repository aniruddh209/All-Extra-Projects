import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  Calendar,
  Search,
  Building2,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react';
import RoleBadge from '../components/shared/RoleBadge';
import ThemeToggle from '../components/shared/ThemeToggle';
import ROUTES from '../constants/routes';
import { cn } from '../utils/cn';

export const Topbar = ({ onMenuClick, user, shop, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (pathname) => {
    if (pathname === ROUTES.DASHBOARD) return 'Dashboard';
    if (pathname.startsWith('/parties/new')) return 'Add Customer';
    if (pathname.includes('/parties/') && pathname.endsWith('/edit')) return 'Edit Customer';
    if (pathname.startsWith('/parties/')) return 'Customer Details';
    if (pathname.startsWith('/parties')) return 'Parties';
    if (pathname.startsWith('/items/new')) return 'Add Item';
    if (pathname.includes('/items/') && pathname.endsWith('/edit')) return 'Edit Item';
    if (pathname.startsWith('/items')) return 'Items & Catalog';
    if (pathname.startsWith('/bills/new')) return 'Create Invoice';
    if (pathname.startsWith('/bills/')) return 'Invoice Details';
    if (pathname.startsWith('/bills')) return 'Invoices';
    if (pathname.startsWith('/users')) return 'Team Members';
    if (pathname.startsWith('/shop-settings') || pathname.startsWith('/settings')) return 'Shop Settings';
    return 'GST Billing';
  };

  const title = getPageTitle(location.pathname);
  const businessName = shop?.name || shop?.businessName || 'IMS';
  const shopState = shop?.state || 'Arunachal Pradesh';

  // Format today's date nicely for the topbar date selector
  const todayDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="h-[68px] min-h-[68px] bg-[#08090C]/95 dark:bg-[#08090C]/95 light:bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] px-6 sm:px-7 flex items-center justify-between sticky top-0 z-30 transition-colors duration-150">
      {/* ─── Left: Mobile Menu Trigger + Title + Shop Chip ─── */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-[#6F7785] hover:text-[#F5F7FA] hover:bg-[#151922] transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] truncate">
            {title}
          </h1>

          {/* Business & State Pill Chip */}
          <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] text-xs text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] shrink-0">
            <Building2 className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="font-semibold text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] truncate max-w-[140px]">
              {businessName}
            </span>
            <span className="text-[#6F7785]">•</span>
            <div className="flex items-center gap-1 text-[11px] text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A]">
              <MapPin className="w-2.5 h-2.5 text-[#6366F1]" />
              <span>{shopState}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right: Date Selector + Search Bar + Theme Toggle + User Profile ─── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date Selector Pill (width: ~160px) */}
        <div className="hidden xl:flex items-center justify-between w-[160px] px-3 py-1.5 rounded-lg bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] text-xs text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] transition-colors">
          <div className="flex items-center gap-2 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
            <span className="font-medium truncate">{todayDateStr}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-[#6F7785] shrink-0 ml-1" />
        </div>

        {/* Global Search Bar (width: 240-320px with min-width: 0) */}
        <div className="hidden md:flex items-center relative min-w-0">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#6F7785]" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 lg:w-60 min-w-0 pl-8 pr-8 py-1.5 rounded-lg bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] text-xs text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] placeholder-[#6F7785] focus:outline-none focus:border-[#6366F1] focus:w-64 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 rounded bg-[#11141A] dark:bg-[#11141A] light:bg-[#F4F5F7] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] text-[10px] text-[#6F7785] font-mono">
            ⌘ K
          </kbd>
        </div>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-[#0D0F13] dark:hover:bg-[#0D0F13] light:hover:bg-[#FAFAFB] border border-transparent hover:border-[#20242D] dark:hover:border-[#20242D] light:hover:border-[#E4E7EC] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center text-xs font-bold text-[#818CF8]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>

            <div className="hidden sm:flex flex-col text-left max-w-[140px]">
              <span className="text-xs font-semibold text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] leading-tight truncate">
                {user?.name || 'Anirudh'}
              </span>
              <span className="text-[10px] text-[#6F7785] uppercase tracking-wider font-mono leading-none truncate">
                {user?.role || 'OWNER'}
              </span>
            </div>

            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-[#6F7785] transition-transform duration-150 hidden sm:block',
                dropdownOpen && 'rotate-180 text-[#F5F7FA]'
              )}
            />
          </button>

          {/* Profile Menu Popover */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111625] border border-[#1E293F] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-[#1E293F]">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Anirudh'}
                </p>
                <p className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-mono">
                  {user?.email || 'anirudh@example.com'}
                </p>
                <div className="mt-2">
                  <RoleBadge role={user?.role || 'OWNER'} />
                </div>
              </div>

              <div className="py-1">
                {user?.role === 'OWNER' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(ROUTES.SHOP_SETTINGS);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#182138] transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                    Shop Settings
                  </button>
                )}
              </div>

              <div className="pt-1 border-t border-[#1E293F]">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
