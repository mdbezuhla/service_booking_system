"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { StaffWithServicesDTO } from "@/types";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffWithServicesDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadStaff = () => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        setStaff(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio: bio || null }),
    });

    if (res.ok) {
      toast.success("Staff member created");
      setName("");
      setBio("");
      setShowForm(false);
      loadStaff();
    } else {
      toast.error("Failed to create staff member");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Staff member deleted");
      loadStaff();
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Staff Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Staff"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 mb-8 space-y-4">
          <Input id="staff-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input id="staff-bio" label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <Button type="submit" isLoading={isSubmitting}>Create</Button>
        </form>
      )}

      <div className="space-y-3">
        {staff.map((member) => (
          <div key={member.id} className="glass-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{member.name}</p>
                <p className="text-neutral-500 text-sm">
                  {member.services.length} service{member.services.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={() => handleDelete(member.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-neutral-500 text-center py-8">No staff members yet.</p>
        )}
      </div>
    </div>
  );
}
