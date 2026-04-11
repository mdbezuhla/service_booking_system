"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { ServiceDTO, CategoryDTO } from "@/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    categoryId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([svc, cats]) => {
      setServices(svc);
      setCategories(cats);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        categoryId: formData.categoryId,
      }),
    });

    if (res.ok) {
      toast.success("Service created");
      setFormData({ name: "", description: "", price: "", duration: "", categoryId: "" });
      setShowForm(false);
      loadData();
    } else {
      toast.error("Failed to create service");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Service deleted");
      loadData();
    } else {
      toast.error("Failed to delete");
    }
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Services Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Service"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 mb-8 space-y-4">
          <Input id="svc-name" label="Name" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required />
          <div>
            <label htmlFor="svc-desc" className="block text-sm font-medium text-neutral-300 mb-1.5">Description</label>
            <textarea
              id="svc-desc"
              className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="svc-price" label="Price (€)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))} required />
            <Input id="svc-duration" label="Duration (min)" type="number" value={formData.duration} onChange={(e) => setFormData((f) => ({ ...f, duration: e.target.value }))} required />
          </div>
          <div>
            <label htmlFor="svc-cat" className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
            <select
              id="svc-cat"
              className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={formData.categoryId}
              onChange={(e) => setFormData((f) => ({ ...f, categoryId: e.target.value }))}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Button type="submit" isLoading={isSubmitting}>Create Service</Button>
        </form>
      )}

      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.id} className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{svc.name}</p>
              <p className="text-neutral-500 text-sm">
                {svc.duration} min · {svc.categoryName || "No category"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-violet-400 font-semibold">€{svc.price}</span>
              <Button variant="danger" size="sm" onClick={() => handleDelete(svc.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-neutral-500 text-center py-8">No services yet. Create a category first, then add services.</p>
        )}
      </div>
    </div>
  );
}
