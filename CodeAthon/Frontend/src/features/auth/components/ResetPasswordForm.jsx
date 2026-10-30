import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Check, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import { resetPasswordSchema } from '../../../validations/auth.schema';
import ROUTES from '../../../constants/routes';
import apiClient from '../../../api/client';
import { cn } from '../../../utils/cn';

export const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const resetToken = location.state?.resetToken || '';

  const [serverError, setServerError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      resetToken,
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password', '');

  // Requirements checklist
  const requirements = [
    { label: 'At least 6 characters', met: passwordVal.length >= 6 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(passwordVal) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(passwordVal) },
    { label: 'One number (0-9)', met: /\d/.test(passwordVal) },
  ];

  const allMet = requirements.every((r) => r.met);

  const onSubmit = async (data) => {
    if (!email || !resetToken) {
      toast.error('Session expired. Please restart the reset process.');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }

    setServerError(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/reset-password', data);
      setIsSuccess(true);
      toast.success('Password updated successfully');
    } catch (err) {
      const msg = err.message || 'Failed to reset password';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F5]">
          Reset your password
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Create a new, strong password for your business account
        </p>
      </div>

      {/* Success State */}
      {isSuccess ? (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 flex items-start gap-3 text-xs text-[#F5F5F5]">
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-[#10B981]">
                Password reset successfully!
              </p>
              <p className="text-[#A1A1AA] mt-1 leading-relaxed">
                Your credentials have been securely updated. You can now sign in using your new password.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            rightIcon={ArrowRight}
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <>
          {/* Error Alert Box */}
          {serverError && (
            <div className="p-3 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PasswordInput
              label="New Password"
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Checklist of Password Requirements */}
            <div className="p-3 rounded-md bg-[#101010] border border-[#202020] space-y-2 text-xs">
              <span className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider block">
                Requirements Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {requirements.map((req, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-1.5 transition-colors',
                      req.met ? 'text-[#10B981]' : 'text-[#71717A]'
                    )}
                  >
                    {req.met ? (
                      <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                    ) : (
                      <X className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-[11px]">{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <PasswordInput
              label="Confirm New Password"
              placeholder="••••••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={!allMet}
              rightIcon={ArrowRight}
            >
              Reset Password
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2 border-t border-[#1C1C1C]">
            <Link
              to={ROUTES.LOGIN}
              className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;
