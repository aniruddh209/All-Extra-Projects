import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Segmented Pill Theme Switcher matching reference design
 * Displays both Sun and Moon inside a pill with active pill highlight
 */
export const ThemeToggle = ({ className = '' }) => {
  const { isDark, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-[#0D0F13] dark:bg-[#0D0F13] light:bg-[#FAFAFB] border border-[#20242D] dark:border-[#20242D] light:border-[#E4E7EC] ${className}`}
      role="radiogroup"
      aria-label="Theme switcher"
    >
      {/* Light option */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
          !isDark
            ? 'bg-[#FFFFFF] text-[#18181B] shadow-xs border border-[#E4E7EC]'
            : 'text-[#6F7785] hover:text-[#18181B]'
        }`}
        title="Switch to Light Theme"
        aria-label="Light mode"
      >
        <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
      </button>

      {/* Dark option */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
          isDark
            ? 'bg-[#151922] text-[#F5F7FA] shadow-xs'
            : 'text-[#6F7785] hover:text-[#F5F7FA]'
        }`}
        title="Switch to Dark Theme"
        aria-label="Dark mode"
      >
        <Moon className="w-3.5 h-3.5 text-[#6366F1]" />
      </button>
    </div>
  );
};

export default ThemeToggle;
