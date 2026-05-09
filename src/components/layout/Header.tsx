import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background1 border-b border-border flex items-center h-16 px-4 sm:px-6 lg:px-8">
      {/* ── Logo ── */}
      <Link
        href="/"
        className="text-xl font-bold tracking-widest text-primary uppercase"
      >
        AI-FICATION
      </Link>

      {/* ── Nav — absolutely centered ── */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Navbar />
      </div>
    </header>
  );
}
