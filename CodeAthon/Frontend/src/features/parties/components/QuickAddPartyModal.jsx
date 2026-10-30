import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import PartyForm from './PartyForm';
import partyService from '../../../services/party.service';
import { toast } from 'sonner';

/**
 * QuickAddPartyModal Component
 * Allows instant customer creation during invoice composition without leaving the page.
 */
export const QuickAddPartyModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await partyService.createParty(formData);
      const createdParty = response?.party || response?.data?.party || response?.data || response;
      toast.success(`Customer ${createdParty.name || 'record'} added successfully`);
      if (onSuccess) onSuccess(createdParty);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to add customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Add Customer"
      description="Create a new client profile and immediately apply it to your invoice."
      maxWidth="max-w-xl"
    >
      <PartyForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={onClose}
        submitLabel="Add Customer & Select"
      />
    </Modal>
  );
};

export default QuickAddPartyModal;
