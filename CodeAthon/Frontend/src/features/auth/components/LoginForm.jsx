import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import { loginSchema } from '../../../validations/auth.schema';
import ROUTES from '../../../constants/routes';
import apiClient from '../../../api/client';

import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'anirudh@example.com',
      password: 'Password123!',
    },
  });

  const fillDemoAccount = (role) => {
    if (role === 'OWNER') {
      setValue('email', 'anirudh@example.com');
      setValue('password', 'Password123!');
    } else if (role === 'ADMIN') {
      setValue('email', 'admindemo1@example.com');
      setValue('password', 'Password123!');
    } else {
      setValue('email', 'staffdemo1@example.com');
      setValue('password', 'Password123!');
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setIsLoading(true);

    try {
      await login(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#151824] dark:bg-[#151824] light:bg-[#FFFFFF] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] rounded-2xl p-7 sm:p-8 shadow-xl transition-colors">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
          Welcome back
        </h2>
        <p className="text-xs text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-1.5">
          Sign in to access your GSTBilling PRO workspace
        </p>
      </div>

      {/* Demo Quick Fill Switcher (spacing: 16px) */}
      <div className="mt-4 p-3 rounded-xl bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0]">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mb-2">
          <span className="font-semibold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">Demo Quick Fill:</span>
          <span className="text-[11px] text-[#64748B]">Click to test</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('OWNER')}
            className="py-1.5 px-2 rounded-lg bg-[#1A1E2D] dark:bg-[#1A1E2D] light:bg-[#FFFFFF] hover:bg-[#6366F1]/15 border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-xs font-semibold text-[#818CF8] dark:text-[#818CF8] light:text-[#4F46E5] transition-all text-center cursor-pointer"
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('ADMIN')}
            className="py-1.5 px-2 rounded-lg bg-[#1A1E2D] dark:bg-[#1A1E2D] light:bg-[#FFFFFF] hover:bg-[#38BDF8]/15 border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-xs font-semibold text-[#38BDF8] dark:text-[#38BDF8] light:text-[#0284C7] transition-all text-center cursor-pointer"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('STAFF')}
            className="py-1.5 px-2 rounded-lg bg-[#1A1E2D] dark:bg-[#1A1E2D] light:bg-[#FFFFFF] hover:bg-[#22C55E]/15 border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-xs font-semibold text-[#22C55E] dark:text-[#22C55E] light:text-[#16A34A] transition-all text-center cursor-pointer"
          >
            Staff
          </button>
        </div>
      </div>

      {/* Error Alert Box */}
      {serverError && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form (spacing from description: 24px) */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="space-y-4">
          {/* Email field (spacing: 16px, height: 44px) */}
          <Input
            label="Email Address"
            type="email"
            placeholder="anirudh@example.com"
            leftIcon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password field (spacing: 16px, height: 44px) */}
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Actions: Remember Me + Forgot Password (spacing: 20px) */}
        <div className="mt-5 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#262B3F] dark:border-[#262B3F] light:border-[#CBD5E1] bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-[#94A3B8] dark:text-[#94A3B8] light:text-[#475569]">Remember me</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-[#818CF8] dark:text-[#818CF8] light:text-[#4F46E5] hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button (height: 44px, radius: 10px, spacing: 20px) */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 h-11 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Auth Divider (spacing: 20px) */}
      <div className="relative mt-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#151824] dark:bg-[#151824] light:bg-[#FFFFFF] px-3 text-[#64748B] dark:text-[#64748B] light:text-[#64748B]">
            or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons (spacing: 20px, height: 40px) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            toast.info('Google SSO ready for production OAuth integration');
          }}
          className="flex items-center justify-center gap-2.5 h-10 px-3 rounded-xl bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] hover:bg-[#1A1E2D] dark:hover:bg-[#1A1E2D] light:hover:bg-[#F1F5F9] text-xs font-semibold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => {
            toast.info('GitHub SSO ready for production OAuth integration');
          }}
          className="flex items-center justify-center gap-2.5 h-10 px-3 rounded-xl bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] hover:bg-[#1A1E2D] dark:hover:bg-[#1A1E2D] light:hover:bg-[#F1F5F9] text-xs font-semibold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] shrink-0" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Footer link (spacing: 20px) */}
      <div className="mt-5 text-center text-xs text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B]">
        Don't have an account?{' '}
        <Link
          to={ROUTES.SIGNUP}
          className="font-semibold text-[#818CF8] dark:text-[#818CF8] light:text-[#4F46E5] hover:underline transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* 3 Feature Trust Cards at the Bottom */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0]">
        <div className="p-2 rounded-lg bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-center">
          <h5 className="text-[10px] font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">Secure</h5>
          <p className="text-[9px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B]">Encrypted</p>
        </div>
        <div className="p-2 rounded-lg bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-center">
          <h5 className="text-[10px] font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">GST Ready</h5>
          <p className="text-[9px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B]">Compliant</p>
        </div>
        <div className="p-2 rounded-lg bg-[#0F121C] dark:bg-[#0F121C] light:bg-[#F8FAFC] border border-[#262B3F] dark:border-[#262B3F] light:border-[#E2E8F0] text-center">
          <h5 className="text-[10px] font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">24/7 Support</h5>
          <p className="text-[9px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B]">Help Desk</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
