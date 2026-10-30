import React from 'react';
import { Shield, ShieldAlert, User } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * RoleBadge Component
 *
 * OWNER -> Indigo highlight
 * ADMIN -> Amber/Gold highlight
 * STAFF -> Slate/Zinc highlight
 */
export const RoleBadge = ({ role, className }) => {
  const normalized = (role || 'STAFF').toUpperCase();

  const configs = {
    OWNER: {
      label: 'Owner',
      icon: ShieldAlert,
      styles: 'bg-[#6366F1]/10 text-[#818CF8] border-[#6366F1]/30',
    },
    ADMIN: {
      label: 'Admin',
      icon: Shield,
      styles: 'bg-[#F59E0B]/10 text-[#FBBF24] border-[#F59E0B]/30',
    },
    STAFF: {
      label: 'Staff',
      icon: User,
      styles: 'bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]',
    },
  };

  const config = configs[normalized] || configs.STAFF;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide border uppercase',
        config.styles,
        className
      )}
    >
      <Icon className="w-3 h-3 stroke-[2]" />
      {config.label}
    </span>
  );
};

export default RoleBadge;
