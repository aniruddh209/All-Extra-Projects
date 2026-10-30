/**
 * Route path constants.
 * Single source of truth for all frontend route paths.
 * Used in AppRouter, navigation links, and programmatic navigation.
 */
const ROUTES = {
  // Public
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  RESET_PASSWORD: '/reset-password',

  // Protected Business
  DASHBOARD: '/dashboard',
  PARTIES: '/parties',
  ADD_PARTY: '/parties/new',
  PARTY_DETAILS: '/parties/:id',
  EDIT_PARTY: '/parties/:id/edit',
  ITEMS: '/items',
  ADD_ITEM: '/items/new',
  EDIT_ITEM: '/items/:id/edit',
  BILLS: '/bills',
  CREATE_BILL: '/bills/new',
  BILL_DETAILS: '/bills/:id',

  // Protected Management (OWNER)
  USERS: '/users',
  ADD_USER: '/users/new',
  EDIT_USER: '/users/:id/edit',
  SHOP_SETTINGS: '/shop-settings',
  SETTINGS_SHOP: '/settings/shop',
};

export default ROUTES;
