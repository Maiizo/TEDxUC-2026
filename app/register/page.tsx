// app/register/page.tsx
'use client';

import { useState } from 'react';
import RegistrationForm from '@/reusable-components/ui/RegistrationForm';

export default function RegisterPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 gap-6">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <RegistrationForm onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}