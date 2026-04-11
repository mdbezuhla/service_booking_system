import Link from "next/link";
import { ServiceService } from "@/services/ServiceService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Glamour Hair Salon",
  description: "Browse our full range of hair styling services. From cuts and colouring to treatments and styling.",
};

export default async function ServicesPage() {
  const serviceService = new ServiceService();
  const categories = await serviceService.getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Discover our complete range of premium hair services, from classic cuts to transformative treatments.
        </p>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">No services available yet. Check back soon!</p>
        </div>
      )}

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
              <Link
                href={`/services/${category.slug}`}
                className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${category.slug}/${service.id}`}
                  className="glass-card p-6 card-hover group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-neutral-500 text-sm mt-1">{service.duration} min</p>
                    </div>
                    <span className="text-lg font-bold text-violet-400">€{service.price}</span>
                  </div>
                  <p className="text-neutral-400 text-sm line-clamp-2">{service.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
