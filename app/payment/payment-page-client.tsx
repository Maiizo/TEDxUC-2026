'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentForm from '@/reusable-components/ui/PaymentForm';

function parseAmount(value: string | null): number {
	if (!value) return 0;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export default function PaymentPageClient() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const registrationId = searchParams.get('registrationId') ?? '';
	const registrationNumber = searchParams.get('registrationNumber') ?? '';
	const amount = useMemo(() => parseAmount(searchParams.get('amount')), [searchParams]);

	if (!registrationId || !registrationNumber) {
		return (
			<div className="min-h-screen bg-[#0a0a0a] px-4 py-20 flex items-center justify-center">
				<div className="max-w-lg w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 text-center text-white">
					<h1 className="text-2xl font-bold mb-3">Payment details missing</h1>
					<p className="text-gray-400 mb-6">
						Open this page from a successful registration so your payment reference can be loaded.
					</p>
					<button
						onClick={() => router.push('/register')}
						className="rounded-lg bg-[#4A5D45] px-5 py-3 font-semibold text-white hover:bg-[#5a6f55]"
					>
						Back to registration
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] px-4 py-10 sm:py-14 flex items-start justify-center">
			<div className="w-full max-w-4xl">
				<div className="mb-6 text-center sm:text-left">
					<p className="text-xs uppercase tracking-[0.3em] text-[#8ab385] mb-2">Payment step</p>
					<h1 className="text-3xl sm:text-4xl font-bold text-white">Complete your payment</h1>
					<p className="text-gray-400 mt-2">
						Registration ID <span className="font-mono text-gray-200">{registrationNumber}</span>
					</p>
				</div>

				<div className="rounded-3xl border border-[#2a2a2a] bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden">
					<PaymentForm
						registrationId={registrationId}
						registrationNumber={registrationNumber}
						amount={amount}
						onClose={() => router.push('/register')}
					/>
				</div>
			</div>
		</div>
	);
}