import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ROUTES from '../constants/routes';
import ROLES from '../constants/roles';
import AuthLayout from '../layouts/AuthLayout';
import AppShell from '../layouts/AppShell';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';

import PartiesPage from '../pages/parties/PartiesPage';
import AddPartyPage from '../pages/parties/AddPartyPage';
import EditPartyPage from '../pages/parties/EditPartyPage';
import PartyDetailsPage from '../pages/parties/PartyDetailsPage';

import ItemsPage from '../pages/items/ItemsPage';
import AddItemPage from '../pages/items/AddItemPage';
import EditItemPage from '../pages/items/EditItemPage';

import BillsPage from '../pages/bills/BillsPage';
import CreateBillPage from '../pages/bills/CreateBillPage';
import BillDetailsPage from '../pages/bills/BillDetailsPage';

import UsersPage from '../pages/users/UsersPage';
import AddUserPage from '../pages/users/AddUserPage';
import EditUserPage from '../pages/users/EditUserPage';

import ShopSettingsPage from '../pages/shop/ShopSettingsPage';

import ForbiddenPage from '../pages/ForbiddenPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRouter = ({ user, shop, onLogout }) => {
  return (
    <Routes>
      {/* ─── Default Route Redirect ─── */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ─── Public Authentication Routes (Guarded by PublicRoute) ─── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* ─── Protected Application Routes (Guarded by ProtectedRoute) ─── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell user={user} shop={shop} onLogout={onLogout} />}>
          {/* Dashboard (OWNER, ADMIN, and STAFF) */}
          <Route element={<RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF]} />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          </Route>

          {/* Business Modules: Parties */}
          <Route path={ROUTES.PARTIES} element={<PartiesPage />} />
          <Route path={ROUTES.ADD_PARTY} element={<AddPartyPage />} />
          <Route path="/parties/:id" element={<PartyDetailsPage />} />
          <Route element={<RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]} />}>
            <Route path={ROUTES.EDIT_PARTY} element={<EditPartyPage />} />
          </Route>

          {/* Business Modules: Items */}
          <Route path={ROUTES.ITEMS} element={<ItemsPage />} />
          <Route element={<RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]} />}>
            <Route path={ROUTES.ADD_ITEM} element={<AddItemPage />} />
            <Route path={ROUTES.EDIT_ITEM} element={<EditItemPage />} />
          </Route>

          {/* Business Modules: Bills & Invoices */}
          <Route path={ROUTES.BILLS} element={<BillsPage />} />
          <Route path={ROUTES.CREATE_BILL} element={<CreateBillPage />} />
          <Route path="/bills/:id" element={<BillDetailsPage />} />

          {/* Management: Users & Team (OWNER only) */}
          <Route element={<RoleRoute allowedRoles={[ROLES.OWNER]} />}>
            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path="/users/new" element={<AddUserPage />} />
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Route>

          {/* Management: Shop Settings (OWNER only) */}
          <Route element={<RoleRoute allowedRoles={[ROLES.OWNER]} />}>
            <Route path={ROUTES.SHOP_SETTINGS} element={<ShopSettingsPage />} />
            <Route path="/settings/shop" element={<ShopSettingsPage />} />
          </Route>

          {/* 403 Forbidden inside application shell */}
          <Route path="/403" element={<ForbiddenPage />} />
        </Route>
      </Route>

      {/* ─── 404 Not Found ─── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
