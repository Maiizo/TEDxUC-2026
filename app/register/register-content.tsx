'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RegistrationForm from '@/reusable-components/ui/RegistrationForm';
import { AlertCircle } from 'lucide-react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

type EventKey = 'pre-event-1' | 'main-event';

export default function RegisterContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMainEventClosed, setIsMainEventClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventQuery = searchParams.get('event');

  const eventKey: EventKey | undefined =
    eventQuery === 'pre-event-1' || eventQuery === 'main-event' ? eventQuery : undefined;

  useEffect(() => {
    const checkMainEventStatus = async () => {
      try {
        const response = await fetch('/api/registrations');
        const data = await response.json();
        
        if (data.events) {
          const mainEvent = data.events.find((e: any) => e.type.toLowerCase().includes('main event'));
          setIsMainEventClosed(mainEvent && !mainEvent.isActive);
        }
      } catch (error) {
        console.error('Error checking event status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkMainEventStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (isMainEventClosed && !eventQuery) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-6 gap-6">
        <div className="bg-[#0f0f0f] border border-red-900/30 rounded-2xl p-8 max-w-xl w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="text-red-500 w-8 h-8" />
          </div>
          <h3 className={`${cinzel.className} text-2xl text-white`}>Registration Closed</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Registration for the main event has been closed. Thank you for your interest in TEDxUC 2026!
          </p>
        </div>
      </div>
    );
  }

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
                setIsOpen(false);
                router.push(
                  `/payment?registrationId=${encodeURIComponent(data.id)}&registrationNumber=${encodeURIComponent(data.registrationNumber)}&amount=${encodeURIComponent(String(data.paymentAmount))}`
                );
            }}
          />
        </div>
      )}
    </div>
  );
}
