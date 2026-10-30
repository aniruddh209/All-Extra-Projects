import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

import userService from '../../services/user.service';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import UserTable from '../../features/users/components/UserTable';
import { useAuth } from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export const UsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const users = data?.data?.users || data?.users || (Array.isArray(data?.data) ? data.data : []);

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => userService.toggleStatus(id, isActive),
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update user status';
      toast.error(msg);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('User removed from organization');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to delete user';
      toast.error(msg);
      setUserToDelete(null);
    },
  });

  const handleToggleStatus = (user) => {
    statusMutation.mutate({
      id: user._id,
      isActive: !user.isActive,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        description="Invite and manage administrators and staff who access your billing portal."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Users' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh team list"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/users/new')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Member
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1017] border border-[#1E293F] shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by member name or email..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#94A3B8] px-3 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48]">
          <UsersIcon className="w-4 h-4 text-[#818CF8]" />
          <span className="font-semibold text-[#F8FAFC]">{filteredUsers.length}</span>
          <span>registered members</span>
        </div>
      </div>

      <div className="rounded-xl bg-[#0D1017] border border-[#1E293F] shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-8">
            <ErrorState
              title="Unable to load team members"
              message="An error occurred while fetching user accounts."
              onRetry={() => refetch()}
            />
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            currentUserId={currentUser?._id}
            isLoading={isLoading}
            onToggleStatus={handleToggleStatus}
            onDelete={(user) => setUserToDelete(user)}
            onAddUser={() => navigate('/users/new')}
          />
        )}
      </div>

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${userToDelete?.name}" (${userToDelete?.email})? They will immediately lose access to the portal.`}
        confirmLabel="Remove Member"
        cancelLabel="Keep Member"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => userToDelete?._id && deleteMutation.mutate(userToDelete._id)}
        onClose={() => setUserToDelete(null)}
      />
    </div>
  );
};

export default UsersPage;
