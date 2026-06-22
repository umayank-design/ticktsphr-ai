import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Ticktsphr AI
            </h2>

            <p className="text-slate-400 leading-relaxed">
              AI-powered Incident Intelligence Platform helping
              enterprises predict, route and resolve incidents faster.
            </p>

            <div className="mt-6">
              <p className="text-slate-500 text-sm">
                Predict. Route. Resolve.
              </p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Product
            </h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <Link href="/features">Features</Link>
              <Link href="/solutions">Solutions</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/book-demo">Book Demo</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Company
            </h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <Link href="/">About Us</Link>
              <Link href="/book-demo">Contact</Link>
              <Link href="/">Careers</Link>
              <Link href="/">Partners</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Resources
            </h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <Link href="/">Blog</Link>
              <Link href="/">Documentation</Link>
              <Link href="/">Case Studies</Link>
              <Link href="/">Support</Link>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-slate-500 text-sm">
            © 2026 Ticktsphr AI. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0 text-slate-500 text-sm">
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Terms of Service</Link>
            <Link href="/">Security</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}