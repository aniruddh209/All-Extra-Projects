import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';
import billService from '../../../services/bill.service';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export const EmailInvoiceModal = ({
  isOpen,
  onClose,
  bill = null,
  shopName = '',
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (bill) {
      setRecipientEmail(bill.party?.email || '');
      setSubject(
        `Tax Invoice ${bill.invoiceNumber || ''} from ${bill.shop?.name || shopName || 'GST Billing'}`
      );
      setMessage(
        `Dear ${bill.party?.name || 'Customer'},\n\nPlease find attached the GST Tax Invoice ${bill.invoiceNumber || ''} for your recent transaction.\n\nThank you for your business!`
      );
    }
  }, [bill, shopName]);

  const emailMutation = useMutation({
    mutationFn: (payload) => billService.emailBill(bill._id, payload),
    onSuccess: () => {
      toast.success('Invoice emailed successfully to customer!');
      onClose();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to send invoice email';
      toast.error(msg);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast.error('Please enter a valid recipient email address');
      return;
    }

    emailMutation.mutate({
      recipientEmail: recipientEmail.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Tax Invoice PDF"
      size="md"
    >
      <form onSubmit={handleSend} className="space-y-4">
        <div className="p-3 rounded-lg bg-[#141414] border border-[#222] flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1C1C1C] flex items-center justify-center text-[#6366F1]">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-[#F5F5F5]">
              {bill?.invoiceNumber}
            </span>
            <p className="text-[11px] text-[#71717A]">
              The official PDF invoice will be generated and attached automatically.
            </p>
          </div>
        </div>

        <div>
          <Input
            label="Recipient Email Address *"
            type="email"
            placeholder="customer@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            label="Subject Line *"
            placeholder="Tax Invoice from..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">
            Email Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-[#151515] border border-[#252525] text-xs text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#6366F1] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={emailMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={emailMutation.isPending}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {emailMutation.isPending ? 'Sending...' : 'Send Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailInvoiceModal;
