import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '../../components/common/PageHeader';
import PartyForm from '../../features/parties/components/PartyForm';
import partyService from '../../services/party.service';
import ROUTES from '../../constants/routes';

export const AddPartyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState(null);

  const mutation = useMutation({
    mutationFn: (formData) => partyService.createParty(formData),
    onSuccess: (data) => {
      toast.success('Customer registered successfully');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      navigate(ROUTES.PARTIES);
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to register customer');
      toast.error(err.message || 'Failed to register customer');
    },
  });

  return (
    <div className="max-w-[900px] mx-auto space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Add Customer"
        description="Register a new customer profile for GST billing and invoice generation."
        breadcrumbs={[
          { label: 'Customers', href: ROUTES.PARTIES },
          { label: 'New Customer' },
        ]}
      />

      <div className="p-6 sm:p-8 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
        {errorMsg && (
          <div className="p-3 mb-5 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            {errorMsg}
          </div>
        )}

        <PartyForm
          onSubmit={(data) => {
            setErrorMsg(null);
            mutation.mutate(data);
          }}
          isLoading={mutation.isPending}
          onCancel={() => navigate(ROUTES.PARTIES)}
          submitLabel="Save & Register Customer"
        />
      </div>
    </div>
  );
};

export default AddPartyPage;
