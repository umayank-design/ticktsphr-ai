import Link from "next/link";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-cyan-400">
          Ticktsphr AI
        </Link>

        <nav className="hidden md:flex gap-8 text-slate-300">
          <Link href="/features">Features</Link>
<Link href="/solutions">Solutions</Link>
<Link href="/pricing">Pricing</Link>
<Link href="/about">About</Link>
<Link href="/contact">Contact</Link>
<Link href="/book-demo">Book Demo</Link>
<Link href="/about">About</Link>
<Link href="/contact">Contact</Link>
        </nav>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 border border-slate-700 rounded-lg text-white"
          >
            Login
          </Link>

          <Link
            href="/book-demo"
            className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
}