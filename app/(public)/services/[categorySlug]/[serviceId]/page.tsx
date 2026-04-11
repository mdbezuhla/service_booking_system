import Link from "next/link";
import { ServiceService } from "@/services/ServiceService";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; serviceId: string }>;
}) {
  const { categorySlug, serviceId } = await params;
  const serviceService = new ServiceService();
  const service = await serviceService.getServiceById(serviceId);

  if (!service) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href={`/services/${categorySlug}`} className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
          ← Back to {service.categoryName || "Services"}
        </Link>
      </div>

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{service.name}</h1>
            <p className="text-neutral-400">{service.duration} minutes</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-violet-400">€{service.price}</p>
          </div>
        </div>

        <p className="text-neutral-300 leading-relaxed mb-8">{service.description}</p>

        <div className="border-t border-neutral-800 pt-8">
          <h2 className="text-xl font-semibold text-white mb-6">Available Stylists</h2>

          {service.staff.length === 0 ? (
            <p className="text-neutral-500">No stylists currently available for this service.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.staff.map((member) => (
                <Link
                  key={member.id}
                  href={`/staff/${member.id}`}
                  className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-violet-400 transition-colors">{member.name}</p>
                    {member.bio && (
                      <p className="text-neutral-500 text-sm line-clamp-1">{member.bio}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link href={`/book?serviceId=${service.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              Book This Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
