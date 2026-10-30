import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, MapPin, Mail, Hash } from 'lucide-react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { partySchema } from '../../../validations/party.schema';
import { INDIAN_STATES } from '../../../constants/states';

/**
 * Reusable PartyForm for both Create and Edit operations
 */
export const PartyForm = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  onCancel,
  submitLabel = 'Save Customer',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(partySchema),
    values: {
      name: initialValues?.name || '',
      mobile: initialValues?.mobile || '',
      address: initialValues?.address || '',
      state: initialValues?.state || '',
      gstin: initialValues?.gstin || '',
      email: initialValues?.email || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name & Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Customer / Business Name"
          placeholder="Acme Enterprises"
          leftIcon={User}
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Mobile Number"
          placeholder="9876543210"
          leftIcon={Phone}
          required
          error={errors.mobile?.message}
          {...register('mobile')}
        />
      </div>

      {/* State & GSTIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="State (for GST Determination)"
          placeholder="Select State"
          options={INDIAN_STATES}
          required
          error={errors.state?.message}
          {...register('state')}
        />

        <Input
          label="GSTIN (Optional)"
          placeholder="24AAAAA0000A1Z5"
          leftIcon={Hash}
          error={errors.gstin?.message}
          helperText="15-character alphanumeric GST Identification Number"
          {...register('gstin')}
        />
      </div>

      {/* Address */}
      <div>
        <Input
          label="Billing Address"
          placeholder="101, Trade Center, Ring Road"
          leftIcon={MapPin}
          required
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      {/* Email */}
      <div>
        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="billing@customer.com"
          leftIcon={Mail}
          error={errors.email?.message}
          helperText="Used for automated invoice delivery"
          {...register('email')}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202020]">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PartyForm;
