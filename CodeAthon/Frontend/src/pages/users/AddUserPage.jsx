import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import userService from '../../services/user.service';
import PageHeader from '../../components/ui/PageHeader';
import UserForm from '../../features/users/components/UserForm';
import ROUTES from '../../constants/routes';

export const AddUserPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload) => userService.createUser(payload),
    onSuccess: () => {
      toast.success('Team member invited successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(ROUTES.USERS);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to create team member';
      toast.error(msg);
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Add Team Member"
        description="Provision access for a new administrator or billing staff member."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Users', href: ROUTES.USERS },
          { label: 'New Member' },
        ]}
      />

      <div className="p-8 rounded-xl bg-[#0D1017] border border-[#1E293F] shadow-sm">
        <UserForm
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate(ROUTES.USERS)}
        />
      </div>
    </div>
  );
};

export default AddUserPage;
