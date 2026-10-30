import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import itemService from '../../services/item.service';
import PageHeader from '../../components/ui/PageHeader';
import ItemForm from '../../features/items/components/ItemForm';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import ROUTES from '../../constants/routes';

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemService.getItemById(id),
    enabled: Boolean(id),
  });

  const item = data?.data?.item || data?.item || data?.data;

  const updateMutation = useMutation({
    mutationFn: (payload) => itemService.updateItem(id, payload),
    onSuccess: () => {
      toast.success('Item updated successfully');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      navigate(ROUTES.ITEMS);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update item';
      toast.error(msg);
    },
  });

  return (
    <div className="max-w-[760px] mx-auto space-y-6">
      <PageHeader
        title={item ? `Edit ${item.name}` : 'Edit Item'}
        description="Update pricing, HSN/SAC code, or GST tax percentage slab."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Items', href: ROUTES.ITEMS },
          { label: 'Edit' },
        ]}
      />

      <div className="p-6 sm:p-8 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ) : isError || !item ? (
          <ErrorState
            title="Item not found"
            message="Unable to load the requested item details."
            onRetry={() => refetch()}
          />
        ) : (
          <ItemForm
            initialValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isSubmitting={updateMutation.isPending}
            onCancel={() => navigate(ROUTES.ITEMS)}
          />
        )}
      </div>
    </div>
  );
};

export default EditItemPage;
