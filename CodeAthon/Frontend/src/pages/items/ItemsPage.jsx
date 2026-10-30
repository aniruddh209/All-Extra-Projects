import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

import itemService from '../../services/item.service';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import ItemTable from '../../features/items/components/ItemTable';
import { usePermission } from '../../hooks/usePermission';
import { GST_RATES } from '../../constants/gstRates';
import ROUTES from '../../constants/routes';

export const ItemsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canCreateItem } = usePermission();

  const [search, setSearch] = useState('');
  const [selectedGst, setSelectedGst] = useState('');
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState(null);

  // TanStack Query for items
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['items', { search, gstPercent: selectedGst, page, limit: 10 }],
    queryFn: () =>
      itemService.getItems({
        search: search.trim() || undefined,
        gstPercent: selectedGst || undefined,
        page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const items = data?.data?.items || data?.items || (Array.isArray(data?.data) ? data.data : []);
  const pagination = data?.data?.pagination || data?.pagination || {
    page: 1,
    totalPages: 1,
    total: items.length,
    limit: 10,
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => itemService.deleteItem(id),
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setItemToDelete(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to delete item';
      toast.error(msg);
      setItemToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (itemToDelete?._id) {
      deleteMutation.mutate(itemToDelete._id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="Items & Catalog"
        description="Manage your reusable inventory catalog, HSN/SAC codes, and GST rates."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Items' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              leftIcon={RefreshCw}
            >
              Refresh
            </Button>
            {canCreateItem && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.ADD_ITEM)}
                leftIcon={Plus}
              >
                Add Item
              </Button>
            )}
          </div>
        }
      />

      {/* Filter / Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search items by name or HSN code..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        {/* GST Slab Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedGst}
            onChange={(e) => {
              setSelectedGst(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#090C12] border border-[#222A38] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
          >
            <option value="">All GST Slabs</option>
            {GST_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}% GST
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl bg-[#0D1017] border border-[#1E293F] overflow-hidden shadow-sm">
        {isError ? (
          <div className="p-8">
            <ErrorState
              title="Unable to load items"
              message="An error occurred while retrieving your catalog items."
              onRetry={() => refetch()}
            />
          </div>
        ) : (
          <>
            <ItemTable
              items={items}
              isLoading={isLoading}
              onDelete={(item) => setItemToDelete(item)}
              onAddItem={() => navigate(ROUTES.ADD_ITEM)}
            />

            {/* Pagination Controls */}
            {items.length > 0 && pagination.totalPages > 1 && (
              <div className="p-3 border-t border-[#1E293F]">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages || 1}
                  totalItems={pagination.total || items.length}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? Existing invoices with this item will preserve their historical snapshot, but this item won't be available for new bills.`}
        confirmLabel="Delete Item"
        cancelLabel="Keep Item"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default ItemsPage;
