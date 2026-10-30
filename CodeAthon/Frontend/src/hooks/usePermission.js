import { useAuth } from './useAuth';
import ROLES from '../constants/roles';

/**
 * Custom hook for UI role permission checking.
 * Note: Frontend role checks adapt UX only; backend enforces actual authorization.
 */
export const usePermission = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';

  const isOwner = role === ROLES.OWNER;
  const isAdmin = role === ROLES.ADMIN;
  const isStaff = role === ROLES.STAFF;
  const isAdminOrOwner = isOwner || isAdmin;

  /**
   * Check if current user possesses one of the allowed roles.
   * @param {...string} allowedRoles
   * @returns {boolean}
   */
  const hasRole = (...allowedRoles) => {
    return allowedRoles.includes(role);
  };

  return {
    role,
    isOwner,
    isAdmin,
    isStaff,
    isAdminOrOwner,
    hasRole,

    // Specific capability flags matching official matrix
    canViewDashboard: true,
    canManageShopSettings: isOwner,
    canManageUsers: isOwner,
    canCreateParty: true,
    canEditParty: isAdminOrOwner,
    canDeleteParty: isAdminOrOwner,
    canCreateItem: isAdminOrOwner,
    canEditItem: isAdminOrOwner,
    canDeleteItem: isAdminOrOwner,
    canCreateBill: true,
    canViewBills: true,
    canDownloadPdf: true,
    canEmailInvoice: true,
  };
};

export default usePermission;
