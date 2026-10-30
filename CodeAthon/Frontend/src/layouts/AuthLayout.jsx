import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Zap,
  FileText,
  Users,
  CheckCircle2,
  Sun,
  Moon,
  TrendingUp,
  ShieldCheck,
  Lock,
  Headphones,
} from 'lucide-react';
import Logo from '../components/shared/Logo';
import { useTheme } from '../hooks/useTheme';

/**
 * Enterprise Auth Layout — Matched 100% to Reference Design
 * 50% Left Product Showcase | 50% Right Dedicated Form Canvas
 */
export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] w-full bg-[#080A10] dark:bg-[#080A10] light:bg-[#F8FAFC] text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] flex flex-col lg:flex-row font-sans antialiased selection:bg-[#6366F1] selection:text-white transition-colors duration-150">
      {/* ─────────────────────────────────────────────────────────────
          1. Left Panel (Desktop 50%): Premium Product Story & Graphics
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0E17] dark:bg-[#0B0E17] light:bg-[#F1F5F9] border-r border-[#1A1F2C] dark:border-[#1A1F2C] light:border-[#E2E8F0] flex-col justify-between p-10 xl:p-12 2xl:p-14 relative overflow-hidden transition-colors duration-150">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top: Logo & System Version Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo />
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#121726] dark:bg-[#121726] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#CBD5E1] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#475569]">
            v2.4 Enterprise Edition
          </span>
        </div>

        {/* Center: Main Headline, Features, and Floating Card Mockups */}
        <div className="relative z-10 space-y-6 my-auto py-4 max-w-[560px]">
          {/* Tagline Pill */}
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/25 text-xs font-bold tracking-wider text-[#818CF8] dark:text-[#818CF8] light:text-[#4F46E5] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
              Indian GST Compliant Invoicing SaaS
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl xl:text-4xl 2xl:text-[42px] font-extrabold tracking-tight leading-[1.15] text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
              Professional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#38BDF8]">
                GST
              </span>{' '}
              <br />
              Billing for Modern Businesses
            </h1>
            <p className="text-sm text-[#94A3B8] dark:text-[#94A3B8] light:text-[#475569] leading-relaxed">
              Create GST-compliant invoices in seconds, manage customer ledgers, track real-time tax liabilities, and streamline team operations.
            </p>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#121726] dark:bg-[#121726] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 text-[#818CF8] dark:text-[#818CF8] light:text-[#4F46E5] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
                  Automated Dual-Tax Calculation
                </h4>
                <p className="text-[11px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-0.5 leading-normal">
                  Automatic detection of Intra-State (CGST + SGST) vs Inter-State (IGST) based on state jurisdiction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#121726] dark:bg-[#121726] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] dark:text-[#38BDF8] light:text-[#0284C7] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
                  Print-Ready Invoices & PDF Export
                </h4>
                <p className="text-[11px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-0.5 leading-normal">
                  Professional GST invoices with HSN/SAC codes, authorized signature blocks, and instant dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#121726] dark:bg-[#121726] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 text-[#22C55E] dark:text-[#22C55E] light:text-[#16A34A] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
                  Role-Based Team Collaboration
                </h4>
                <p className="text-[11px] text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B] mt-0.5 leading-normal">
                  Dedicated permission matrices for Owners, Admins, and Staff (Billing Desk).
                </p>
              </div>
            </div>
          </div>

          {/* ─── Stacked Floating Graphics (Tax Invoice + Business Growth) ─── */}
          <div className="relative pt-2">
            {/* Background Business Growth Card */}
            <div className="absolute top-0 right-0 w-[180px] p-3.5 rounded-xl bg-[#121726] border border-[#1E2538] shadow-lg space-y-1.5 z-0 transform translate-x-2 -translate-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#94A3B8]">Business Growth</span>
                <span className="text-[11px] font-bold text-[#818CF8] flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +32%
                </span>
              </div>
              <div className="h-8 flex items-end gap-1.5 pt-1">
                <div className="w-full bg-[#6366F1]/20 rounded-t h-4" />
                <div className="w-full bg-[#6366F1]/30 rounded-t h-6" />
                <div className="w-full bg-[#6366F1]/50 rounded-t h-5" />
                <div className="w-full bg-[#6366F1]/80 rounded-t h-7" />
                <div className="w-full bg-[#6366F1] rounded-t h-8" />
              </div>
            </div>

            {/* Foreground Tax Invoice Card */}
            <div className="relative z-10 w-[88%] rounded-xl bg-[#0F131F] dark:bg-[#0F131F] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] p-4 shadow-2xl space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-[#818CF8] uppercase block">
                    TAX INVOICE
                  </span>
                  <span className="font-mono text-xs font-bold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A]">
                    INV-2026-000492
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] dark:text-[#22C55E] light:text-[#16A34A] border border-[#22C55E]/30 uppercase tracking-wider">
                  PAID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block">SELLER</span>
                  <span className="font-semibold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] block truncate">Apex Tech Solutions</span>
                  <span className="text-[10px] text-[#94A3B8] font-mono block">GSTIN: 24ABCDE1234F1Z5</span>
                </div>
                <div>
                  <span className="text-[9px] font-medium text-[#64748B] uppercase tracking-wider block">BILLED TO</span>
                  <span className="font-semibold text-[#F8FAFC] dark:text-[#F8FAFC] light:text-[#0F172A] block truncate">Rahul Traders</span>
                  <span className="text-[10px] text-[#94A3B8] block">Surat, Gujarat</span>
                </div>
              </div>

              {/* Items Table Mock */}
              <div className="pt-2 border-t border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] space-y-1">
                <div className="grid grid-cols-5 text-[9px] font-mono font-semibold text-[#64748B] uppercase">
                  <span className="col-span-2">ITEM</span>
                  <span>QTY</span>
                  <span>RATE</span>
                  <span className="text-right">AMOUNT</span>
                </div>
                <div className="grid grid-cols-5 text-[10px] font-mono text-[#94A3B8]">
                  <span className="col-span-2 text-[#F8FAFC] font-medium truncate">Wireless Mouse</span>
                  <span>10</span>
                  <span>₹450.00</span>
                  <span className="text-right text-[#F8FAFC]">₹4,500.00</span>
                </div>
                <div className="grid grid-cols-5 text-[10px] font-mono text-[#94A3B8]">
                  <span className="col-span-2 text-[#F8FAFC] font-medium truncate">Laptop Stand</span>
                  <span>5</span>
                  <span>₹1,200.00</span>
                  <span className="text-right text-[#F8FAFC]">₹6,000.00</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E2538] dark:border-[#1E2538] light:border-[#E2E8F0] flex items-center justify-between text-[11px]">
                <span className="text-[#818CF8] text-[10px] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  Intra-State GST (CGST 9% + SGST 9%)
                </span>
                <div className="text-right">
                  <span className="text-[9px] text-[#64748B] font-mono mr-1.5 uppercase">TOTAL</span>
                  <span className="font-mono font-bold text-xs text-[#F8FAFC]">
                    ₹10,500.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Trust Indicators */}
        <div className="relative z-10 pt-4 border-t border-[#1A1F2C] dark:border-[#1A1F2C] light:border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8] dark:text-[#94A3B8] light:text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            100% GST Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            Secure & Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            Trusted by Modern Businesses
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Right Panel (Desktop 50%): Dedicated Form Desk Canvas
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-[#080A10] dark:bg-[#080A10] light:bg-[#F8FAFC] overflow-y-auto transition-colors duration-150">
        {/* Top Bar: Mobile Logo + Theme Toggle */}
        <div className="flex items-center justify-between w-full pb-4">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Pill Theme Switcher */}
            <div className="flex items-center p-1 rounded-full bg-[#121726] dark:bg-[#121726] light:bg-[#FFFFFF] border border-[#1E2538] dark:border-[#1E2538] light:border-[#CBD5E1] shadow-xs">
              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  theme !== 'light'
                    ? 'bg-[#1E2538] text-[#F8FAFC] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-[#CBD5E1]'
                    : 'text-[#64748B] hover:text-[#F8FAFC]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Light</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Auth Form Desk */}
        <div className="w-full flex items-center justify-center my-auto py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
