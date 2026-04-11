"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { StaffDTO } from "@/types";

export default function AdminSchedulePage() {
  const [staff, setStaff] = useState<StaffDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("9");
  const [endHour, setEndHour] = useState("17");
  const [slotDuration, setSlotDuration] = useState("60");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        setStaff(data);
        setLoading(false);
      });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/admin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId: selectedStaffId,
        date,
        startHour: parseInt(startHour),
        endHour: parseInt(endHour),
        slotDuration: parseInt(slotDuration),
      }),
    });

    if (res.ok) {
      toast.success("Time slots generated successfully");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to generate slots");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Schedule Management</h1>

      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Generate Time Slots</h2>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="schedule-staff" className="block text-sm font-medium text-neutral-300 mb-1.5">
              Staff Member
            </label>
            <select
              id="schedule-staff"
              className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              required
            >
              <option value="">Select staff member</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <Input
            id="schedule-date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              id="schedule-start"
              label="Start Hour"
              type="number"
              min="0"
              max="23"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              required
            />
            <Input
              id="schedule-end"
              label="End Hour"
              type="number"
              min="1"
              max="24"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              required
            />
            <Input
              id="schedule-duration"
              label="Slot Duration (min)"
              type="number"
              min="15"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              required
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Generate Slots
          </Button>
        </form>
      </div>
    </div>
  );
}
