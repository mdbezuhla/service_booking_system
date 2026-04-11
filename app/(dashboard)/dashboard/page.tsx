"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import type { BookingDTO } from "@/types";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.startTime) > new Date()
  );
  const past = bookings.filter(
    (b) => b.status === "CANCELLED" || new Date(b.startTime) <= new Date()
  );

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    CANCELLED: "bg-red-500/10 text-red-400",
    COMPLETED: "bg-blue-500/10 text-blue-400",
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <Link href="/dashboard/profile">
          <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Edit Profile
          </button>
        </Link>
      </div>

      {bookings.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-neutral-500 text-lg mb-4">You have no bookings yet.</p>
          <Link href="/book" className="text-violet-400 hover:text-violet-300 font-medium">
            Book your first appointment →
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="glass-card p-5 flex items-center justify-between card-hover block"
              >
                <div>
                  <p className="text-white font-medium">{booking.serviceName}</p>
                  <p className="text-neutral-500 text-sm">
                    with {booking.staffName} ·{" "}
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {past.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="glass-card p-5 flex items-center justify-between opacity-60 hover:opacity-80 transition-opacity block"
              >
                <div>
                  <p className="text-white font-medium">{booking.serviceName}</p>
                  <p className="text-neutral-500 text-sm">
                    with {booking.staffName} ·{" "}
                    {new Date(booking.startTime).toLocaleDateString("en-IE", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
