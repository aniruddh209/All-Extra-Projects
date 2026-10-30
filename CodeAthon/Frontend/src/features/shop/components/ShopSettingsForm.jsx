import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shopSchema } from '../../../validations/shop.schema';
import { INDIAN_STATES } from '../../../constants/indianStates';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import {
  Building2,
  MapPin,
  Receipt,
  ShieldCheck,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * ShopSettingsForm
 * Strictly implements:
 * - Desktop layout: 220px Settings Navigation + max-width 850px Settings Content
 * - Live Invoice Header Preview
 * - Real-time validation and clean save feedback
 */
export const ShopSettingsForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(shopSchema),
    values: {
      name: initialValues?.name || '',
      ownerName: initialValues?.ownerName || '',
      address: initialValues?.address || '',
      state: initialValues?.state || 'Gujarat',
      gstin: initialValues?.gstin || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      invoicePrefix: initialValues?.invoicePrefix || 'INV-2026-',
    },
  });

  const formValues = watch();
  const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }));

  const tabs = [
    {
      id: 'profile',
      label: 'Business Profile',
      desc: 'Company name & invoice prefix',
      icon: Building2,
    },
    {
      id: 'contact',
      label: 'Address & Contact',
      desc: 'Official address, state & phone',
      icon: MapPin,
    },
    {
      id: 'gst',
      label: 'GST & Taxation',
      desc: 'Statutory GSTIN & tax engine',
      icon: Receipt,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ─── Left: Settings Navigation (Exactly 220px width on desktop) ─── */}
      <div className="lg:col-span-3 w-full lg:max-w-[220px] space-y-1.5 p-2 rounded-xl bg-[#080B11] border border-[#1E293F]">
        <div className="px-2.5 py-2 text-[11px] font-semibold tracking-[0.08em] text-[#71717A] uppercase border-b border-[#1E293F] mb-1">
          Settings Menu
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all duration-150',
                isActive
                  ? 'bg-[#111722] text-[#F8FAFC] border border-[#222A38] shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171E2B]'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', isActive ? 'text-[#818CF8]' : 'text-[#71717A]')} />
              <div className="min-w-0">
                <span className="text-xs font-bold block leading-tight truncate">
                  {tab.label}
                </span>
                <span className="text-[10px] text-[#64748B] block leading-tight mt-0.5 truncate">
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Right: Settings Content (max-width 850px) ─── */}
      <div className="lg:col-span-9 w-full max-w-[850px] space-y-6">
        {/* Live Invoice Header Preview */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F1424] via-[#0D1017] to-[#0F1424] border border-[#1E293F] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#818CF8]">
            <div className="flex items-center gap-1.5 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Invoice Header Preview</span>
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">
              {formValues.invoicePrefix}000123
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#080B11] border border-[#1A2337] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <h4 className="font-bold text-[#F8FAFC] text-sm tracking-tight">
                {formValues.name || 'Your Company Name'}
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                {formValues.address || 'Company Address Line'}, {formValues.state}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B] pt-0.5 font-mono">
                {formValues.gstin && (
                  <span className="text-[#A5B4FC]">GSTIN: {formValues.gstin}</span>
                )}
                {formValues.phone && <span>Tel: {formValues.phone}</span>}
                {formValues.email && <span>Email: {formValues.email}</span>}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141B2D] border border-[#222E48]">
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="text-[11px] font-semibold text-[#CBD5E1]">
                Tax Invoicing Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Settings Form Panel */}
        <div className="p-6 sm:p-7 rounded-xl bg-[#0D1118] border border-[#222A38] shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1E293F]">
                  <Building2 className="w-4 h-4 text-[#818CF8]" />
                  <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                    Business & Brand Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Legal Business / Enterprise Name *"
                    placeholder="e.g. Apex Tech Solutions Private Limited"
                    error={errors.name?.message}
                    {...register('name')}
                  />

                  <Input
                    label="Owner / Managing Director Name"
                    placeholder="e.g. Aniruddh Sharma"
                    error={errors.ownerName?.message}
                    {...register('ownerName')}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Sequential Invoice Prefix *"
                      placeholder="e.g. INV-2026- or BILL/"
                      helperText="Prefix placed before sequential bill numbers (e.g., INV-2026-000001)"
                      error={errors.invoicePrefix?.message}
                      {...register('invoicePrefix')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Contact & Location */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1E293F]">
                  <MapPin className="w-4 h-4 text-[#818CF8]" />
                  <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                    Operating Address & Contact Channels
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Input
                      label="Official Registered Address *"
                      placeholder="e.g. Suite 402, Titanium City Centre, Prahlad Nagar"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                  </div>

                  <Select
                    label="Operating State / UT (For GST Jurisdiction) *"
                    options={stateOptions}
                    error={errors.state?.message}
                    {...register('state')}
                  />

                  <Input
                    label="Primary Business Contact Mobile"
                    placeholder="e.g. 9876543210"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Billing & Accounts Email Address"
                      type="email"
                      placeholder="billing@apextech.com"
                      helperText="Printed on generated tax invoices as your customer support email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: GST & Tax */}
            {activeTab === 'gst' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1E293F]">
                  <Receipt className="w-4 h-4 text-[#818CF8]" />
                  <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                    Statutory GST & Rule Engine
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Input
                      label="GST Identification Number (GSTIN)"
                      placeholder="24ABCDE1234F1Z5"
                      helperText="15-character official statutory GST identification number"
                      error={errors.gstin?.message}
                      {...register('gstin')}
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#080B11] border border-[#1E293F] flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#94A3B8] space-y-1">
                      <span className="font-bold text-[#F8FAFC]">
                        Automated Place of Supply Routing
                      </span>
                      <p className="leading-relaxed">
                        Sales within <strong className="text-white">{formValues.state || 'your operating state'}</strong> automatically split into <strong className="text-white">CGST + SGST</strong>. Out-of-state sales charge single <strong className="text-white">IGST</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-[#1E293F]">
              <div className="flex items-center gap-2 text-xs">
                {isDirty ? (
                  <span className="flex items-center gap-1.5 text-[#F59E0B] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                    You have unsaved changes
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#10B981]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Configuration is up to date
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={Save}
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Save Business Settings
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsForm;
