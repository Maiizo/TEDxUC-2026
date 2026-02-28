"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalRegistrations: number;
  paidRegistrations: number;
  pendingRegistrations: number;
  totalRevenue: number;
}

interface EventData {
  id: string;
  name: string;
  type: string;
  date: string;
  quota: number;
  registeredCount: number;
  price: number;
  isActive: boolean;
  _count: { registrations: number };
}

interface RegistrationData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  foodAllergy: string;
  registrationNumber: string;
  status: string;
  attendanceStatus: string;
  createdAt: string;
  event: { name: string; type: string };
  payments: { status: string; paymentMethod: string; amount: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "registrations">("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        setStats(data.data.stats);
        setEvents(data.data.events);
        setRegistrations(data.data.registrations);
      }
    } catch {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "success":
        return "text-green-400 bg-green-950 border-green-800";
      case "pending":
        return "text-yellow-400 bg-yellow-950 border-yellow-800";
      case "cancelled":
      case "failed":
        return "text-red-400 bg-red-950 border-red-800";
      case "expired":
        return "text-gray-400 bg-gray-900 border-gray-700";
      default:
        return "text-gray-400 bg-gray-900 border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">
              TEDx<span className="text-red-600">UC</span>
              <span className="text-gray-500 font-normal ml-2 text-sm">Admin</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Registrations"
            value={stats?.totalRegistrations ?? 0}
            color="purple"
          />
          <StatCard
            label="Paid"
            value={stats?.paidRegistrations ?? 0}
            color="green"
          />
          <StatCard
            label="Pending"
            value={stats?.pendingRegistrations ?? 0}
            color="yellow"
          />
          <StatCard
            label="Revenue"
            value={`Rp ${(stats?.totalRevenue ?? 0).toLocaleString("id-ID")}`}
            color="green"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-800">
          {(["overview", "events", "registrations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Events Summary */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{event.name}</h3>
                        <p className="text-sm text-purple-400">{event.type}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          event.isActive
                            ? "text-green-400 bg-green-950 border-green-800"
                            : "text-gray-500 bg-gray-900 border-gray-700"
                        }`}
                      >
                        {event.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span className="text-gray-300">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registered</span>
                        <span className="text-gray-300">
                          {event.registeredCount} / {event.quota}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price</span>
                        <span className="text-gray-300">
                          {event.price === 0
                            ? "Free"
                            : `Rp ${event.price.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-linear-to-r from-green-500 to-purple-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (event.registeredCount / event.quota) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-gray-600 col-span-full text-center py-8">
                    No events found
                  </p>
                )}
              </div>
            </section>

            {/* Recent Registrations */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">
                Recent Registrations
              </h2>
              <RegistrationTable
                registrations={registrations.slice(0, 10)}
                statusColor={statusColor}
              />
            </section>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">All Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Quota</th>
                    <th className="text-left py-3 px-4 font-medium">Registered</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-gray-900 hover:bg-gray-950/50"
                    >
                      <td className="py-3 px-4 text-white font-medium">{event.name}</td>
                      <td className="py-3 px-4 text-purple-400">{event.type}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(event.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{event.quota}</td>
                      <td className="py-3 px-4 text-gray-300">{event.registeredCount}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {event.price === 0 ? "Free" : `Rp ${event.price.toLocaleString("id-ID")}`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            event.isActive
                              ? "text-green-400 bg-green-950 border-green-800"
                              : "text-gray-500 bg-gray-900 border-gray-700"
                          }`}
                        >
                          {event.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {events.length === 0 && (
                <p className="text-gray-600 text-center py-8">No events found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "registrations" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              All Registrations
            </h2>
            <RegistrationTable
              registrations={registrations}
              statusColor={statusColor}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: "green" | "purple" | "yellow";
}) {
  const borderColors = {
    green: "border-green-800/50 hover:border-green-700",
    purple: "border-purple-800/50 hover:border-purple-700",
    yellow: "border-yellow-800/50 hover:border-yellow-700",
  };
  const valueColors = {
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  return (
    <div
      className={`bg-gray-950 border ${borderColors[color]} rounded-xl p-5 transition-colors`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColors[color]}`}>{value}</p>
    </div>
  );
}

function RegistrationTable({
  registrations,
  statusColor,
}: {
  registrations: RegistrationData[];
  statusColor: (s: string) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-500">
            <th className="text-left py-3 px-4 font-medium">Reg #</th>
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium">Email</th>
            <th className="text-left py-3 px-4 font-medium">Event</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Payment</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr
              key={reg.id}
              className="border-b border-gray-900 hover:bg-gray-950/50"
            >
              <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                {reg.registrationNumber}
              </td>
              <td className="py-3 px-4 text-white font-medium">{reg.fullName}</td>
              <td className="py-3 px-4 text-gray-400">{reg.email}</td>
              <td className="py-3 px-4 text-purple-400">{reg.event.type}</td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${statusColor(
                    reg.status
                  )}`}
                >
                  {reg.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {reg.payments[0] ? (
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${statusColor(
                      reg.payments[0].status
                    )}`}
                  >
                    {reg.payments[0].paymentMethod}
                  </span>
                ) : (
                  <span className="text-gray-600 text-xs">—</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">
                {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {registrations.length === 0 && (
        <p className="text-gray-600 text-center py-8">No registrations found</p>
      )}
    </div>
  );
}
