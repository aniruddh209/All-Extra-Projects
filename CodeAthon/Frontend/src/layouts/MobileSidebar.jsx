import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';
import Logo from '../components/shared/Logo';
import RoleBadge from '../components/shared/RoleBadge';
import ROUTES from '../constants/routes';
import { cn } from '../utils/cn';

export const MobileSidebar = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  const role = user?.role || 'STAFF';
  const isOwner = role === 'OWNER';
  const isAdminOrOwner = role === 'OWNER' || role === 'ADMIN';

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          path: ROUTES.DASHBOARD,
          icon: LayoutDashboard,
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
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-72 bg-[#090909] dark:bg-[#090909] light:bg-[#FAFAFA] border-r border-[#222222] dark:border-[#222222] light:border-[#E4E4E7] flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C] dark:border-[#1C1C1C] light:border-[#E4E4E7]">
            <Logo to={ROUTES.DASHBOARD} />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#F5F5F5] hover:bg-[#151515] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-4 space-y-6">
            {navGroups.map((group) => {
              const visibleItems = group.items.filter((item) => item.visible);
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.label} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold tracking-wider text-[#71717A] uppercase">
                    {group.label}
                  </div>

                  <div className="space-y-1 pt-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                              isActive
                                ? 'bg-[#151515] text-[#F5F5F5] border border-[#252525]'
                                : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#121212]'
                            )
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-3 border-t border-[#1C1C1C]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101010] border border-[#202020]">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F5F5F5] truncate">
                {user?.name || 'Authorized User'}
              </p>
              <div className="mt-0.5">
                <RoleBadge role={user?.role} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="p-1.5 rounded text-[#71717A] hover:text-[#EF4444]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
