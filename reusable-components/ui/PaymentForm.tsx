'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface PaymentFormProps {
  registrationId: string;
  registrationNumber: string;
  amount: number;
  onClose?: () => void;
  onSuccess?: () => void;
}

const BANK_DETAILS = {
  name: "PT TEDxUC",
  account: "1234567890",
  bank: "BCA"
};

export default function PaymentForm({ 
  registrationId, 
  registrationNumber, 
  amount,
  onClose,
  onSuccess 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [senderName, setSenderName] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [success, setSuccess] = useState(false);

  const displayAmount = amount > 0 ? amount : 50000;
  const bankQRData = `${BANK_DETAILS.bank}|${BANK_DETAILS.account}|${displayAmount}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!senderName.trim()) {
      setError('Please enter sender name');
      return;
    }

    if (!proofFile) {
      setError('Please upload payment proof');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('registrationId', registrationId);
      formData.append('senderName', senderName.trim());
      formData.append('proof', proofFile);
      formData.append('amount', String(amount));
      formData.append('paymentMethod', 'BCA');

      const res = await fetch('/api/payment', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit payment');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-5 sm:p-8 text-center max-w-md w-full">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold text-green-500 mb-2">Payment Submitted!</h2>
        <p className="text-gray-400 text-sm">
          Your payment proof has been submitted for verification. 
          Please check your email for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-5 sm:p-8 w-full max-w-4xl max-h-[88vh] overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Submit Payment</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Bank Details Section */}
      <div className="bg-[#0a0a0a] rounded-lg p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Bank Details</h3>
        <p className="text-xs text-gray-400 mb-4">
          Scan this transfer QR to pay to TEDxUC&apos;s BCA account, then upload your payment proof below.
        </p>
        <div className="space-y-3 text-gray-300 mb-6">
          <div className="flex justify-between gap-4">
            <span>Bank:</span>
            <span className="font-mono text-green-400 text-right">{BANK_DETAILS.bank}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Account Name:</span>
            <span className="font-mono text-green-400 text-right wrap-break-word">{BANK_DETAILS.name}</span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span>Account Number:</span>
            <div className="text-right">
              <div className="font-mono text-green-400 text-lg font-bold">{BANK_DETAILS.account}</div>
              <div className="font-mono text-green-400 text-lg font-bold mt-1">Amount: Rp {displayAmount.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center bg-white p-4 rounded-lg">
          <QRCodeCanvas
            value={bankQRData}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sender Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name on Bank Account *
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your name as it appears on the bank account"
            className="w-full bg-[#0a0a0a] border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Payment Proof *
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-green-500 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-xs text-gray-400 break-all text-center">
                  {proofFile ? proofFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-200 leading-relaxed">
            Note: Our team will verify your payment proof. You will receive an email once your payment is approved or rejected.
            If approved, the email includes your unique QR ticket for entry on event day.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Payment'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Registration ID: <span className="font-mono">{registrationNumber}</span>
        </p>
      </form>
    </div>
  );
}
