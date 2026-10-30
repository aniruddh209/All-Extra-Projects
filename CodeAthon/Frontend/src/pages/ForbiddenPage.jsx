import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import ROUTES from '../constants/routes';

/**
 * 403 Forbidden Page
 */
export const ForbiddenPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center text-[#F5F5F5]">
      <div className="max-w-md space-y-5 bg-[#0D1017] border border-[#1E293F] rounded-2xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center mx-auto">
          <ShieldX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Access Restricted
          </h1>
          <p className="text-sm text-[#A1A1AA]">
            You do not have administrative permission to view this section. Please contact your business owner if you believe this is an error.
          </p>
        </div>

        <div className="pt-2">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="secondary" className="w-full" leftIcon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
