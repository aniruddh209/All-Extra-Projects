import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import billService from '../../services/bill.service';
import PageHeader from '../../components/ui/PageHeader';
import CustomerSelector from '../../features/bills/components/CustomerSelector';
import BillItemsTable from '../../features/bills/components/BillItemsTable';
import BillSummary from '../../features/bills/components/BillSummary';
import { calculateInvoiceSummary } from '../../utils/gstCalculator';
import { useAuth } from '../../hooks/useAuth';
import ROUTES from '../../constants/routes';

export const CreateBillPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { shop } = useAuth();

  const [selectedParty, setSelectedParty] = useState(null);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    {
      name: '',
      hsnCode: '',
      quantity: 1,
      price: 0,
      gstPercent: 18,
    },
  ]);

  // Compute live tax breakdown
  const summary = calculateInvoiceSummary(
    items,
    shop?.state || 'Gujarat',
    selectedParty?.state || shop?.state || 'Gujarat'
  );

  // Mutation to create bill
  const createMutation = useMutation({
    mutationFn: (payload) => billService.createBill(payload),
    onSuccess: (res) => {
      const createdBill = res?.data?.bill || res?.bill || res?.data;
      toast.success(`Invoice ${createdBill?.invoiceNumber || ''} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (selectedParty?._id) {
        queryClient.invalidateQueries({ queryKey: ['party-bills', selectedParty._id] });
      }

      if (createdBill?._id) {
        navigate(`/bills/${createdBill._id}`);
      } else {
        navigate(ROUTES.BILLS);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to generate invoice';
      toast.error(msg);
    },
  });

  const handleGenerateInvoice = () => {
    if (!selectedParty?._id) {
      toast.error('Please select a customer first');
      return;
    }

    const validItems = items.filter((item) => item.name?.trim() && item.quantity > 0 && item.price >= 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid item with name and price');
      return;
    }

    const payload = {
      partyId: selectedParty._id,
      notes: notes.trim() || undefined,
      items: validItems.map((item) => ({
        itemId: item.itemId || undefined,
        name: item.name.trim(),
        hsnCode: item.hsnCode?.trim() || undefined,
        quantity: Number(item.quantity),
        price: Number(item.price),
        gstPercent: Number(item.gstPercent),
      })),
    };

    createMutation.mutate(payload);
  };

  const hasValidItems = items.some((i) => i.name?.trim() && i.quantity > 0 && i.price > 0);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Create GST Tax Invoice"
        description="Generate sequential tax invoice with real-time CGST/SGST or IGST computations."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Invoices', href: ROUTES.BILLS },
          { label: 'New Invoice' },
        ]}
      />

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Customer and Item Table */}
        <div className="lg:col-span-8 space-y-6">
          <CustomerSelector
            selectedParty={selectedParty}
            onSelectParty={(party) => setSelectedParty(party)}
            sellerState={shop?.state || 'Gujarat'}
          />

          <BillItemsTable
            items={items}
            onChangeItems={(updated) => setItems(updated)}
            intraState={summary.intraState}
          />
        </div>

        {/* Right Column (4 cols): Summary, Totals and Notes */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <BillSummary
              summary={summary}
              notes={notes}
              onChangeNotes={(val) => setNotes(val)}
              isSubmitting={createMutation.isPending}
              onSubmit={handleGenerateInvoice}
              hasParty={Boolean(selectedParty)}
              hasItems={hasValidItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBillPage;
