import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog Component
 * Prevents accidental destructive actions (e.g. deleting customers or items).
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-[#F5F5F5]">{title}</h4>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202020]">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
