// app/register/page.tsx
import { Suspense } from 'react';
import RegisterContent from './register-content';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <RegisterContent />
    </Suspense>
  );
}