import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema } from '../../../validations/item.schema';
import { GST_RATES } from '../../../constants/gstRates';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

export const ItemForm = ({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const isEdit = Boolean(initialValues?._id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemSchema),
    values: {
      name: initialValues?.name || '',
      hsnCode: initialValues?.hsnCode || '',
      price: initialValues?.price !== undefined ? initialValues.price : '',
      gstPercent: initialValues?.gstPercent !== undefined ? String(initialValues.gstPercent) : '18',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      gstPercent: Number(data.gstPercent),
    });
  };

  const gstOptions = GST_RATES.map((rate) => ({
    value: String(rate),
    label: `${rate}% GST`,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Item Name */}
        <div className="md:col-span-2">
          <Input
            label="Item / Service Name *"
            placeholder="e.g. Standard Web Hosting (Annual) or Wireless Mouse"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        {/* HSN / SAC Code */}
        <div>
          <Input
            label="HSN / SAC Code"
            placeholder="e.g. 998314 or 8471"
            helperText="2 to 8 numeric digits for GST classification"
            error={errors.hsnCode?.message}
            {...register('hsnCode')}
          />
        </div>

        {/* Unit Price */}
        <div>
          <Input
            label="Unit Price (₹) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
        </div>

        {/* GST Slab */}
        <div className="md:col-span-2">
          <Select
            label="GST Rate Slab *"
            options={gstOptions}
            error={errors.gstPercent?.message}
            {...register('gstPercent')}
          />
          <p className="text-[12px] text-[#71717A] mt-1.5">
            Select the applicable GST slab. Standard rate for most services is 18%.
          </p>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#222]">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEdit ? 'Update Item' : 'Add Item to Catalog'}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
