import { Suspense } from 'react';
import PaymentPageClient from './payment-page-client';

export default function PaymentPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-[#0a0a0a] px-4 py-20 flex items-center justify-center text-white">
					<div className="text-center text-gray-400">Loading payment details...</div>
				</div>
			}
		>
			<PaymentPageClient />
		</Suspense>
	);
}