"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import type { CategoryDTO } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    if (res.ok) {
      toast.success("Category created");
      setName("");
      setSlug("");
      setShowForm(false);
      loadCategories();
    } else {
      toast.error("Failed to create category");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? All related services must be removed first.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Category deleted");
      loadCategories();
    } else {
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Category"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass-card p-6 mb-8 space-y-4">
          <Input id="cat-name" label="Name" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
          <Input id="cat-slug" label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Button type="submit" isLoading={isSubmitting}>Create Category</Button>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{cat.name}</p>
              <p className="text-neutral-500 text-sm">/{cat.slug}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>
              Delete
            </Button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-neutral-500 text-center py-8">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
