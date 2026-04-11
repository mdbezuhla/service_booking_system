"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { BookingDetailDTO } from "@/types";
import { use } from "react";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (res.ok) {
        toast.success("Booking cancelled");
        router.push("/dashboard");
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-neutral-500 text-lg">Booking not found.</p>
      </div>
    );
  }

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";
  const isFuture = new Date(booking.startTime) > new Date();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
        ← Back to Dashboard
      </Link>

      <div className="glass-card p-8 mt-6">
        <h1 className="text-2xl font-bold text-white mb-6">Booking Details</h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
            <span className="text-neutral-400">Service</span>
            <span className="text-white font-medium">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
            <span className="text-neutral-400">Stylist</span>
            <span className="text-white font-medium">{booking.staffName}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
            <span className="text-neutral-400">Date & Time</span>
            <span className="text-white font-medium">
              {new Date(booking.startTime).toLocaleDateString("en-IE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(booking.startTime).toLocaleTimeString("en-IE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
            <span className="text-neutral-400">Duration</span>
            <span className="text-white font-medium">{booking.serviceDuration} min</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
            <span className="text-neutral-400">Status</span>
            <span className="text-white font-medium">{booking.status}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <span className="text-violet-400 font-medium">Total Paid</span>
            <span className="text-violet-400 font-bold text-xl">€{booking.totalPrice}</span>
          </div>
        </div>

        {canCancel && isFuture && (
          <div className="mt-8">
            <Button variant="danger" onClick={handleCancel} isLoading={cancelling} className="w-full">
              Cancel Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
