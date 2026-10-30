import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema } from '../../../validations/user.schema';
import ROLES from '../../../constants/roles';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

export const UserForm = ({
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
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    values: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      password: '',
      role: initialValues?.role || ROLES.STAFF,
      isActive: initialValues?.isActive !== undefined ? initialValues.isActive : true,
    },
  });

  const roleOptions = [
    { value: ROLES.ADMIN, label: 'Admin — Full billing, party & item management' },
    { value: ROLES.STAFF, label: 'Staff — Invoice generation and party viewing' },
  ];

  if (isEdit && initialValues?.role === ROLES.OWNER) {
    roleOptions.unshift({ value: ROLES.OWNER, label: 'Owner — Full business ownership' });
  }

  const handleFormSubmit = (data) => {
    // If editing and password is empty, remove it from payload
    const payload = { ...data };
    if (isEdit && !payload.password) {
      delete payload.password;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <Input
            label="Full Name *"
            placeholder="e.g. Priya Sharma"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email Address *"
            type="email"
            placeholder="member@example.com"
            disabled={isEdit}
            helperText={isEdit ? 'Email address cannot be modified after creation' : undefined}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            label={isEdit ? 'Change Password (Optional)' : 'Account Password *'}
            placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Role */}
        <div>
          <Select
            label="Assigned Role *"
            options={roleOptions}
            disabled={isEdit && initialValues?.role === ROLES.OWNER}
            error={errors.role?.message}
            {...register('role')}
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#333] bg-[#161616] text-[#6366F1] focus:ring-[#6366F1]"
              {...register('isActive')}
            />
            <span className="text-xs text-[#F5F5F5] font-medium">
              Account Active (User can log in to the billing portal)
            </span>
          </label>
        </div>
      </div>

      {/* Buttons */}
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
          {isEdit ? 'Update Member' : 'Create Team Member'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
