import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { forgotPasswordSchema } from '../../../validations/auth.schema';
import ROUTES from '../../../constants/routes';
import apiClient from '../../../api/client';

export const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Verification code dispatched');
    } catch (err) {
      const msg = err.message || 'Unable to process request';
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
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Enter your email address and we'll send you a 6-digit verification code.
        </p>
      </div>

      {/* Success State Prompt */}
      {isSubmitted ? (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 flex items-start gap-3 text-xs text-[#F5F5F5]">
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-[#10B981]">
                Check your inbox
              </p>
              <p className="text-[#A1A1AA] mt-1 leading-relaxed">
                If an account with <span className="text-[#F5F5F5] font-medium">{submittedEmail}</span> exists, we have sent a 6-digit OTP code to verify your request.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            rightIcon={ArrowRight}
            onClick={() => navigate(ROUTES.VERIFY_OTP, { state: { email: submittedEmail } })}
          >
            Enter Verification Code
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] underline"
            >
              Didn't get code? Try different email
            </button>
          </div>
        </div>
      ) : (
        <>
          {serverError && (
            <div className="p-3 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              placeholder="owner@example.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Send Verification Code
            </Button>
          </form>
        </>
      )}

      {/* Footer link to Login */}
      <div className="text-center pt-2 border-t border-[#1C1C1C]">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
