import Link from "next/link";
import Image from "next/image";
import { StaffService } from "@/services/StaffService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team — Glamour Hair Salon",
  description: "Meet our expert team of hair stylists. Each brings years of experience and passion for creating your perfect look.",
};

export default async function StaffPage() {
  const staffService = new StaffService();
  const staff = await staffService.getAllStaff();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Team</h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Meet our talented stylists. Each one brings unique expertise and a passion for making you look your best.
        </p>
      </div>

      {staff.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">Our team page is coming soon!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff.map((member) => (
          <Link
            key={member.id}
            href={`/staff/${member.id}`}
            className="glass-card overflow-hidden card-hover group"
          >
            <div className="h-48 bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-2">
                {member.name}
              </h3>
              {member.bio && (
                <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{member.bio}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {member.services.slice(0, 3).map((svc) => (
                  <span
                    key={svc.id}
                    className="text-xs bg-violet-500/10 text-violet-400 px-2.5 py-1 rounded-full"
                  >
                    {svc.name}
                  </span>
                ))}
                {member.services.length > 3 && (
                  <span className="text-xs text-neutral-500 px-2.5 py-1">
                    +{member.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
