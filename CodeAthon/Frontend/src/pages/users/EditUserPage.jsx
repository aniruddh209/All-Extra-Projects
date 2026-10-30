import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import userService from '../../services/user.service';
import PageHeader from '../../components/ui/PageHeader';
import UserForm from '../../features/users/components/UserForm';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import ROUTES from '../../constants/routes';

export const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: Boolean(id),
  });

  const user = data?.data?.user || data?.user || data?.data;

  const updateMutation = useMutation({
    mutationFn: (payload) => userService.updateUser(id, payload),
    onSuccess: () => {
      toast.success('Team member updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate(ROUTES.USERS);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update user';
      toast.error(msg);
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={user ? `Edit ${user.name}` : 'Edit Member'}
        description="Update member name, role permissions, or credentials."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Users', href: ROUTES.USERS },
          { label: 'Edit Member' },
        ]}
      />

      <div className="p-8 rounded-xl bg-[#0D1017] border border-[#1E293F] shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ) : isError || !user ? (
          <ErrorState
            title="User not found"
            message="Unable to load the requested team member details."
            onRetry={() => refetch()}
          />
        ) : (
          <UserForm
            initialValues={user}
            onSubmit={(data) => updateMutation.mutate(data)}
            isSubmitting={updateMutation.isPending}
            onCancel={() => navigate(ROUTES.USERS)}
          />
        )}
      </div>
    </div>
  );
};

export default EditUserPage;
