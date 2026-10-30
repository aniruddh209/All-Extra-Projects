import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ROUTES from '../constants/routes';

/**
 * RoleRoute Guard
 * Restricts route access to specified roles (e.g. OWNER only).
 * Non-matching roles receive a 403 redirect.
 */
export const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
