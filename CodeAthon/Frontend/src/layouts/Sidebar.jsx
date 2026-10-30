import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Headphones,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import Logo from '../components/shared/Logo';
import RoleBadge from '../components/shared/RoleBadge';
import ROUTES from '../constants/routes';
import { cn } from '../utils/cn';

/**
 * Master Sidebar Component
 * Strictly implements:
 * - 248px width
 * - 72px Logo header
 * - 40px nav items with 10px gap, 8px radius, 4px vertical gap
 * - Role-gated item rendering (OWNER, ADMIN, STAFF)
 */
export const Sidebar = ({ user, onLogout, className }) => {
  const role = user?.role || 'OWNER';
  const isOwner = role === 'OWNER';

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          path: ROUTES.DASHBOARD,
          icon: Home,
          visible: true,
        },
      ],
    },
    {
      label: 'BUSINESS',
      items: [
        {
          label: 'Parties',
          path: ROUTES.PARTIES,
          icon: Users,
          visible: true,
        },
        {
          label: 'Items & Catalog',
          path: ROUTES.ITEMS,
          icon: Package,
          visible: true,
        },
        {
          label: 'Invoices',
          path: ROUTES.BILLS,
          icon: FileText,
          visible: true,
        },
      ],
    },
    {
      label: 'MANAGEMENT',
      items: [
        {
          label: 'Team Members',
          path: ROUTES.USERS,
          icon: ShieldCheck,
          visible: isOwner,
        },
      ],
    },
    {
      label: 'SETTINGS',
      items: [
        {
          label: 'Shop Settings',
          path: ROUTES.SHOP_SETTINGS,
          icon: Settings,
          visible: isOwner,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'w-[248px] min-w-[248px] h-screen bg-[#08090C] dark:bg-[#08090C] light:bg-[#FFFFFF] border-r border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] flex flex-col justify-between select-none z-20 shrink-0 sticky top-0 transition-colors duration-150',
        className
      )}
    >
      {/* ─── Top Logo (68px) & Navigation List ─── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="h-[68px] min-h-[68px] px-4 flex items-center border-b border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC]">
          <Logo to={ROUTES.DASHBOARD} />
        </div>

        <nav className="p-3 space-y-4">
          {navGroups.map((group, gIdx) => {
            const visibleItems = group.items.filter((item) => item.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {group.label && (
                  <div className="px-3 text-[11px] font-semibold tracking-[0.08em] text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A] uppercase">
                    {group.label}
                  </div>
                )}

                <div className="space-y-1 pt-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            'group h-10 flex items-center justify-between px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer',
                            isActive
                              ? 'bg-[#11141A] dark:bg-[#11141A] light:bg-[#F4F5F7] text-[#6366F1] dark:text-[#818CF8] light:text-[#6366F1] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] shadow-xs'
                              : 'text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] hover:text-[#F5F7FA] dark:hover:text-[#F5F7FA] light:hover:text-[#18181B] hover:bg-[#151922] dark:hover:bg-[#151922] light:hover:bg-[#F4F5F7]'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={cn(
                                'w-[18px] h-[18px] transition-colors shrink-0',
                                isActive
                                  ? 'text-[#6366F1] dark:text-[#818CF8] light:text-[#6366F1]'
                                  : 'text-[#6F7785] group-hover:text-[#A1A8B3] dark:group-hover:text-[#F5F7FA] light:group-hover:text-[#18181B]'
                              )}
                            />
                            <span>{item.label}</span>
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* ─── Bottom Support Card & User Profile (Pinned via mt-auto) ─── */}
      <div className="mt-auto p-3 space-y-2.5 border-t border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] bg-[#08090C] dark:bg-[#08090C] light:bg-[#FFFFFF]">
        {/* Support Card */}
        <div className="p-3 rounded-xl bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] space-y-2">
          <div className="flex items-center gap-2 text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B]">
            <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-[#818CF8] dark:text-[#818CF8] light:text-[#6366F1]">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold leading-tight text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B]">Need Help?</h4>
              <p className="text-[10px] text-[#6F7785] dark:text-[#6F7785] light:text-[#71717A] leading-tight mt-0.5">
                GST rules & support
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-1.5 px-2 rounded-lg bg-[#11141A] dark:bg-[#11141A] light:bg-[#FFFFFF] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] hover:border-[#6366F1]/50 text-[11px] font-semibold text-[#A1A8B3] dark:text-[#A1A8B3] light:text-[#52525B] hover:text-[#F5F7FA] dark:hover:text-[#F5F7FA] light:hover:text-[#18181B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Get Support</span>
            <ArrowRight className="w-3 h-3 text-[#6366F1]" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center text-xs font-bold text-[#818CF8] shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] truncate leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="mt-0.5">
                <RoleBadge role={user?.role || 'OWNER'} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-[#6F7785] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
