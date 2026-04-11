"use client";

import { useState, useEffect, useCallback } from "react";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { BookingDTO } from "@/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadBookings = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, [statusFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    if (res.ok) {
      toast.success("Booking cancelled");
      loadBookings();
    } else {
      toast.error("Failed to cancel");
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    CANCELLED: "bg-red-500/10 text-red-400",
    COMPLETED: "bg-blue-500/10 text-blue-400",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">All Bookings</h1>

      <div className="flex gap-2 mb-6">
        {["", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? "bg-violet-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            {status || "All"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{booking.serviceName}</p>
                <p className="text-neutral-500 text-sm">
                  {booking.staffName} ·{" "}
                  {new Date(booking.startTime).toLocaleDateString("en-IE", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(booking.startTime).toLocaleTimeString("en-IE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
                <span className="text-violet-400 font-semibold">€{booking.totalPrice}</span>
                {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-neutral-500 text-center py-8">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
