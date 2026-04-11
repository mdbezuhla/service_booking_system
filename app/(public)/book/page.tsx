"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Stepper from "@/components/booking/Stepper";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { ServiceDTO, StaffDTO, TimeSlotDTO } from "@/types";

const STEPS = ["Service", "Stylist", "Date & Time", "Review", "Payment", "Done"];

export default function BookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [staffList, setStaffList] = useState<StaffDTO[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<TimeSlotDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffDTO | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDTO | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initializedRef = useRef(false);


  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const preServiceId = searchParams.get("serviceId");
    const preStaffId = searchParams.get("staffId");

    fetch("/api/services")
      .then((r) => r.json())
      .then(async (data) => {
        setServices(data);
        setLoading(false);

        if (preServiceId) {
          const found = data.find((s: ServiceDTO) => s.id === preServiceId);
          if (found) {
            setSelectedService(found);

            const staffRes = await fetch(`/api/services/${preServiceId}`);
            const staffData = await staffRes.json();
            setStaffList(staffData.staff || []);

            if (preStaffId) {
              const staffFound = (staffData.staff || []).find(
                (s: StaffDTO) => s.id === preStaffId
              );
              if (staffFound) {
                setSelectedStaff(staffFound);
                setCurrentStep(2);
              } else {
                setCurrentStep(1);
              }
            } else {
              setCurrentStep(1);
            }
          }
        }
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const handleSelectService = async (svc: ServiceDTO) => {
    setSelectedService(svc);
    setSelectedStaff(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setStaffList([]);

    const res = await fetch(`/api/services/${svc.id}`);
    const data = await res.json();
    setStaffList(data.staff || []);
    setCurrentStep(1);
  };

  const handleSelectStaff = async (member: StaffDTO) => {
    setSelectedStaff(member);
    setSelectedDate(null);
    setSelectedSlot(null);

    const res = await fetch(`/api/staff/${member.id}/slots`);
    const data: TimeSlotDTO[] = await res.json();
    const dates = new Set(data.map((s) => s.startTime.split("T")[0]));
    setAvailableDates(Array.from(dates));
    setCurrentStep(2);
  };

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);

    if (selectedStaff) {
      const res = await fetch(`/api/staff/${selectedStaff.id}/slots?date=${date}`);
      const data = await res.json();
      setSlots(data);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedSlot || !session) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaff.id,
          slotId: selectedSlot.id,
          totalPrice: selectedService.price,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Booking failed");
        setIsSubmitting(false);
        return;
      }

      const booking = await res.json();
      setBookingId(booking.id);
      setCurrentStep(4);

      const payRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedService.price,
          bookingId: booking.id,
        }),
      });

      if (payRes.ok) {
        setCurrentStep(5);
        toast.success("Booking confirmed!");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsSubmitting(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Book Appointment</h1>

      <Stepper steps={STEPS} currentStep={currentStep} />

      <div className="glass-card p-8 mt-6">
        {currentStep === 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Select a Service</h2>
            <div className="space-y-3">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleSelectService(svc)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedService?.id === svc.id
                      ? "bg-violet-500/20 border border-violet-500/40"
                      : "bg-neutral-800/50 hover:bg-neutral-800 border border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{svc.name}</p>
                      <p className="text-neutral-500 text-sm">{svc.duration} min</p>
                    </div>
                    <span className="text-violet-400 font-semibold">€{svc.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Select a Stylist</h2>
            <div className="space-y-3">
              {staffList.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSelectStaff(member)}
                  className="w-full text-left p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-transparent transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    {member.bio && <p className="text-neutral-500 text-sm line-clamp-1">{member.bio}</p>}
                  </div>
                </button>
              ))}
              {staffList.length === 0 && (
                <p className="text-neutral-500 text-center py-8">No stylists available for this service.</p>
              )}
            </div>
            <Button variant="ghost" onClick={() => setCurrentStep(0)} className="mt-4">
              ← Back
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Select Date & Time</h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Available Dates</h3>
              <div className="flex flex-wrap gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleSelectDate(date)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedDate === date
                        ? "bg-violet-600 text-white"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {new Date(date + "T00:00:00").toLocaleDateString("en-IE", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
                {availableDates.length === 0 && (
                  <p className="text-neutral-500">No available dates found.</p>
                )}
              </div>
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-3">Available Times</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots
                    .filter((s) => !s.isBooked)
                    .map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setCurrentStep(3);
                        }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedSlot?.id === slot.id
                            ? "bg-violet-600 text-white"
                            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        }`}
                      >
                        {formatTime(slot.startTime)}
                      </button>
                    ))}
                </div>
                {slots.filter((s) => !s.isBooked).length === 0 && (
                  <p className="text-neutral-500">No available slots on this date.</p>
                )}
              </div>
            )}

            <Button variant="ghost" onClick={() => setCurrentStep(1)} className="mt-4">
              ← Back
            </Button>
          </div>
        )}

        {currentStep === 3 && selectedService && selectedStaff && selectedSlot && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Review Your Booking</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
                <span className="text-neutral-400">Service</span>
                <span className="text-white font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
                <span className="text-neutral-400">Stylist</span>
                <span className="text-white font-medium">{selectedStaff.name}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
                <span className="text-neutral-400">Date & Time</span>
                <span className="text-white font-medium">
                  {new Date(selectedSlot.startTime).toLocaleDateString("en-IE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {formatTime(selectedSlot.startTime)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-800/50 rounded-xl">
                <span className="text-neutral-400">Duration</span>
                <span className="text-white font-medium">{selectedService.duration} min</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <span className="text-violet-400 font-medium">Total</span>
                <span className="text-violet-400 font-bold text-xl">€{selectedService.price}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                ← Back
              </Button>
              <Button onClick={handleBooking} isLoading={isSubmitting} className="flex-1">
                Confirm & Pay
              </Button>
            </div>
          </div>
        )}

        {currentStep >= 4 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-neutral-400 mb-8">
              Your appointment has been booked successfully. You can view the details in your dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                View Dashboard
              </Button>
              <Button onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
            {bookingId && (
              <p className="text-neutral-600 text-sm mt-4">Booking ID: {bookingId}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
