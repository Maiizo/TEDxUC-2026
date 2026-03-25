'use client';

import { useState, useEffect } from 'react';
import PaymentForm from '@/reusable-components/ui/PaymentForm';

interface Registration {
  id: string;
  registrationNumber: string;
  fullName: string;
  email: string;
}

export default function TestPaymentPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(
          data.registrations.map((r: any) => ({
            id: r.id,
            registrationNumber: r.registrationNumber,
            fullName: r.fullName,
            email: r.email,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Test Payment Submission</h1>
        <p className="text-gray-400 mb-8">Select a registration and submit payment proof to test the admin dashboard</p>

        {selectedRegistration ? (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedRegistration(null)}
              className="mb-6 text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1"
            >
              ← Back to registrations
            </button>
            <PaymentForm
              registrationId={selectedRegistration.id}
              registrationNumber={selectedRegistration.registrationNumber}
              amount={150000}
              onClose={() => {
                setSelectedRegistration(null);
                fetchRegistrations();
              }}
              onSuccess={() => {
                console.log('Payment submitted successfully');
              }}
            />
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : registrations.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No registrations found</p>
                <p className="text-gray-500 text-sm mb-6">
                  First, generate test data using the seed endpoint:
                </p>
                <code className="block bg-black p-4 rounded text-green-400 text-sm mb-4">
                  POST /api/seed with {'{total: 5}'} in body
                </code>
                <button
                  onClick={fetchRegistrations}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#222] transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{registration.fullName}</h3>
                        <p className="text-gray-400 text-sm">{registration.email}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Reg: {registration.registrationNumber}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedRegistration(registration)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                      >
                        Submit Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
