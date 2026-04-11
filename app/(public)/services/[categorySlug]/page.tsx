import Link from "next/link";
import { ServiceService } from "@/services/ServiceService";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const serviceService = new ServiceService();
  const category = await serviceService.getCategoryBySlug(categorySlug);

  if (!category) notFound();

  const services = await serviceService.getServicesByCategory(categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/services" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
          ← All Services
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">{category.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/services/${categorySlug}/${service.id}`}
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
            <p className="text-neutral-400 text-sm line-clamp-3">{service.description}</p>
          </Link>
        ))}
      </div>

      {services.length === 0 && (
        <p className="text-neutral-500 text-center py-12">No services in this category yet.</p>
      )}
    </div>
  );
}
