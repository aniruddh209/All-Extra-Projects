/**
 * GSTBilling PRO — Design System JavaScript Constants
 * Programmatic tokens for charts, dynamic inline calculations, and layout bounds
 */

export const SPACING = {
  MICRO: 4,      // 4px: micro spacing, small badges
  ICON_TEXT: 8,  // 8px: icon to text gap
  COMPACT: 12,   // 12px: compact toolbar gap
  NORMAL: 16,    // 16px: standard component spacing
  CARD: 20,      // 20px: form/card padding
  SECTION: 24,   // 24px: standard section gap
  MAJOR: 32,     // 32px: major section gap
  PAGE: 40,      // 40px: page section separation
  LARGE: 48,     // 48px: large separation
  XLARGE: 56,    // 56px: extra large separation
  VISUAL: 64,    // 64px: major visual separation
  HERO: 80,      // 80px: hero spacing
  HERO_MAX: 96,  // 96px: exceptional hero spacing
};

export const LAYOUT = {
  SIDEBAR_WIDTH: 248,
  SIDEBAR_COLLAPSED_WIDTH: 72,
  TOPBAR_HEIGHT: 68,
  TOPBAR_MOBILE_HEIGHT: 60,
  MAX_PAGE_WIDTH: 1440,
  NORMAL_FORM_WIDTH: 1100,
  COMPACT_FORM_WIDTH: 760,
  AUTH_CARD_MAX_WIDTH: 440,
  INVOICE_SHEET_MAX_WIDTH: 1100,
};

export const BREAKPOINTS = {
  XS: 390,
  PHONE: 430,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1440,
  MAX: 1600,
};

export const Z_INDEX = {
  BASE: 0,
  STICKY: 10,
  SIDEBAR: 20,
  TOPBAR: 30,
  DROPDOWN: 40,
  POPOVER: 50,
  MODAL: 60,
  TOAST: 70,
};

export const COLORS = {
  dark: {
    background: '#050608',
    main: '#08090C',
    sidebar: '#08090C',
    topbar: '#08090C',
    surface: '#0D0F13',
    surfaceElevated: '#11141A',
    surfaceHover: '#151922',
    border: '#20242D',
    borderStrong: '#2B303A',
    textPrimary: '#F5F7FA',
    textSecondary: '#A1A8B3',
    textMuted: '#6F7785',
    textDisabled: '#474E5B',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  light: {
    background: '#F7F8FA',
    main: '#FFFFFF',
    sidebar: '#FFFFFF',
    topbar: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFB',
    surfaceHover: '#F4F5F7',
    border: '#E4E7EC',
    borderStrong: '#D0D5DD',
    textPrimary: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    textDisabled: '#A1A1AA',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};
