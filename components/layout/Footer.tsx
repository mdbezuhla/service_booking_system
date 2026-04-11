import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-7 7m7-7l-7-7" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Glamour
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Premium hair salon experience. Book your appointment online and enjoy world-class styling.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">Services</Link></li>
              <li><Link href="/staff" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">Our Team</Link></li>
              <li><Link href="/book" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">Book Now</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/sign-in" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">Sign In</Link></li>
              <li><Link href="/sign-up" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">Create Account</Link></li>
              <li><Link href="/dashboard" className="text-neutral-500 hover:text-violet-400 text-sm transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-neutral-500 text-sm">
              <li>123 Style Avenue</li>
              <li>Dublin, Ireland</li>
              <li>contact@glamour.com</li>
              <li>+353 1 234 5678</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/50 mt-8 pt-8 text-center text-neutral-600 text-sm">
          © {new Date().getFullYear()} Glamour Hair Salon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
