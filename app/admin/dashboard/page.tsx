'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  paidRegistrations: number;
  pendingRegistrations: number;
  totalPayments: number;
  successfulPayments: number;
  totalRevenue: number;
}

interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  quota: number;
  registeredCount: number;
  price: number;
  isActive: boolean;
}

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  status: string;
  registrationNumber: string;
  attendanceStatus: string;
  event: {
    name: string;
    type: string;
  };
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string | null;
  registration: {
    fullName: string;
    email: string;
    event: {
      name: string;
    };
  };
  createdAt: string;
}

interface Admin {
  id: string;
  email: string;
  createdAt: string;
}

interface DashboardData {
  stats: Stats;
  events: Event[];
  registrations: Registration[];
  payments: Payment[];
  admins: Admin[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'events' | 'registrations' | 'payments' | 'admins'>('stats');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'No data available'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">TEDxUC Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1">
            {[
              { key: 'stats', label: 'Statistics' },
              { key: 'events', label: 'Events' },
              { key: 'registrations', label: 'Registrations' },
              { key: 'payments', label: 'Payments' },
              { key: 'admins', label: 'Admins' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab.key
                    ? 'text-white border-b-2 border-red-600'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Overview Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Events" value={data.stats.totalEvents} subtitle={`${data.stats.activeEvents} active`} />
              <StatCard title="Total Registrations" value={data.stats.totalRegistrations} subtitle={`${data.stats.paidRegistrations} paid`} />
              <StatCard title="Successful Payments" value={data.stats.successfulPayments} subtitle={`of ${data.stats.totalPayments} total`} />
              <StatCard title="Total Revenue" value={formatCurrency(data.stats.totalRevenue)} subtitle="All time" />
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Events ({data.events.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-zinc-900 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Quota</th>
                    <th className="px-4 py-3 text-left">Registered</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.events.map((event) => (
                    <tr key={event.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3">{event.name}</td>
                      <td className="px-4 py-3">{event.type}</td>
                      <td className="px-4 py-3">{formatDate(event.date)}</td>
                      <td className="px-4 py-3">{event.quota}</td>
                      <td className="px-4 py-3">{event.registeredCount}</td>
                      <td className="px-4 py-3">{formatCurrency(event.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${event.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Registrations ({data.registrations.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-zinc-900 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Reg #</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-sm">{reg.registrationNumber}</td>
                      <td className="px-4 py-3">{reg.fullName}</td>
                      <td className="px-4 py-3 text-sm">{reg.email}</td>
                      <td className="px-4 py-3 text-sm">{reg.phoneNumber}</td>
                      <td className="px-4 py-3 text-sm">{reg.event.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          reg.status === 'paid' ? 'bg-green-900 text-green-300' :
                          reg.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          reg.attendanceStatus === 'attended' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {reg.attendanceStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(reg.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Payments ({data.payments.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-zinc-900 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Transaction ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-xs">{payment.transactionId || 'N/A'}</td>
                      <td className="px-4 py-3">{payment.registration.fullName}</td>
                      <td className="px-4 py-3 text-sm">{payment.registration.event.name}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-sm uppercase">{payment.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'success' ? 'bg-green-900 text-green-300' :
                          payment.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          payment.status === 'failed' ? 'bg-red-900 text-red-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(payment.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Admin Users ({data.admins.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-zinc-900 rounded-lg overflow-hidden">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Updated At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-xs">{admin.id}</td>
                      <td className="px-4 py-3">{admin.email}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(admin.createdAt)}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(admin.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-red-600 transition">
      <h3 className="text-zinc-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
    </div>
  );
}
