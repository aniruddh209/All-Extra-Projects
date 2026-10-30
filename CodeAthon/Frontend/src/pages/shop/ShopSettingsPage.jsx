import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import shopService from '../../services/shop.service';
import PageHeader from '../../components/ui/PageHeader';
import ShopSettingsForm from '../../features/shop/components/ShopSettingsForm';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { useAuth } from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export const ShopSettingsPage = () => {
  const queryClient = useQueryClient();
  const { shop: authShop, setShop } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['shop'],
    queryFn: () => shopService.getShop(),
  });

  const shop = data?.data?.shop || data?.shop || data?.data || authShop;

  const updateMutation = useMutation({
    mutationFn: (payload) => shopService.updateShop(payload),
    onSuccess: (res) => {
      const updated = res?.data?.shop || res?.shop || res?.data;
      toast.success('Business settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      if (updated && setShop) {
        setShop(updated);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update shop settings';
      toast.error(msg);
    },
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <PageHeader
        title="Business & GST Settings"
        description="Configure your enterprise identity, operating address, GSTIN, and default invoice layout."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Shop Settings' },
        ]}
      />

      <div>
        {isLoading ? (
          <div className="space-y-6 p-8 rounded-xl bg-[#0D1118] border border-[#222A38]">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ) : isError && !shop ? (
          <div className="p-8 rounded-xl bg-[#0D1118] border border-[#222A38]">
            <ErrorState
              title="Unable to load shop settings"
              message="An error occurred while loading your business profile."
              onRetry={() => refetch()}
            />
          </div>
        ) : (
          <ShopSettingsForm
            initialValues={shop}
            onSubmit={(payload) => updateMutation.mutate(payload)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default ShopSettingsPage;
