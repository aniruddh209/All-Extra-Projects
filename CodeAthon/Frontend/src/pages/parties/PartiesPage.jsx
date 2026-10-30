import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import PartyTable from '../../features/parties/components/PartyTable';
import partyService from '../../services/party.service';
import { INDIAN_STATES } from '../../constants/states';
import ROUTES from '../../constants/routes';

export const PartiesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [page, setPage] = useState(1);
  const [partyToDelete, setPartyToDelete] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query customers
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['parties', { search, state: selectedState, page }],
    queryFn: () => partyService.getParties({ search, state: selectedState || undefined, page, limit: 10 }),
    staleTime: 30 * 1000,
  });

  const parties = data?.parties || data?.data?.parties || [];
  const pagination = data?.pagination || data?.data?.pagination || {
    page: 1,
    pages: 1,
    totalPages: 1,
    total: parties.length,
    limit: 10,
  };

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => partyService.deleteParty(id),
    onSuccess: () => {
      toast.success('Customer removed successfully');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      setPartyToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete customer');
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="Parties / Customers"
        description="Manage your customers and billing relationships."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Parties' },
        ]}
      >
        <Link to={ROUTES.ADD_PARTY}>
          <Button variant="primary" size="sm" leftIcon={Plus}>
            Add Party
          </Button>
        </Link>
      </PageHeader>

      {/* Toolbar: Search, State Filter, Refresh */}
      <div className="p-4 rounded-xl bg-[#0D1118] border border-[#222A38] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search parties by name, mobile or GSTIN..."
            onDebounce={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#090C12] border border-[#222A38] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="">State: All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={RefreshCw}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl bg-[#0D1017] border border-[#1E293F] overflow-hidden shadow-sm">
        {isError ? (
          <ErrorState
            title="Failed to load customers"
            message={error?.message}
            onRetry={refetch}
          />
        ) : (
          <>
            <PartyTable
              parties={parties}
              isLoading={isLoading}
              onDelete={(party) => setPartyToDelete(party)}
              onAddParty={() => navigate(ROUTES.ADD_PARTY)}
            />

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages || pagination.pages || 1}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(partyToDelete)}
        onClose={() => setPartyToDelete(null)}
        onConfirm={() => deleteMutation.mutate(partyToDelete._id)}
        title="Delete Customer Profile"
        message={`Are you sure you want to delete "${partyToDelete?.name}"? Historical invoices issued to this party will retain their snapshot record, but new bills cannot be created.`}
        confirmText="Delete Customer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PartiesPage;
