'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentForm from '@/reusable-components/ui/PaymentForm';
import { AlertCircle } from 'lucide-react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

function parseAmount(value: string | null): number {
	if (!value) return 0;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export default function PaymentPageClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [registrationStatus, setRegistrationStatus] = useState<'loading' | 'valid' | 'closed'>('loading');

	const registrationId = searchParams.get('registrationId') ?? '';
	const registrationNumber = searchParams.get('registrationNumber') ?? '';
	const amount = useMemo(() => parseAmount(searchParams.get('amount')), [searchParams]);

	useEffect(() => {
		if (!registrationId) {
			setRegistrationStatus('valid');
			return;
		}

		const checkRegistrationStatus = async () => {
			try {
				const response = await fetch(`/api/registrations?registrationId=${registrationId}`);
				const data = await response.json();
				
				if (data.registration && data.registration.event && !data.registration.event.isActive) {
					setRegistrationStatus('closed');
				} else {
					setRegistrationStatus('valid');
				}
			} catch (error) {
				console.error('Error checking registration status:', error);
				setRegistrationStatus('valid'); // Allow payment to proceed on error
			}
		};

		checkRegistrationStatus();
	}, [registrationId]);

	if (registrationStatus === 'closed') {
		return (
			<div className="min-h-screen bg-[#0a0a0a] px-4 py-20 flex items-center justify-center">
				<div className="max-w-lg w-full rounded-2xl border border-red-900/30 bg-[#0f0f0f] p-8 text-center space-y-4">
					<div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
						<AlertCircle className="text-red-500 w-8 h-8" />
					</div>
					<h1 className={`${cinzel.className} text-2xl font-bold text-white`}>Registration Closed</h1>
					<p className="text-gray-400">
						Registration for this event has been closed. Payment is no longer available.
					</p>
					<button
						onClick={() => router.push('/')}
						className="rounded-lg bg-[#4A5D45] px-5 py-3 font-semibold text-white hover:bg-[#5a6f55] w-full"
					>
						Back to Home
					</button>
				</div>
			</div>
		);
	}

	if (registrationStatus === 'loading') {
		return (
			<div className="min-h-screen bg-[#0a0a0a] px-4 py-20 flex items-center justify-center text-white">
				<div className="text-center text-gray-400">Loading...</div>
			</div>
		);
	}

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