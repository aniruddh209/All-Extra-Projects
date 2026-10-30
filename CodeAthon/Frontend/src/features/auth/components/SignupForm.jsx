import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Lock,
  AlertCircle,
  ArrowRight,
  Shield,
  UserCheck,
  Receipt,
  Check,
  ShieldCheck,
  FileCheck2,
  Headphones,
} from 'lucide-react';
import { toast } from 'sonner';

import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { signupSchema } from '../../../validations/auth.schema';
import { INDIAN_STATES } from '../../../constants/states';
import ROUTES from '../../../constants/routes';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../utils/cn';

export const SignupForm = () => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      state: '',
      role: 'OWNER',
    },
  });

  const selectedRole = watch('role', 'OWNER');

  // 3 Role Cards matched 100% to reference design
  const roles = [
    {
      id: 'OWNER',
      title: 'Business Owner',
      desc: 'Full access to all features, shop settings, team members & billing.',
      icon: Shield,
      color: 'text-[#818CF8]',
      iconBg: 'bg-[#6366F1]/15 border-[#6366F1]/30',
      activeBorder: 'border-[#6366F1]',
      activeBg: 'bg-[#6366F1]/10',
    },
    {
      id: 'ADMIN',
      title: 'Admin / Manager',
      desc: 'Manage catalog, customers, ledgers, view invoices & generate reports.',
      icon: UserCheck,
      color: 'text-[#38BDF8]',
      iconBg: 'bg-[#38BDF8]/15 border-[#38BDF8]/30',
      activeBorder: 'border-[#38BDF8]',
      activeBg: 'bg-[#38BDF8]/10',
    },
    {
      id: 'STAFF',
      title: 'Staff (Billing Desk)',
      desc: 'Create invoices and perform customer lookups (limited access).',
      icon: Receipt,
      color: 'text-[#34D399]',
      iconBg: 'bg-[#10B981]/15 border-[#10B981]/30',
      activeBorder: 'border-[#10B981]',
      activeBg: 'bg-[#10B981]/10',
    },
  ];

  const onSubmit = async (data) => {
    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setServerError(null);
    setIsLoading(true);

    try {
      await signup(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create account';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[620px] bg-[#0F131F] dark:bg-[#0F131F] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors space-y-6">
      {/* Form Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
          Create your business account
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-1">
          Choose your role and set up your GST invoicing workspace
        </p>
      </div>

      {/* Error Alert Box */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444] animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ─── 3 Horizontal Role Cards (Exact Reference Design Grid) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setValue('role', r.id, { shouldValidate: true })}
                className={cn(
                  'relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none flex flex-col justify-between gap-3',
                  isSelected
                    ? `${r.activeBg} ${r.activeBorder} shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-[#6366F1]/50`
                    : 'bg-[#121726] border-[#1E2538] hover:border-[#2E3C59] hover:bg-[#161D30]'
                )}
              >
                {/* Top Row: Icon + Checkmark when selected */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center border shrink-0',
                      r.iconBg
                    )}
                  >
                    <Icon className={cn('w-4 h-4', r.color)} />
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
                    {r.title}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-1 leading-snug">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 2-Column Desktop Form Grid ─── */}
        <div className="space-y-4 pt-1">
          {/* Row 1: Full Name & Work Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="Aniruddh Sharma"
              leftIcon={User}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work Email *"
              type="email"
              placeholder="aniruddh@business.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {/* Row 2: Enterprise Name & Registered State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Enterprise / Shop Name *"
              placeholder="Apex Tech Solutions"
              leftIcon={Building2}
              error={errors.businessName?.message}
              {...register('businessName')}
            />
            <Select
              label="Registered State *"
              placeholder="Select State"
              leftIcon={MapPin}
              options={INDIAN_STATES}
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="Password *"
              placeholder="Min 6 characters (A-Z, a-z, 0-9)"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordInput
              label="Confirm Password *"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-center gap-2.5 pt-1 text-xs text-[#94A3B8] select-none">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 rounded border-[#1E2538] bg-[#0C101A] text-[#6366F1] focus:ring-[#6366F1] cursor-pointer"
          />
          <label htmlFor="agreeTerms" className="cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-[#818CF8] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#818CF8] hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#5B5FC7] via-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>
                Create {selectedRole === 'OWNER' ? 'Owner' : selectedRole === 'ADMIN' ? 'Admin' : 'Staff'} Account
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Sign In Link */}
      <div className="text-center pt-2 border-t border-[#1E2538]">
        <p className="text-xs text-[#94A3B8]">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-bold text-[#818CF8] hover:text-white hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* ─── 3 Feature Trust Cards at the Bottom (Matched 100% to Reference Design) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#121726] border border-[#1E2538]">
          <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-[#F8FAFC]">Secure & Private</h5>
            <p className="text-[10px] text-[#94A3B8]">Your data is always encrypted</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#121726] border border-[#1E2538]">
          <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
            <FileCheck2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-[#F8FAFC]">GST Compliant</h5>
            <p className="text-[10px] text-[#94A3B8]">As per latest regulations</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#121726] border border-[#1E2538]">
          <div className="w-7 h-7 rounded-lg bg-[#34D399]/15 text-[#34D399] flex items-center justify-center shrink-0">
            <Headphones className="w-3.5 h-3.5" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-[#F8FAFC]">24/7 Support</h5>
            <p className="text-[10px] text-[#94A3B8]">We're here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
