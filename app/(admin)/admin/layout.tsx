"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/staff", label: "Staff", icon: "👥" },
  { href: "/admin/services", label: "Services", icon: "✂️" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/schedule", label: "Schedule", icon: "🕐" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <div className="glass-card p-4 sticky top-24">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-3">
              Admin Panel
            </h2>
            <nav className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-violet-500/10 text-violet-400"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
