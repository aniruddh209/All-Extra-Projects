import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import ROUTES from '../constants/routes';

/**
 * 404 Not Found Page
 */
export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center text-[#F5F5F5]">
      <div className="max-w-md space-y-5 bg-[#0D1017] border border-[#1E293F] rounded-2xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] flex items-center justify-center mx-auto">
          <FileQuestion className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
            404
          </h1>
          <h2 className="text-lg font-semibold text-[#F5F5F5]">
            Page Not Found
          </h2>
          <p className="text-sm text-[#A1A1AA]">
            The invoice, page, or resource you are trying to access does not exist or has been relocated.
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

export default NotFoundPage;
