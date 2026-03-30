'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RegistrationForm from '@/reusable-components/ui/RegistrationForm';
import PaymentForm from '@/reusable-components/ui/PaymentForm';

type EventKey = 'pre-event-1' | 'main-event';

interface PaymentTarget {
  registrationId: string;
  registrationNumber: string;
  amount: number;
}

export default function RegisterContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);
  const searchParams = useSearchParams();
  const eventQuery = searchParams.get('event');

  const eventKey: EventKey | undefined =
    eventQuery === 'pre-event-1' || eventQuery === 'main-event' ? eventQuery : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-6 gap-6">
      {/* Tombol untuk membuka popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#4A5D45] hover:bg-[#5a6f55] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 active:scale-95"
      >
        Register Now
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <RegistrationForm
            eventKey={eventKey}
            onClose={() => setIsOpen(false)}
            onRegistrationSuccess={(data) => {
              if (eventKey === 'main-event') {
                setIsOpen(false);
                setPaymentTarget({
                  registrationId: data.id,
                  registrationNumber: data.registrationNumber,
                  amount: data.paymentAmount,
                });
              }
            }}
          />
        </div>
      )}

      {paymentTarget && (
        <div
          className="fixed inset-0 z-60 flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPaymentTarget(null);
          }}
        >
          <PaymentForm
            registrationId={paymentTarget.registrationId}
            registrationNumber={paymentTarget.registrationNumber}
            amount={paymentTarget.amount}
            onClose={() => setPaymentTarget(null)}
            onSuccess={() => setPaymentTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
