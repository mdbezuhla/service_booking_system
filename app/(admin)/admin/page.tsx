"use client";

import { useState, useEffect } from "react";
import Skeleton from "@/components/ui/Skeleton";
import type { AdminStatsDTO } from "@/types";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Bookings", value: stats?.totalBookings || 0, color: "from-violet-500 to-purple-500" },
    { label: "Confirmed", value: stats?.confirmedBookings || 0, color: "from-green-500 to-emerald-500" },
    { label: "Upcoming", value: stats?.upcomingBookings || 0, color: "from-blue-500 to-cyan-500" },
    { label: "Revenue", value: `€${stats?.totalRevenue || 0}`, color: "from-amber-500 to-orange-500" },
    { label: "Total Staff", value: stats?.totalStaff || 0, color: "from-pink-500 to-rose-500" },
    { label: "Total Services", value: stats?.totalServices || 0, color: "from-teal-500 to-cyan-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <p className="text-neutral-400 text-sm mb-2">{card.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
