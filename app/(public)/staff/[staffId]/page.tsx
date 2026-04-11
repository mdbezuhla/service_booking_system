import Link from "next/link";
import Image from "next/image";
import { StaffService } from "@/services/StaffService";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = await params;
  const staffService = new StaffService();
  const member = await staffService.getStaffById(staffId);

  if (!member) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/staff" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
          ← All Team Members
        </Link>
      </div>

      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            {member.photoUrl ? (
              <Image src={member.photoUrl} alt={member.name} width={96} height={96} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{member.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{member.name}</h1>
            {member.bio && <p className="text-neutral-400 leading-relaxed">{member.bio}</p>}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <h2 className="text-xl font-semibold text-white mb-6">Services Offered</h2>

          {member.services.length === 0 ? (
            <p className="text-neutral-500">No services listed yet.</p>
          ) : (
            <div className="space-y-3">
              {member.services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">{svc.name}</p>
                    <p className="text-neutral-500 text-sm">{svc.duration} min</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-violet-400 font-semibold">€{svc.price}</span>
                    <Link href={`/book?serviceId=${svc.id}&staffId=${member.id}`}>
                      <Button size="sm">Book</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
