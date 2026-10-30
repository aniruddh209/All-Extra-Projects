import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import OTPInput from '../../../components/ui/OTPInput';
import Button from '../../../components/ui/Button';
import ROUTES from '../../../constants/routes';
import apiClient from '../../../api/client';

export const OtpVerificationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from forgot password form or state
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60-second cooldown

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error('Session missing email. Please restart.');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }

    if (otp.length !== 6) {
      setServerError('Please enter all 6 digits of your verification code.');
      return;
    }

    setServerError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/verify-otp', {
        email,
        otp,
      });

      const resetToken = response.data?.resetToken;
      toast.success('Code verified successfully');

      // Navigate to reset password page with resetToken in state
      navigate(ROUTES.RESET_PASSWORD, {
        state: { email, resetToken },
      });
    } catch (err) {
      const msg = err.message || 'Invalid or expired verification code';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setServerError(null);

    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('A new 6-digit code has been dispatched');
      setCountdown(60);
      setOtp('');
    } catch (err) {
      const msg = err.message || 'Failed to resend code';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F5]">
          Enter verification code
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xs mx-auto">
          We sent a 6-digit code to{' '}
          <span className="text-[#F5F5F5] font-medium block sm:inline">
            {email || 'your email'}
          </span>
        </p>
      </div>

      {/* Error Alert Box */}
      {serverError && (
        <div className="p-3 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form with 6-Digit OTP */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="py-2">
          <OTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (serverError) setServerError(null);
            }}
            error={Boolean(serverError)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isLoading}
          disabled={otp.length !== 6}
          rightIcon={ArrowRight}
        >
          Verify & Continue
        </Button>
      </form>

      {/* Resend OTP Section */}
      <div className="text-center pt-2 border-t border-[#1C1C1C]">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#A1A1AA]">
          <span>Didn't receive the code?</span>
          {countdown > 0 ? (
            <span className="text-[#71717A]">
              Resend in <span className="text-[#F5F5F5] font-medium">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="font-medium text-[#6366F1] hover:text-[#818CF8] hover:underline focus:outline-none flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resend Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Back link */}
      <div className="text-center">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to email entry</span>
        </Link>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
