import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '../../components/common/PageHeader';
import PartyForm from '../../features/parties/components/PartyForm';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import partyService from '../../services/party.service';
import ROUTES from '../../constants/routes';

export const EditPartyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch current party
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['party', id],
    queryFn: () => partyService.getPartyById(id),
  });

  const party = data?.data?.party || data?.party || data?.data || data;

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => partyService.updateParty(id, formData),
    onSuccess: () => {
      toast.success('Customer details updated');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['party', id] });
      navigate(ROUTES.PARTIES);
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to update customer');
      toast.error(err.message || 'Failed to update customer');
    },
  });

  return (
    <div className="max-w-[900px] mx-auto space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Edit Customer"
        description={`Modify customer details for ${party?.name || 'Customer'}`}
        breadcrumbs={[
          { label: 'Customers', href: ROUTES.PARTIES },
          { label: 'Edit Profile' },
        ]}
      />

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : isError ? (
        <ErrorState
          title="Failed to load customer profile"
          message={error?.message}
          onRetry={refetch}
        />
      ) : (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
          {errorMsg && (
            <div className="p-3 mb-5 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
              {errorMsg}
            </div>
          )}

          <PartyForm
            initialValues={party}
            onSubmit={(formData) => {
              setErrorMsg(null);
              updateMutation.mutate(formData);
            }}
            isLoading={updateMutation.isPending}
            onCancel={() => navigate(ROUTES.PARTIES)}
            submitLabel="Update Customer Profile"
          />
        </div>
      )}
    </div>
  );
};

export default EditPartyPage;
