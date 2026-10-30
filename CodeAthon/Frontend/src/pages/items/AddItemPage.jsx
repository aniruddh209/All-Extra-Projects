import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import itemService from '../../services/item.service';
import PageHeader from '../../components/ui/PageHeader';
import ItemForm from '../../features/items/components/ItemForm';
import ROUTES from '../../constants/routes';

export const AddItemPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload) => itemService.createItem(payload),
    onSuccess: () => {
      toast.success('Item added to catalog successfully');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate(ROUTES.ITEMS);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to create item';
      toast.error(msg);
    },
  });

  return (
    <div className="max-w-[760px] mx-auto space-y-6">
      <PageHeader
        title="Add New Item"
        description="Register a new product or service into your inventory catalog."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Items', href: ROUTES.ITEMS },
          { label: 'New Item' },
        ]}
      />

      <div className="p-6 sm:p-8 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        <ItemForm
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
          onCancel={() => navigate(ROUTES.ITEMS)}
        />
      </div>
    </div>
  );
};

export default AddItemPage;
